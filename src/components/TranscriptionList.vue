<template>
  <div class="transcriptions">
    <GlobalEvents
      @keydown.up="focusLast"
      @keydown.down="focusFirst"
    />

    <template v-for="(t, i) in transcriptions">
      <Transcription :key="t.id" :index="i" />
    </template>

    <form @submit.prevent="insert">
      <label>
        <i class="plus icon"></i>
        <button>추가</button>
      </label>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import GlobalEvents from 'vue-global-events'

import Transcription from './Transcription'

export default {
  name: 'TranscriptionList',

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

    insert () {
      this.$store.commit('insertTranscription', this.transcriptions.length)
    }
  },

  created () {
    if (this.transcriptions.length === 0) {
      this.$store.commit('insertTranscription')
      /*
      this.$store.commit('insertTranscription')
      this.$store.commit('insertTranscription')
      */
      this.$nextTick(() => this.focus(0))
    }
  }
}
</script>

<style scoped>
  label {
    background: #dbd4be;
    display: block;
    margin: 1rem 0.5rem 1.5rem;
    padding: 1rem;
    cursor: pointer;
    text-align: center;
    color: #fff;
    font-size: 1.5rem;
  }

  label:hover {
    background: #d2c8af;
  }

  button {
    display: none;
  }
</style>
