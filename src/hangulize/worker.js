import _ from 'lodash'
import Navigo from 'navigo'

// self.importScripts('https://github.com/hangulize/hangulize.js/releases/download/0.1.2/hangulize-0.1.2.js')
self.importScripts('static/hangulize.js')
const H = self.hangulize

// -----------------------------------------------------------------------------
// Prefetched phonograms keeper

let phonograms = {}

function keepPhonemized (phonemizer, word, phonemized) {
  if (phonograms[phonemizer] === undefined) {
    phonograms[phonemizer] = {}
  }
  phonograms[phonemizer][word] = phonemized
}

function popPhonemized (phonemizer, word) {
  if (phonograms[phonemizer] === undefined) {
    return
  }

  const phonemized = phonograms[phonemizer][word]

  delete phonograms[phonemizer][word]
  if (_.size(phonograms[phonemizer]) === 0) {
    delete phonograms[phonemizer]
  }

  return phonemized
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

  // Keep prefetched phonograms.
  '/_phonemized/:phonemizer/:word/:phonemized': (H, params) => {
    keepPhonemized(params.phonemizer, params.word, params.phonemized)
    H.usePhonemizer(params.phonemizer, (word) => {
      return popPhonemized(params.phonemizer, word)
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
