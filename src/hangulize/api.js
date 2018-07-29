import _ from 'lodash'

// TODO(sublee): Remove it.
// Translate function signatures to API paths.
let paths = {

  hangulize: (lang, word) => {
    lang = encodeURIComponent(lang)
    word = encodeURIComponent(word)
    return `/hangulized/${lang}/${word}`
  },

  specs: () =>
    '/specs'

}

// Prefetched pronunciation keeper.
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

// Handle the Hangulize API locally.
let route = {

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
  },

  '/specs': (H) => {
    let specs = []

    _.forEach(H.specs, (spec) => {
      spec = _.clone(spec)
      delete spec.source
      delete spec.$spec
      specs.push(spec)
    })

    return {
      specs: specs
    }
  }

}

// Exported paths is used in adapter, route is used in worker.
export { paths, route }
