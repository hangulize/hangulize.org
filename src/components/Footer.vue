<template>
  <footer>
    <p class="locales">
      <span
        :class="{ selected: $t('locale') === 'ko' }"
        @click="() => $i18n.locale = 'ko'"
      >한국어</span>
      <span
        :class="{ selected: $t('locale') === 'en' }"
        @click="() => $i18n.locale = 'en'"
      >English</span>
    </p>

    <p>
      &copy; 2010&ndash;{{ year }}
      <a href="https://www.facebook.com/kkeutsori/">Brian</a>
      &amp;
      <a href="https://subl.ee/">Heungsub</a>.
      All rights reserved.
    </p>
  </footer>
</template>

<script>
export default {
  name: 'Footer',

  data: () => ({
    year: (new Date()).getFullYear()
  })
}
</script>

<style scoped>
footer {
  padding-top: 0.5rem;
  padding-bottom: 3rem;
  text-align: center;
}

.locales {
  margin: 0;
  margin-bottom: 0.2rem;
  padding: 0;
}

.locales span {
  cursor: pointer;
  border-radius: 3px;
  padding: 0.1rem 0.3rem;
}

.locales .selected {
  background: rgba(187, 170, 136, 0.3);
}
</style>
