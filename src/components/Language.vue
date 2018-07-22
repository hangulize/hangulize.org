<template>
  <div class="language">
    <Lang tag="div"
      :lang="lang"
      @click.stop="selecting = true"
      @keypress.enter="selecting = true"
      @focus="() => $emit('focus')"
      @blur="() => $emit('blur')"
    >
      <sui-icon name="dropdown" />
    </Lang>

    <LanguageSelector
      v-if="selecting"
      :lang="lang"
      @input="(lang) => value = lang"
      @cancel="selecting = false"
    />
  </div>
</template>

<script>
import Lang from './Lang'
import LanguageSelector from './LanguageSelector'

export default {
  name: 'Language',

  components: {
    Lang,
    LanguageSelector
  },

  props: ['lang'],

  data: () => ({
    value: '',
    selecting: false
  }),

  watch: {
    value (value) {
      this.$emit('input', value)
      this.selecting = false
    },

    selecting (selecting) {
      if (selecting) {
        this.$emit('open')
      } else {
        this.$emit('close')
      }
    }
  },

  created () {
    this.value = this.lang
  }
}
</script>

<style>
.language {
  position: relative;
}

.language > .lang {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.language > .lang i {
  color: #ccc;
}

.language > .lang:hover i {
  color: #000;
}
</style>
