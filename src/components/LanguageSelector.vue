<template>
  <ul class="language-selector" v-click-outside.stop="cancel" tabindex="-1">
    <template v-for="(spec, lang_) in specs">
      <Lang
        tag="li"
        :key="lang_"
        :class="{ selected: lang_ == lang, focused: lang_ == focused }"

        :lang="lang_"

        @focus="focused = lang_"

        @click="select(lang_)"
        @keypress.enter="select(lang_)"
      />
    </template>
  </ul>
</template>

<script>
import H from '../hangulize.adapter'
import Lang from './Lang'

export default {
  name: 'LanguageSelector',

  props: ['lang'],

  components: {
    Lang
  },

  data: () => ({
    focused: ''
  }),

  computed: {
    specs () {
      return H.$specs
    }
  },

  methods: {
    select (lang) {
      this.$emit('input', lang)
    },

    cancel () {
      this.$emit('cancel')
    }
  },

  mounted () {
    this.$el.focus()
  }
}
</script>

<style scoped>
.language-selector {
  overflow-y: scroll;
  height: 30rem;
  width: 20rem;

  position: absolute;
  top: 0;
  margin: -0.5rem;
  padding: 0;
  border: none;
  outline: none;
  background: #fff;
  z-index: 1;

  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.language-selector li {
  display: block;
  padding: 0.5rem;
  cursor: pointer;
}

.language-selector li:hover,
.language-selector li.focused {
  background: #eee;
}

.language-selector li.selected {
  font-weight: 700;
  background: #eee;
}
</style>
