<template>
  <div>
    <nuxt-content :document="terms" />
  </div>
</template>

<script>
export default {
  async asyncData({ $content }) {
    const terms = await $content('terms').fetch()
    return { terms }
  }
}
</script>

<style>
/* Ajoutez votre style ici si nécessaire */
</style>
