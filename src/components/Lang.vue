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
import H from 'hangulize'

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
      return H.specs[this.lang].lang.korean
    }
  }
}
</script>

<style>
@import 'https://fonts.googleapis.com/css?family=IBM+Plex+Mono';

.lang code {
  font-family: 'IBM Plex Mono', monospace;
}
</style>
