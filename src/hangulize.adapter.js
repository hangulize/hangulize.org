import Worker from './hangulize.worker'
const worker = new Worker()

let nextSeq = 0
let results = {}
let resolvers = {}

// Dispatch result from the worker.
worker.onmessage = (e) => {
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

  worker.postMessage({ seq: seq, path: path })

  const promise = new Promise((resolve) => {
    resolvers[seq] = resolve
  })

  const result = await promise
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
