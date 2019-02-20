<template>
  <div class="main">
    <h1
      class="headline"
    >You scored {{ this.$store.state.score.achived }} points out of {{ this.$store.state.score.max }} possible</h1>
  </div>
</template>

<script>
export default {
  middleware: 'score'
};
</script>

<style scoped>
.main {
  width: 100%;
  height: 100%;
  margin: 30vh auto;
  text-align: center;
}
.headline {
  font-size: 4em !important;
  white-space: nowrap;
}
</style>
