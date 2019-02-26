<template v-touch="{
      right: () => swipe()
    }">
  <v-layout column fill-height>
    <v-card>
      <v-flex align-self-center xs12>
        <h1 class="headline py-3">Generate token for user</h1>
      </v-flex>
      <v-flex xs12 mb-4>
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
      <v-flex xs8 offset-xs2>
        <v-text-field label="user name" v-model="userName" outline v-on:keyup.enter="generate"></v-text-field>
      </v-flex>
      <v-flex pb-3>
        <v-btn @click="generate">Generate</v-btn>
      </v-flex>
    </v-card>
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
    <admin-panel :drawer="drawerVisible"/>
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