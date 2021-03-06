<template>
  <div
    class="transcription"
    :class="{ focused, selecting, example: exampleTranscribed }"
  >
    <button
      type="butotn"
      class="close"
      @focus="focus"
      @blur="blur"
      @click.prevent="close"
      v-if="closeable"
    >
      <sui-icon name="close" />
    </button>
    <form
      tabindex="-1"

      @focus="focus"
      @blur="blur"
      @submit="submit"
    >
      <label>

        <Language
          :lang="lang"
          @input="updateLang"
          @open="selecting = true"
          @close="selecting = false"
          @focus="focus"
          @blur="blur"
        />

        <input
          ref="input"

          :placeholder="example.word"
          :value="word"
          :class="'script-' + spec.lang.script"

          @input="(e) => updateWord(e.target.value)"
          @focus="focus"
          @blur="blur"
          @paste="paste"
          @keydown="keydown"
        />

        <!--
          Use zero-width space (&#8203;) as the placeholder
          to consist of the height.
        -->
        <span class="transcribed">{{ transcribed || '&#8203;' }}</span>

      </label>
    </form>
  </div>
</template>

<script>
import _ from 'lodash'

import H from '../hangulize'
import Language from './Language'

export default {
  name: 'Transcription',

  components: {
    Language
  },

  props: {
    index: Number,

    lang: String,
    word: String,
    random: {
      type: Number,
      default: 0
    },

    closeable: Boolean,
    focused: Boolean
  },

  data: () => ({
    selecting: false,

    prevWord: '',
    transcribed: '',

    // Whether the transcribed is from an example.
    exampleTranscribed: true
  }),

  computed: {
    spec () {
      return H.$specs[this.lang]
    },

    example () {
      const test = this.spec.test
      const i = _.floor(test.length * this.random)
      return test[i]
    }
  },

  watch: {
    focused () {
      this.focusIf()
    },

    lang () {
      this.transcribed = ''
      this.hangulize()
    },

    word (word) {
      if (word[0] !== this.prevWord[0]) {
        this.transcribed = ''
      }
      this.hangulize()
      this.prevWord = word
    }
  },

  methods: {
    hangulize () {
      // Will be implemented at created().
    },

    updateLang (lang) {
      this.$emit('lang', lang)
    },

    updateWord (word) {
      this.$emit('word', word)
    },

    close () {
      this.$emit('close')
    },

    focusIf () {
      if (this.focused) {
        this.$refs.input.select()
        // this.$el.scrollIntoView()
      }
    },

    focus () {
      this.$emit('focus')
    },

    keydown (e) {
      this.$emit('keydown', e)
    },

    blur (e) {
      if (this.focused) {
        this.$emit('blur', e)
      }
    },

    submit (e) {
      this.$emit('submit', e)
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
      this.$emit('pasteBelow', lines)
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
    }, H.workerReady() ? 50 : 100)

    this.hangulize()
  },

  mounted () {
    this.focusIf()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto');
@import url('https://fonts.googleapis.com/earlyaccess/notosansjp.css');
@import url('https://spoqa.github.io/spoqa-han-sans/css/SpoqaHanSans-kr.css');

*:focus {
  outline: none;
}

.transcription {
  position: relative;
  background: #fff;
  display: block;
  margin: 1rem 0.5rem 1.5rem;

  transition: box-shadow 0.2s;
  box-shadow: 0 2px 1px rgba(68, 51, 34, 0.1);
}

.transcription.focused {
  box-shadow: 0 3px 10px rgba(68, 51, 34, 0.3);
}

.transcription.selecting {
  box-shadow: none;
  background: #f4f4f4;
}

label {
  display: block;
  padding: 1rem;
  cursor: text;
}

button.close {
  position: absolute;
  top: 1rem;
  right: 0.5rem;
  z-index: 1;

  background: transparent;
  border: none;
  padding: 0;
  color: #ccc;
  cursor: pointer;

  display: none;
}

button.close:hover {
  color: #000;
}

.transcription.focused button.close {
  display: block;
}

input {
  background: transparent;
  font-size: 2rem;
  font-weight: 400;
  line-height: 1.5;
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

input.script-latin, input.script-cyrillic {
  font-family: 'Roboto', sans-serif;
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
  line-height: 1.2;
  color: #49e;
  word-wrap: break-word;
}

.example input {
  border-color: #eee;
}

.example .transcribed {
  color: #abd;
}
</style>
