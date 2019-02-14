<template>
  <v-card>
    <v-layout column>
      <v-flex align-self-center pa-1>
        <h1 class="headline">{{question.text}}</h1>
      </v-flex>
      <v-flex v-for="(answer, index) in question.answers" :key="index" pa-2 >
        <v-btn block @click="setAnswer(index)" :light="answer.value" large>
          {{answer.text}}
        </v-btn>
      </v-flex>
      <v-flex align-self-center>
        <v-btn @click="sendAnswers(question.answers)" color="cyan">
          send answers
        </v-btn>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import axios from 'axios'

export default {
  async asyncData({ $axios }, questionNR = 1 ) {
    let Question = await $axios.$post('http://localhost:3000/api/questions', { questionNR })
    return { question: Question }
  },
  methods: {
    setAnswer: function(id) {
      this.question.answers[id].value = !this.question.answers[id].value
    },
    sendAnswers: async function(choosenAnswers) {
      const allAnswers = choosenAnswers.map(answer => answer.value)
      await this.$axios.$post('http://localhost:3000/api/answers', allAnswers)
      
    }
  }
}
</script>

<style>

</style>
