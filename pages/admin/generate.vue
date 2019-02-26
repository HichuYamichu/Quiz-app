<template v-touch="{
      right: () => swipe()
    }">
  <v-layout align-space-around justify-start column fill-heigh>
    <admin-panel :drawer="drawerVisible"/>
    <v-flex xs12>
      <v-menu offset-y full-width>
        <v-btn slot="activator" dark block large>Choose quiz</v-btn>
        <v-list>
          <v-list-tile v-for="(name, index) in names" :key="index" @click="setName(index)">
            <v-list-tile-title>{{ name }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-card>
        <v-card-text>
          <h1 class="display1 mb-4">{{ quizName }}</h1>
          <v-text-field label="user name" v-model="userName" outline v-on:keyup.enter="generate"></v-text-field>
        </v-card-text>
        <v-btn large @click="generate">Generate</v-btn>
      </v-card>
    </v-flex>
    <v-snackbar v-model="error" :timeout="5000" :top="true">
      {{ errorMessage }}
      <v-btn color="pink" flat @click="error = false">Close</v-btn>
    </v-snackbar>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Generated token:</v-card-title>
        <v-card-text>{{ dialogMessage }}</v-card-text>
        <v-card-actions>
          <v-btn flat block color="cyan" @click="dialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import AdminPanel from "@/components/AdminPanel";

export default {
  name: "generate",
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
      errorMessage: "",
      drawerVisible: false
    };
  },
  async asyncData({ $axios, redirect }) {
    try {
      const res = await $axios.$get("/api/fetch-collection-names");
      return {
        names: res
      };
    } catch (err) {
      redirect("/");
    }
  },
  methods: {
    generate: async function() {
      try {
        if (this.userName && this.quizName) {
          const responce = await this.$axios.$post("/api/generate-token", {
            quizName: this.quizName,
            userName: this.userName
          });
          this.dialogMessage = responce.token;
          this.dialog = true;
        } else {
          this.errorMessage = "You must specify username and quiz name";
          this.error = true;
        }
      } catch (err) {
        console.log(err);
        this$router.push("/");
      }
    },
    setName: function(index) {
      this.quizName = this.names[index];
    },
    swipe: function() {
      this.drawerVisible = !this.drawerVisible;
    }
  }
};
</script>