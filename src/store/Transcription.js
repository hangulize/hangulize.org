import _ from 'lodash'

import H from '../hangulize'

class Transcription {
  constructor (id, lang, word = '', random = undefined) {
    this.id = id
    this.lang = lang
    this.word = word
    this.random = random === undefined ? _.random(true) : random
  }

  get spec () {
    return H.$specs[this.lang]
  }

  get example () {
    const test = this.spec.test
    const i = _.floor(test.length * this.random)
    return test[i]
  }
}

Transcription.wrap = (data) => {
  if (data === undefined) {
    return {}
  }

  if (data instanceof Transcription) {
    return data
  }

  return new Transcription(data.id, data.lang, data.word, data.random)
}

export default Transcription
