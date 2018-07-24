<template>
  <div>
    <Transcription
      :lang="lang"
      :word="word"
    />
  </div>
</template>

<script>
import Transcription from '../components/Transcription'

export default {
  name: 'Epic',

  components: {
    Transcription
  },

  computed: {
    lang () {
      return this.$route.params.lang
    },

    word () {
      return this.$route.params.word
    }
  }
}
</script>
