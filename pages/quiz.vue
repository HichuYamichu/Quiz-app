<template>
  <v-card>
    <v-layout column>
      <v-flex align-self-center pa-1>
        <h1 class="headline">{{questions[questionNR].text}}</h1>
      </v-flex>
      <v-flex v-for="(answer, index) in questions[questionNR].answers" :key="index" pa-2>
        <v-btn block @click="setAnswer(index)" :light="answer.value" large>{{ answer.text }}</v-btn>
      </v-flex>
      <v-flex align-self-center>
        <v-btn @click="nextQuestion" color="cyan">send answers</v-btn>
      </v-flex>
    </v-layout>
  </v-card>
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
      `http://localhost:3000/api/questions?name=${store.state.user.quiz}`
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
      const res = await this.$axios.$post(
        "http://localhost:3000/api/send-answers",
        { answers: this.answers, user: this.$store.state.user}
      );
      console.log(res)
      this.$store.commit('SET_SCORE', res)
      this.$router.push({
        path: "/score"
      });
    }
  }
};
</script>

<style>
</style>
