<template>
  <div>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Generated token:</v-card-title>
        <v-card-text>{{ dialogMessage }}</v-card-text>
        <v-card-actions>
          <v-btn flat block color="cyan" @click="dialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <admin-panel/>
    <v-container grid-list-xl text-xs-center>
      <v-layout column warp>
        <v-card>
          <v-flex align-self-center xs12>
            <h1 class="headline">Generate token for user</h1>
          </v-flex>
          <v-flex>
            <v-menu offset-y>
              <v-btn slot="activator" dark block large>Choose quiz to generate user token for</v-btn>
              <v-list>
                <v-list-tile v-for="(name, index) in names" :key="index" @click="setName(index)">
                  <v-list-tile-title>{{ name }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-flex>
          <v-flex>
            <h1 class="headline">{{ quizName }}</h1>
          </v-flex>
          <v-flex>
            <v-text-field label="user name" v-model="userName" outline v-on:keyup.enter="generate"></v-text-field>
          </v-flex>
          <v-flex>
            <v-btn @click="generate">Generate</v-btn>
          </v-flex>
        </v-card>
      </v-layout>
    </v-container>
    <v-snackbar v-model="error" :timeout="5000" :top="true">
      {{ errorMessage }}
      <v-btn color="pink" flat @click="error = false">Close</v-btn>
    </v-snackbar>
  </div>
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
      quizName: "",
      userName: "",
      dialog: false,
      dialogMessage: "",
      error: null,
      errorMessage: ""
    };
  },
  async asyncData({ $axios, store }) {
    if (!store.state.cachedNames) {
      const res = await $axios.$get(
        "http://localhost:3000/api/fetch-collection-names"
      );
      store.commit("SET_NAME_CACHE", res);
      return {
        names: res
      };
    } else {
      return {
        names: store.state.cachedNames
      };
    }
  },
  methods: {
    generate: async function() {
      if (this.userName && this.quizName) {
        const responce = await this.$axios.$post(
          "http://localhost:3000/api/generate-token",
          { quizName: this.quizName, userName: this.userName }
        );
        this.dialogMessage = responce.token;
        this.dialog = true;
      } else {
        this.errorMessage = 'You must specify username and quiz name';
        this.error = true
      }
    },
    setName: function(index) {
      this.quizName = this.names[index];
    }
  }
};
</script>