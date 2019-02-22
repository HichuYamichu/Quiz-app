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
              <v-btn absolute dark fab small bottom right color="cyan" @click="remove(index)">
                <v-icon>remove</v-icon>
              </v-btn>
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
  async asyncData({ $axios }) {
    const scores = await $axios.$get("http://localhost:3000/api/get-scores");
    return {
      scores: scores
    };
  },
  methods: {
    async remove(index) {
      try {
        await this.$axios.$delete("http://localhost:3000/api/delete-scores", {
          data: this.scores[index]
        });
        this.scores.splice(index, 1)
      } catch (err) {
        this.errorMessage = "Could not delete that!";
        this.error = true;
      }
    }
  }
};
</script>

<style>
</style>
