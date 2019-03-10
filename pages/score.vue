<template>
  <v-layout align-center justify-center column fill-height wrap>
    <v-flex xs2>
      <h2
        class="display-3"
      >You scored {{ this.$store.state.score.achived }} points out of {{ this.$store.state.score.max }} possible</h2>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  middleware: "score"
};
</script>

<style scoped>
</style>
