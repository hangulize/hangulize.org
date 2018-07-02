import _ from 'lodash'
import Navigo from 'navigo'

self.importScripts('https://github.com/hangulize/hangulize.js/releases/download/0.1.1/hangulize-0.1.1.js')
const H = self.hangulize

const router = new Navigo()
router
  .on('/hangulized/:lang/:word', (params) => {
    const transcribed = H.hangulize(params.lang, params.word)

    return {
      lang: params.lang,
      word: params.word,
      transcribed: transcribed
    }
  })
  .on('/specs', () => {
    let specs = []

    _.forEach(H.specs, (spec) => {
      spec = _.clone(spec)
      delete spec.$spec
      specs.push(spec)
    })

    return {
      specs: specs
    }
  })

self.onmessage = (e) => {
  const routed = router.resolve(e.data.path)
  const result = routed.route.handler(routed.params)
  self.postMessage({ seq: e.data.seq, result: result })
}

// Let consumer know worker is ready.
self.postMessage({ seq: -1, result: true })
