<template>
  <div>
    <admin-panel/>
    <v-container grid-list-xl text-xs-center>
      <v-layout column warp>
        <v-flex align-self-center xs12>
          <h1 class="headline">Generate token for user</h1>
        </v-flex>
        <v-flex>
          <v-text-field label="quiz name" v-model="quizName" outline></v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field label="user name" v-model="userName" outline></v-text-field>
        </v-flex>
        <v-flex>
          <v-btn @click="generate">Generate</v-btn>
        </v-flex>
      </v-layout>
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
  data() {
    return {
      quizName: "",
      userName: ""
    };
  },
  methods: {
    generate: async function() {
      const responce = await this.$axios.$post(
        "http://localhost:3000/api/generate-token",
        { quizName: this.quizName, userName: this.userName }
      );
      console.log(responce);
    }
  }
};
</script>