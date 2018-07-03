import _ from 'lodash'

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
