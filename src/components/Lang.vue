<template>
  <component
    :is="tag"
    class="lang"
    tabindex="0"
    v-on="$listeners"
  >
    <code>{{ id }}</code>
    <span>{{ name }}</span>
    <slot></slot>
  </component>
</template>

<script>
import H from '../hangulize.adapter'

function langName (locale, lang) {
  if (locale === 'ko') {
    return lang.korean
  } else {
    return lang.english
  }
}

export default {
  name: 'Lang',

  props: {
    tag: {
      type: String,
      default: 'span'
    },

    lang: {
      type: String,
      required: true
    },

    tabindex: {
      type: Number
    }
  },

  computed: {
    id () {
      return this.lang.toUpperCase()
    },

    name () {
      return langName(this.$i18n.locale, H.$specs[this.lang].lang)
    }
  }
}
</script>

<style>
@import 'https://fonts.googleapis.com/css?family=IBM+Plex+Mono';

.lang code {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;

  border-radius: 3px;
  padding: 0.1rem 0.3rem;
  border: 1px solid #ddd;
}
</style>
