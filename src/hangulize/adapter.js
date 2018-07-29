import _ from 'lodash'

import { paths } from './api'
import Worker from './worker'

// ----------------------------------------------------------------------------

const api = 'https://api.hangulize.org/v2'

let module = {
  // A cached {langID: spec} object from the last "/specs" request.
  $specs: {},

  // Whether the Web Worker is ready to run Hangulize on the client-side.
  workerReady: false

}

// Fill Hangulize API as async functions.
_.forEach(paths, (fPath, name) => {
  module[name] = async function () {
    const path = fPath.apply(this, arguments)
    return call(path)
  }
})

// Capture a "/specs" response to $specs.
const _specs = module.specs
if (_specs !== undefined) {
  module.specs = async function () {
    const result = await _specs()

    module.$specs = {}
    _.forEach(result.specs, (spec) => {
      module.$specs[spec.lang.id] = spec
    })

    return result
  }
}

export default module

// ----------------------------------------------------------------------------

let nextSeq = 0
let results = {}
let resolvers = {}

const worker = new Worker()

// Dispatch result from the worker.
worker.onmessage = (e) => {
  if (e.data.seq === -1) {
    // The worker is ready.
    module.workerReady = true
    return
  }

  const resolve = resolvers[e.data.seq]

  if (resolve === undefined) {
    return
  }

  results[e.data.seq] = e.data.result
  resolve(e.data.result)
}

// Call Hangulize API in the worker.
async function call (path) {
  let result = null

  if (module.workerReady) {
    const seq = nextSeq++

    worker.postMessage({ seq: seq, path: path })

    const promise = new Promise((resolve) => {
      resolvers[seq] = resolve
    })

    result = await promise
  } else {
    let res = await fetch(api + path, {
      headers: new Headers({
        'Accept': 'application/json'
      })
    })
    result = await res.json()
  }

  return result
}
