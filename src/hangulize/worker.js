import _ from 'lodash'
import Navigo from 'navigo'

import { route } from './hangulize.api'

self.importScripts('https://github.com/hangulize/hangulize.js/releases/download/0.1.1/hangulize-0.1.1.js')
const H = self.hangulize

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
