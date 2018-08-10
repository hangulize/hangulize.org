import _ from 'lodash'

import { call, callWeb, callWorker, workerReady } from './adapter'

let module = {
  // A cached {langID: spec} object from the last "/specs" request.
  $specs: {},

  // Whether the Web Worker is ready to run Hangulize on the client-side.
  workerReady: workerReady

}

// Prefetch the phonograms always via the Web API.
// Phonemizers are not built for JS.
async function prefetchPhonograms (phonemizer, word) {
  if (!phonemizer) {
    return
  }

  const safePhonemizer = encodeURIComponent(phonemizer)
  const safeWord = encodeURIComponent(word)

  const result = await callWeb(`/phonemized/${safePhonemizer}/${safeWord}`)

  const safePhonemized = encodeURIComponent(result.phonemized)
  const path = `/_phonemized/${safePhonemizer}/${safeWord}/${safePhonemized}`

  await callWorker(path)
}

module.hangulize = async function (lang, word) {
  if (workerReady()) {
    // Prefetch the phonograms.
    const spec = module.$specs[lang]
    await prefetchPhonograms(spec.lang.phonemize, word)
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
