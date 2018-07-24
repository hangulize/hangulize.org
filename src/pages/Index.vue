<template>
  <div>
    <GlobalEvents
      @keydown.up="focusLast"
      @keydown.down="focusFirst"
    />

    <template v-for="(t, i) in transcriptions">
      <Transcription
        :key="t.id"
        :index="i"

        :lang="t.lang"
        :word="t.word"
        :random="t.random"

        @lang="(lang) => t.lang = lang"
        @word="(word) => t.word = word"

        :closeable="transcriptions.length > 1"
        :focused="isFocused(t.id)"

        @focus="() => focus(i)"
        @blur="() => blur(t.id, i)"

        @close="() => removeIfNotFirst(i)"
        @submit.prevent="() => insertBelow(i)"

        @keydown.up="focus(i - 1)"
        @keydown.down="focus(i + 1)"
        @keydown.backspace="() => t.word || removeIfNotFirst(i)"
      />
    </template>

    <form @submit.prevent="insertLast">
      <label>
        <sui-icon name="plus" />
        <button>추가</button>
      </label>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import GlobalEvents from 'vue-global-events'

import Transcription from '../components/Transcription'

export default {
  name: 'Index',

  components: {
    Transcription,
    GlobalEvents
  },

  computed: {
    ...mapState(['transcriptions'])
  },

  methods: {
    focus (index) {
      this.$store.commit('focusTranscription', index)
    },

    focusFirst (e) {
      if (e.target === document.body) {
        this.focus(0)
      }
    },

    focusLast (e) {
      if (e.target === document.body) {
        this.focus(this.transcriptions.length - 1)
      }
    },

    isFocused (id) {
      return id === this.$store.state.focusedTranscriptionID
    },

    blur (id, index) {
      this.$store.commit('blurTranscriptions')
    },

    insertBelow (index) {
      index++
      this.$store.commit('insertTranscription', { index })
      this.focus(index)
    },

    insertLast () {
      const index = this.transcriptions.length
      this.$store.commit('insertTranscription', { index })
      this.focus(index)
    },

    removeIfNotFirst (index) {
      if (index === 0) {
        return
      }

      this.$store.commit('removeTranscription', index)
      this.$nextTick(() => this.focus(index - 1))
    }
  },

  created () {
    if (this.transcriptions.length === 0) {
      this.$store.commit('insertTranscription', {})
      this.focus(0)
      this.$nextTick(() => this.focus(0))
    }
  }
}
</script>

<style scoped>
  label {
    display: block;
    margin: 1rem 0.5rem 1.5rem;
    padding: 1rem;
    cursor: pointer;
    text-align: center;
    color: #fff;
    font-size: 1.5rem;

    transition: background 0.2s;
    background: rgba(187, 170, 136, 0.3);
  }

  label:hover {
    background: rgba(187, 170, 136, 0.6);
  }

  button {
    display: none;
  }
</style>