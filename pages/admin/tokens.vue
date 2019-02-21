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
            <h1 class="headline">Token</h1>
          </v-toolbar>
          <v-flex xs12 v-for="(token, index) in tokens" :key="index">
            <v-toolbar flat>
              {{ token.username }}
              <v-spacer></v-spacer>
              {{ token.quiz }}
              <v-spacer></v-spacer>
              {{ token.token }}
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
    if (!store.state.cachedTokens) {
      const tokens = await $axios.$get("http://localhost:3000/api/get-tokens");
      store.commit("SET_TOKEN_CACHE", tokens);
      return {
        tokens: tokens
      };
    } else {
      return {
        tokens: store.state.cachedTokens
      };
    }
  }
};
</script>

<style>
</style>
