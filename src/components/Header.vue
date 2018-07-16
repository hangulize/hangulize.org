<template>
  <header>
    <p class="logo">
      <img src="static/logo.svg" width="196" />
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
  padding: 3rem;
  padding-bottom: 0.5rem;
}
</style>
