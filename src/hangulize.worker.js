import _ from 'lodash'
import Navigo from 'navigo'

self.importScripts('https://github.com/hangulize/hangulize.js/releases/download/0.1.1/hangulize-0.1.1.js')
const H = self.hangulize

const router = new Navigo()
router
  .on('/hangulized/:lang/:word', (params) => {
    return H.hangulize(params.lang, params.word)
  })
  .on('/specs', () => {
    let specs = []

    _.forEach(H.specs, (spec) => {
      spec = _.clone(spec)
      delete spec.$spec
      specs.push(spec)
    })

    return specs
  })

self.onmessage = (e) => {
  const routed = router.resolve(e.data.path)
  const result = routed.route.handler(routed.params)
  self.postMessage({ seq: e.data.seq, result: result })
}
