<template>
  <v-card>
    <v-layout column>
      <v-flex align-self-center pa-1>
        <h1 class="headline">{{questions[questionNR].text}}</h1>
      </v-flex>
      <v-flex v-for="(answer, index) in questions[questionNR].answers" :key="index" pa-2 >
        <v-btn block @click="setAnswer(index)" :light="answer.value" large>
          {{ answer.text }}
        </v-btn>
      </v-flex>
      <v-flex align-self-center>
        <v-btn @click="sendAnswers" color="cyan">
          send answers
        </v-btn>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      questionNR: 0,
    }
  },
  async asyncData({ $axios, store }) {
    const Questions = await $axios.$post('http://localhost:3000/api/questions', {collName: store.state.collectionName})
		console.log(Questions)
    return {
      questions: Questions  
    }
  },
  methods: {
    setAnswer: function(id) {
			 this.questions[this.questionNR].answers[id].value = !this.questions[this.questionNR].answers[id].value
    },
    sendAnswers: async function(id) {
      await this.$axios.$post('http://localhost:3000/api/answers', this.questions[this.questionNR])
      if (this.questionNR + 1 === this.questions.length) {
        this.$router.push({
          path: '/'
        })
      } else {
        this.questionNR++
        // this.$forceUpdate
      } 
    }
  }
}
</script>

<style>

</style>
