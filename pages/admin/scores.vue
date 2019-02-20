<template>
  <div>
    <admin-panel/>
    <v-container grid-list-xl text-xs-center>
      <v-card>
        <v-layout column wrap>
          <v-toolbar color="cyan">
            <h1 class="headline">User</h1>
            <v-spacer></v-spacer>
            <h1 class="headline">Quiz</h1>
            <v-spacer></v-spacer>
            <h1 class="headline">Score</h1>
          </v-toolbar>
          <v-flex xs12 v-for="(score, index) in scores" :key="index">
            <v-toolbar flat>
              {{ score.username }}
              <v-spacer></v-spacer>
              {{ score.quiz }}
              <v-spacer></v-spacer>
              {{ score.score }} / {{ score.max }}
            </v-toolbar>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import AdminPanel from "@/components/AdminPanel";

export default {
  components: {
    AdminPanel
  },
  middleware: "auth",
  async asyncData({ $axios, store }) {
    if (!store.state.cachedScores) {
      const scores = await $axios.$get("http://localhost:3000/api/get-scores");
      store.commit("SET_SCORES_CACHE", scores);
      console.log(scores);
      return {
        scores: scores
      };
    } else {
      return {
        scores: store.state.cachedScores
      };
    }
  }
};
</script>

<style>
</style>
