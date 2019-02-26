<template v-touch="{
      right: () => swipe()
    }">
  <v-layout column fill-height>
    <admin-panel :drawer="drawerVisible"/>
    <v-flex xs12>
      <v-menu offset-y full-width>
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
        <v-btn fab small absolute top right color="cyan" @click="removeQuestion(index)">
          <v-icon>remove</v-icon>
        </v-btn>
        <v-layout row wrap>
          <v-flex xs12 my-4>
            <h3 class="headline">Question: {{ index + 1 }}</h3>
          </v-flex>
          <v-flex xs6 offset-xs3>
            <v-text-field label="Question text" outline v-model="question.text"></v-text-field>
          </v-flex>
          <v-flex xs10 offset-xs1 v-for="(answer, index2) in question.answers" :key="index2">
            <v-layout row wrap justify-space-between>
              <v-flex xs4>
                <v-text-field :label="`Answer ${index2 + 1}`" outline v-model="answer.text"></v-text-field>
              </v-flex>
              <v-flex xs3>
                <v-btn
                  round
                  :color="answer.value ? 'accent' : 'secondary'"
                  @click="changeValue(index, index2)"
                >
                  <v-icon v-if="answer.value">check</v-icon>
                  <v-icon v-else>close</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs3>
                <v-btn round @click="removeAnswer(index, index2)">remove</v-btn>
              </v-flex>
              <v-flex xs4 v-if="index2 + 1 == question.answers.length">
                <v-btn block large @click="addAnswer(index)">add answer</v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
    <v-flex>
      <v-btn v-if="questions.length" large color="cyan" @click="addQuestion">add question</v-btn>
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
    removeAnswer: function(index, index2) {
      this.questions[index].answers.splice(index2, 1);
    },
    changeValue: function(index, index2) {
      this.questions[index].answers[index2].value = !this.questions[index]
        .answers[index2].value;
    },
    removeQuestion: function(index) {
      this.questions.splice(index, 1);
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
