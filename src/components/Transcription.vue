<template>
  <form
    class="transcription"

    tabindex="-1"
    :class="{ focused, selecting, example: exampleTranscribed }"

    @focus="focus"
    @blur="blur"
    @submit.prevent="(e) => insert()"
  >
    <label>

      <Language
        :lang="lang"
        @input="updateLang"
        @open="selecting = true"
        @close="selecting = false"
      />

      <input
        ref="input"

        :placeholder="example.word"
        :value="word"
        :class="'script-' + spec.lang.script"

        @input="(e) => updateWord(e.target.value)"
        @focus="focus"
        @blur="blur"
        @keydown.up="focusAbove"
        @keydown.down="focusBelow"
        @keydown.backspace="maybeRemove"
        @paste="paste"
      />

      <span class="transcribed">{{ transcribed }}</span>

    </label>
  </form>
</template>

<script>
import _ from 'lodash'

import H from '../hangulize.adapter'
import Language from './Language'

export default {
  name: 'Transcription',

  components: {
    Language
  },

  props: ['index'],

  data: () => ({
    random: _.random(true),
    selecting: false,

    transcribed: '',

    // Whether the transcribed is from an example.
    exampleTranscribed: true
  }),

  computed: {
    input () {
      return this.$refs.input
    },

    transcription () {
      return this.$store.getters.getTranscription(this.index)
    },

    id () {
      return this.transcription.id
    },

    lang () {
      return this.transcription.lang
    },

    spec () {
      return this.transcription.spec
    },

    word () {
      return this.transcription.word
    },

    example () {
      const test = this.spec.test
      const i = _.floor(test.length * this.random)
      return test[i]
    },

    focused () {
      return this.id === this.$store.state.focusedTranscriptionID
    }
  },

  watch: {
    focused (focused) {
      if (focused) {
        this.input.select()
        this.$el.scrollIntoView()
      }
    }
  },

  methods: {
    hangulize () {
      // Will be implemented at created().
    },

    updateLang (lang) {
      this.$store.commit('updateLang', {
        index: this.index,
        lang: lang
      })

      this.transcribed = ''
      this.hangulize()
    },

    updateWord (word) {
      this.$store.commit('updateWord', {
        index: this.index,
        word: word
      })
      this.hangulize()
    },

    insert (word = '') {
      this.$store.commit('insertTranscription', {
        index: this.index + 1,
        word: word
      })
    },

    maybeRemove () {
      if (this.index === 0) {
        return
      }

      if (this.input.value !== '') {
        return
      }

      this.$store.commit('removeTranscription', this.index)
      this.focusAbove()
    },

    focus () {
      this.$store.commit('focusTranscription', this.index)
    },

    focusAbove () {
      this.$store.commit('focusTranscription', this.index - 1)
    },

    focusBelow () {
      this.$store.commit('focusTranscription', this.index + 1)
    },

    blur () {
      if (this.focused) {
        this.$store.commit('blurTranscriptions')
      }
    },

    paste (e) {
      let lines = e.clipboardData.getData('text').split(/\n/)
      if (lines.length <= 1) {
        return
      }

      e.preventDefault()

      // Simulate default paste for the first line.
      const pasteFirstLine = () => {
        const start = e.target.selectionStart
        const end = e.target.selectionEnd

        const value = e.target.value
        const before = value.substring(0, start)
        const after = value.substring(end, value.length)

        e.target.value = before + lines[0] + after
        this.updateWord(e.target.value)

        const cursor = end + lines[0].length - (end - start)
        e.target.selectionStart = e.target.selectionEnd = cursor
      }
      pasteFirstLine()

      lines.shift()
      _.forEach(lines, (line) => {
        this.insert(line)
      })
    }
  },

  created () {
    // NOTE(sublee): hangulize() is expensive.  If we call this for every user
    // input, the user experience would be bad.  So we need to wrap it with
    // _.debounce().
    //
    // But if we define it in the methods, all Transcription component
    // instances share the same debounce schedule.  We define here instead to
    // separate schedules for each component instance.
    //
    // https://forum.vuejs.org/t/issues-with-vuejs-component-and-debounce/7224/13
    //
    this.hangulize = _.debounce(async function () {
      if (this.word) {
        this.exampleTranscribed = false

        let word = this.word
        const result = await H.hangulize(this.lang, word)

        this.transcribed = result.transcribed
      } else {
        this.exampleTranscribed = true

        this.transcribed = this.example.transcribed
      }

      /*
      const h = H.newHangulizer(this.spec)

      if (this.word) {
        this.exampleTranscribed = false
        this.transcribed = h.Hangulize(this.word)
        return
      }

      this.exampleTranscribed = true
      if (this.spec === H.specs[this.lang]) {
        this.transcribed = this.example.transcribed
      } else {
        this.transcribed = h.Hangulize(this.example.word)
      }
      */
    }, H.workerReady ? 50 : 100)

    this.hangulize()
  },

  mounted () {
    this.focus()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Noto+Sans&subset=cyrillic,greek,vietnamese');
@import url('https://fonts.googleapis.com/earlyaccess/notosansjp.css');
@import url('https://spoqa.github.io/spoqa-han-sans/css/SpoqaHanSans-kr.css');

*:focus {
  outline: none;
}

form {
  background: #fff;
  display: block;
  margin: 1rem 0.5rem 1.5rem;
  padding: 1rem 0;
  transition: box-shadow 0.1s;
}

label {
  display: block;
  padding: 0 1em;
  cursor: text;
}

input {
  background: transparent;
  font-size: 2rem;
  font-weight: 400;
  line-height: 1.3;
  padding: 0;
  border: none;
  border-radius: 0;
  width: 100%;
}

input::placeholder {
  color: #aaa;
}

input::selection {
  background: #bdf;
}

input.script-roman, input.script-cyrillic {
  font-family: 'Noto Sans', sans-serif;
}

input.script-roman, input.script-kana {
  font-family: 'Noto Sans JP', sans-serif;
}

.transcribed {
  display: block;
  padding: 0;
  font-family: 'Spoqa Han Sans', sans-serif;
  font-size: 1.75rem;
  font-weight: 400;
  line-height: 1.3;
  color: #49e;
  word-wrap: break-word;
}

form.focused {
  box-shadow: 0 3px 10px rgba(68, 51, 34, 0.3);
  outline: 1px solid rgba(68, 51, 34, 0.1);
}

form.selecting {
  box-shadow: none;
  background: #f4f4f4;
}

.example input {
  border-color: #eee;
}

.example .transcribed {
  color: #abd;
}
</style>
