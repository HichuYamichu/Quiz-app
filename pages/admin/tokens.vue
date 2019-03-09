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
        <h1 class="headline">Token</h1>
      </v-toolbar>
      <v-flex xs12 v-for="(token, index) in tokens" :key="index" my-3>
        <v-toolbar flat>
          {{ token.username }}
          <v-spacer></v-spacer>
          {{ token.quiz }}
          <v-spacer></v-spacer>
          {{ token.token }}
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
      const tokens = await $axios.$get("/api/admin/get-tokens");
      return {
        tokens: tokens
      };
    } catch (err) {
      console.log(err);
      redirect("/");
    }
  },
  methods: {
    swipe: function() {
      this.drawerVisible = !this.drawerVisible;
    }
  }
};
</script>

<style>
</style>
