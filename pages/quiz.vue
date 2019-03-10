<template>
  <v-layout row wrap justify-center>
    <v-flex xs12 class="mb-3">
      <h1 class="display-1 mb-3">{{questions[questionNR].text}}</h1>
      <v-progress-circular
        :rotate="360"
        :size="85"
        :width="10"
        :value="proggres"
        color="cyan"
      >{{ time }}</v-progress-circular>
    </v-flex>
    <v-flex xs6 md2 v-if="questions[questionNR].img">
      <v-img :src="questions[questionNR].img" min-width="100%"></v-img>
    </v-flex>
    <v-flex xs12 my-4 v-for="(answer, index) in questions[questionNR].answers" :key="index">
      <v-card hover :light="answer.value" @click="setAnswer(index)">
        <v-card-text class="subheading pa-4">{{ answer.text }}</v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-btn large @click="nextQuestion" color="cyan">NEXT</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  layout: "quiz",
  middleware: "checkName",
  data() {
    return {
      questionNR: 0,
      answers: [],
      time: null,
      proggres: 100
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
  mounted: function() {
    this.time = this.questions[this.questionNR].time;
    const self = this;
    setInterval(function() {
      self.time--;
      self.proggres = (
        (self.time / self.questions[self.questionNR].time) *
        100
      ).toFixed(0);
      if (self.time === 0) {
        self.proggres = 100;
        self.nextQuestion();
      }
    }, 1000);
  },
  methods: {
    setAnswer: function(id) {
      this.questions[this.questionNR].answers[id].value = !this.questions[
        this.questionNR
      ].answers[id].value;
    },
    nextQuestion: function() {
      if (this.questionNR + 1 === this.questions.length) {
        this.answers.push(this.questions[this.questionNR].answers);
        this.sendAnswers();
      } else {
        this.answers.push(this.questions[this.questionNR].answers);
        this.questionNR++;
        this.time = this.questions[this.questionNR].time;
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

<style scoped>

</style>
