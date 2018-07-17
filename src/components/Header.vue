<template>
  <header>
    <p class="logo">
      <img :src="'static/' + $t('logo')" width="250" />
    </p>

    <p>
      <span v-html="$t('intro')"></span>

      <a href="https://github.com/sublee/hangulize2">
        <sui-icon name="github" />GitHub
      </a>

      <a href="https://godoc.org/github.com/sublee/hangulize2/hangulize">
        <sui-icon name="book" />GoDoc
      </a>
    </p>
  </header>
</template>

<style scoped>
header {
  padding-bottom: 1rem;
}

p {
  text-align: center;
}

.logo {
  margin: 0;
  padding: 3rem;
  padding-bottom: 0;
}
</style>
