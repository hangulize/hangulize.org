import Worker from './hangulize.worker'
const worker = new Worker()

let workerReady = false
let nextSeq = 0
let results = {}
let resolvers = {}

// Dispatch result from the worker.
worker.onmessage = (e) => {
  if (e.data.seq === -1) {
    // The worker is ready.
    workerReady = true
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
  const seq = nextSeq
  nextSeq++

  let result = null

  if (workerReady) {
    worker.postMessage({ seq: seq, path: path })

    const promise = new Promise((resolve) => {
      resolvers[seq] = resolve
    })

    result = await promise
  } else {
    let res = await fetch('https://api.hangulize.org/v2' + path, {
      headers: new Headers({
        'Accept': 'application/json'
      })
    })
    result = await res.json()
  }

  return result
}

// Export high-level APIs.
export default {
  hangulize: async (lang, word) => {
    return call(`/hangulized/${lang}/${word}`)
  },

  specs: async () => {
    return call('/specs')
  }
}
