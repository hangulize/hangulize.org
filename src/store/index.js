import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import H from '../hangulize.adapter'
import Transcription from './Transcription'

Vue.use(Vuex)

function chooseRandomLatinLang () {
  const langs = Object.keys(H.$specs)

  while (true) {
    const i = _.random(langs.length - 1)
    const lang = langs[i]

    if (H.$specs[lang].lang.script === 'latin') {
      return lang
    }
  }
}

export default new Vuex.Store({
  plugins: [
    createPersistedState()
  ],

  state: () => ({
    locale: navigator.language,

    transcriptions: [],

    focusedTranscriptionID: null,
    nextTranscriptionID: 0
  }),

  getters: {
    getTranscription: (state) => (i) => {
      return Transcription.wrap(state.transcriptions[i])
    }
  },

  mutations: {
    // Here cannot access to $i18n. So the committers
    // have responsibility to change $i18n.locale too.
    rememberLocale (state, locale) {
      state.locale = locale
    },

    // Inserts a transcription onto the given index.
    insertTranscription (state, { index = 0, word = '' }) {
      let lang

      if (index === 0) {
        // Pick a random Latin lang for initializing
        // because Latin is easy to type in any keyboards.
        lang = chooseRandomLatinLang()
      } else {
        // Use lang of the prev transcription as default.
        lang = state.transcriptions[index - 1].lang
      }

      const id = state.nextTranscriptionID++
      const t = new Transcription(id, lang, word)

      state.transcriptions.splice(index, 0, t)
    },

    removeTranscription (state, index = 0) {
      state.transcriptions.splice(index, 1)
    },

    focusTranscription (state, index = 0) {
      index = _.clamp(index, 0, state.transcriptions.length - 1)
      const id = state.transcriptions[index].id
      state.focusedTranscriptionID = id
    },

    blurTranscriptions (state) {
      state.focusedTranscriptionID = null
    },

    updateLang (state, {index, lang}) {
      state.transcriptions[index].lang = lang
    },

    updateSpec (state, {index, spec}) {
      state.transcriptions[index].spec = spec
    },

    updateWord (state, {index, word}) {
      state.transcriptions[index].word = word
    }
  }
})
