<template>
  <v-layout column>
    <h1 class="display-1 mb-5 mt-2">{{questions[questionNR].text}}</h1>
    <v-flex my-1 v-for="(answer, index) in questions[questionNR].answers" :key="index">
      <v-card hover :light="answer.value" @click="setAnswer(index)">
        <v-card-text class="subheading pa-4">{{ answer.text }}</v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs6>
      <v-btn large @click="nextQuestion" color="cyan">NEXT</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  middleware: "checkName",
  data() {
    return {
      questionNR: 0,
      answers: []
    };
  },
  async asyncData({ $axios, store }) {
    const Questions = await $axios.$get(
      `/api/questions?name=${store.state.user.quiz}`
    );
    return {
      questions: Questions
    };
  },
  methods: {
    setAnswer: function(id) {
      this.questions[this.questionNR].answers[id].value = !this.questions[
        this.questionNR
      ].answers[id].value;
    },
    nextQuestion: function(id) {
      if (this.questionNR + 1 === this.questions.length) {
        this.answers.push(this.questions[this.questionNR].answers);
        this.sendAnswers();
      } else {
        this.answers.push(this.questions[this.questionNR].answers);
        this.questionNR++;
      }
    },
    sendAnswers: async function() {
      const res = await this.$axios.$post("/api/send-answers", {
        answers: this.answers,
        user: this.$store.state.user
      });
      this.$store.commit("SET_SCORE", res);
      this.$router.push({
        path: "/score"
      });
    }
  }
};
</script>

<style>
</style>
