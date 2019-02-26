<template v-touch="{
      right: () => swipe()
    }">
  <v-layout column fill-height>
    <v-card>
      <v-toolbar color="cyan">
        <h1 class="headline">User</h1>
        <v-spacer></v-spacer>
        <h1 class="headline">Quiz</h1>
        <v-spacer></v-spacer>
        <h1 class="headline">Score</h1>
      </v-toolbar>
      <v-flex xs12 v-for="(score, index) in scores" :key="index" my-3>
        <v-toolbar flat>
          {{ score.username }}
          <v-spacer></v-spacer>
          {{ score.quiz }}
          <v-spacer></v-spacer>
          {{ score.score }} / {{ score.max }}
          <v-btn dark fab small color="cyan" @click="remove(index)">
            <v-icon>remove</v-icon>
          </v-btn>
        </v-toolbar>
      </v-flex>
    </v-card>
    <admin-panel :drawer="drawerVisible"/>
  </v-layout>
</template>

<script>
import AdminPanel from "@/components/AdminPanel";

export default {
  components: {
    AdminPanel
  },
  middleware: "auth",
  data() {
    return {
      drawerVisible: false
    };
  },
  async asyncData({ $axios, redirect }) {
    try {
      const scores = await $axios.$get("/api/get-scores");
      return {
        scores: scores
      };
    } catch (err) {
      redirect("/");
    }
  },
  methods: {
    async remove(index) {
      try {
        await this.$axios.$delete("/api/delete-scores", {
          data: this.scores[index]
        });
        this.scores.splice(index, 1);
      } catch (err) {
        this.errorMessage = "Could not delete that!";
        this.error = true;
      }
    },
    swipe: function() {
      this.drawerVisible = !this.drawerVisible;
    }
  }
};
</script>

<style>
</style>
