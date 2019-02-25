<template>
  <v-layout column fill-height v-touch="{
      right: () => swipe()
    }">
    <v-btn fixed dark large bottom right color="red" @click="addQuestion">more questions</v-btn>
    <admin-panel :drawer="drawerVisible"/>
    <v-flex xs12>
      <v-menu offset-y>
        <v-btn slot="activator" dark block large>Choose colllection to edit</v-btn>
        <v-list>
          <v-list-tile v-for="(name, index) in names" :key="index" @click="setName(index)">
            <v-list-tile-title>{{ name }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-flex>
    <v-flex v-for="(question, index) in questions" :key="index" my-4>
      <v-card dark elevation-15>
        <v-layout row wrap>
          <v-flex xs12 my-2>
            <h3 class="headline">Question: {{ index + 1}}</h3>
          </v-flex>
          <v-flex xs8 offset-xs1>
            <v-text-field label="Question text" outline v-model="question.text"></v-text-field>
          </v-flex>
          <v-flex xs6 offset-xs1 v-for="(answer, index2) in question.answers" :key="index2">
            <v-btn absolute dark fab small bottom left color="cyan" @click="addAnswer(index)">
              <v-icon>add</v-icon>
            </v-btn>
            <v-layout row>
              <v-flex xs10>
                <v-text-field :label="`Answer ${index2 + 1}`" outline v-model="answer.text"></v-text-field>
              </v-flex>
              <v-flex xs2 mx-3>
                <v-checkbox
                  v-model="questions[index].answers[index2].value"
                  label="Correct"
                  color="white"
                ></v-checkbox>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
    <v-flex v-if="questions.length">
      <v-btn large @click="update">update</v-btn>
    </v-flex>
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
      collectionName: "",
      questions: [],
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
      console.log(err);
      redirect("/");
    }
  },
  methods: {
    addQuestion: function() {
      this.questions.push({ text: "", answers: [{ text: "", value: false }] });
    },
    addAnswer: function(index) {
      this.questions[index].answers.push({ text: "", value: false });
    },
    update: async function() {
      try {
        await this.$axios.$post("/api/update-collection", {
          name: this.collectionName,
          questions: this.questions
        });
      } catch (err) {
        console.log(err);
        this.$router.push("/");
      }
    },
    find: async function() {
      const res = await this.$axios.$get(
        `/api/fetch-collection?name=${this.collectionName}`
      );
      this.questions = [];
      res.forEach(question => {
        this.questions.push(question);
      });
    },
    setName: function(index) {
      this.collectionName = this.names[index];
      this.find();
    },
    swipe: function() {
      this.drawerVisible = !this.drawerVisible;
    }
  }
};
</script>

<style>
</style>
