<template>
  <footer>
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
  padding-bottom: 2rem;
}

p {
  text-align: center;
}
</style>
