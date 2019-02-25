<template>
  <v-container fluid fill-height text-xs-center>
    <v-layout align-center justify-center column fill-height wrap>
      <v-flex
        xs2
        class="headline"
      >You scored {{ this.$store.state.score.achived }} points out of {{ this.$store.state.score.max }} possible</v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  middleware: "score"
};
</script>

<style scoped>
.headline {
  font-size: 4em !important;
  line-height: 130% !important;
}
</style>
