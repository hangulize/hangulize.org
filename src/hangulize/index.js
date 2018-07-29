import _ from 'lodash'

import { call, callWeb, callWorker, workerReady } from './adapter'

let module = {
  // A cached {langID: spec} object from the last "/specs" request.
  $specs: {},

  // Whether the Web Worker is ready to run Hangulize on the client-side.
  workerReady: workerReady

}

// Prefetch the pronunciation always via the Web API.
// Pronouncers are not built for JS.
async function prefetchPronunciation (pronouncer, word) {
  const safePronouncer = encodeURIComponent(pronouncer)
  const safeWord = encodeURIComponent(word)

  const result = await callWeb(`/pronounced/${safePronouncer}/${safeWord}`)

  const safePronounced = encodeURIComponent(result.pronounced)
  const path = `/_pronounced/${safePronouncer}/${safeWord}/${safePronounced}`

  await callWorker(path)
}

module.hangulize = async function (lang, word) {
  if (workerReady()) {
    // Should prefetch the pronunciation because the pronouncer is not built
    // for JS.
    const spec = module.$specs[lang]
    console.log(spec.lang)
    await prefetchPronunciation(spec.lang.pronounce, word)
  }

  let safeLang = encodeURIComponent(lang)
  let safeWord = encodeURIComponent(word)

  const result = await call(`/hangulized/${safeLang}/${safeWord}`)
  return result
}

module.specs = async function () {
  const result = await call('/specs')

  // Cache the result at $specs.
  module.$specs = {}
  _.forEach(result.specs, (spec) => {
    module.$specs[spec.lang.id] = spec
  })

  return result
}

export default module
