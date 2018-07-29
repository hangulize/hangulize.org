import _ from 'lodash'
import Navigo from 'navigo'

self.importScripts('https://github.com/hangulize/hangulize.js/releases/download/0.1.2/hangulize-0.1.2.js')
const H = self.hangulize

// -----------------------------------------------------------------------------
// Prefetched pronunciation keeper

let pronounciations = {}

function keepPronounced (pronouncer, word, pronounced) {
  if (pronounciations[pronouncer] === undefined) {
    pronounciations[pronouncer] = {}
  }
  pronounciations[pronouncer][word] = pronounced
}

function popPronounced (pronouncer, word) {
  if (pronounciations[pronouncer] === undefined) {
    return
  }

  const pronounced = pronounciations[pronouncer][word]

  delete pronounciations[pronouncer][word]
  if (_.size(pronounciations[pronouncer]) === 0) {
    delete pronounciations[pronouncer]
  }

  return pronounced
}

// -----------------------------------------------------------------------------
// The client-side API

let route = {

  '/specs': (H) => {
    let specs = []

    // Remove some properties for JSON compatibility and size reduction.
    _.forEach(H.specs, (spec) => {
      spec = _.clone(spec)

      delete spec.source
      delete spec.$spec

      specs.push(spec)
    })

    return {
      specs: specs
    }
  },

  '/hangulized/:lang/:word': (H, params) => {
    const transcribed = H.hangulize(params.lang, params.word)

    return {
      lang: params.lang,
      word: params.word,
      transcribed: transcribed
    }
  },

  // Keep prefetched pronounciation.
  '/_pronounced/:pronouncer/:word/:pronounced': (H, params) => {
    keepPronounced(params.pronouncer, params.word, params.pronounced)
    H.usePronouncer(params.pronouncer, (word) => {
      return popPronounced(params.pronouncer, word)
    })
  }

}

// -----------------------------------------------------------------------------
// The Web Worker behavior

let lastResult = null
let router = new Navigo()
_.forEach(route, (handler, path) => {
  router.on(path, (params) => {
    lastResult = handler(H, params)
  })
})

// Call a handler and call back the result.
self.onmessage = (e) => {
  router.resolve(e.data.path)
  self.postMessage({ seq: e.data.seq, result: lastResult })
}

// Let consumer know worker is ready.
self.postMessage({ seq: -1, result: true })
