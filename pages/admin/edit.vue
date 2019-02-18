<template>
  <div>
    <admin-panel/>
    <v-container grid-list-xl text-xs-center>
      <v-layout column warp>
        <v-flex align-self-center xs12>
          <h1 class="headline">Find collection to edit</h1>
        </v-flex>
        <v-flex align-self-center xs6>
          <v-text-field label="collection name" v-model="collectionName" outline></v-text-field>
        </v-flex>
        <v-flex xs6>
          <v-btn large @click="find">Find</v-btn>
        </v-flex>
      </v-layout>
      <v-layout column wrap>
        <v-flex xs12>
          <v-card dark v-for="(question, index) in questions" :key="index" elevation-15>
            <v-layout row wrap>
              <v-flex xs12>
                <h3 class="headline">Question: {{ index + 1}}</h3>
              </v-flex>
              <v-flex xs8 offset-xs1>
                <v-text-field label="Question text" outline v-model="question.text"></v-text-field>
              </v-flex>
              <v-flex xs2 v-if="index + 1 == questions.length">
                <v-btn block large @click="addQuestion" :ripple="false">More questions</v-btn>
              </v-flex>
              <v-flex xs6 offset-xs1 v-for="(answer, index2) in question.answers" :key="index2">
                <v-layout>
                  <v-flex xs12>
                    <v-text-field :label="`Answer ${index2 + 1}`" outline v-model="answer.text"></v-text-field>
                    <v-btn
                      block
                      large
                      @click="addAnswer(index)"
                      v-if="index2 + 1 == question.answers.length"
                      :ripple="false"
                    >add answer to question {{ index + 1 }}</v-btn>
                  </v-flex>
                  <v-flex>
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
      collectionName: "",
      questions: []
    };
  },
  methods: {
    addQuestion: function() {
      this.questions.push({ text: "", answers: [{ text: "", value: false }] });
    },
    addAnswer: function(index) {
      this.questions[index].answers.push({ text: "", value: false });
    },
    update: function() {
      this.$axios.$post("http://localhost:3000/api/update-collection", {
        name: this.collectionName,
        questions: this.questions
      });
    },
    find: async function() {
      const res = await this.$axios.$get(
        `http://localhost:3000/api/fetch-collection?name=${this.collectionName}`
      );
      res.forEach(question => {
        this.questions.push(question);
      });
    }
  }
};
</script>

<style>
</style>
