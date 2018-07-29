import Worker from './worker'

// const api = 'https://api.hangulize.org/v2'
const api = 'http://nop.subl.ee:8000/v2'

let nextSeq = 0
let results = {}
let resolvers = {}

const worker = new Worker()
let _workerReady = false

// Dispatch result from the worker.
worker.onmessage = (e) => {
  if (e.data.seq === -1) {
    // The worker is ready.
    _workerReady = true
    return
  }

  const resolve = resolvers[e.data.seq]

  if (resolve === undefined) {
    return
  }

  results[e.data.seq] = e.data.result
  resolve(e.data.result)
}

// Whether the Web Worker is ready to run Hangulize on the client-side.
export function workerReady () {
  return _workerReady
}

// Call Hangulize API via the worker.
export async function callWorker (path) {
  const seq = nextSeq++

  worker.postMessage({ seq: seq, path: path })

  const promise = new Promise((resolve) => {
    resolvers[seq] = resolve
  })

  const result = await promise
  return result
}

// Call Hangulize API via the Web API.
export async function callWeb (path) {
  let res = await fetch(api + path, {
    headers: new Headers({
      'Accept': 'application/json'
    })
  })

  const result = await res.json()
  return result
}

// Call Hangulize API via the fastest one.
export async function call (path) {
  let result = null

  if (_workerReady) {
    result = callWorker(path)
  } else {
    result = callWeb(path)
  }

  return result
}
