<template>
  <div>
    <admin-panel/>
    <v-container grid-list-xl text-xs-center>
      <v-layout column warp>
        <v-flex xs6>
          <v-menu offset-y>
            <v-btn slot="activator" dark block large>Choose colllection to edit</v-btn>
            <v-list>
              <v-list-tile v-for="(name, index) in names" :key="index" @click="setName(index)">
                <v-list-tile-title>{{ name }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
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
  async asyncData({ $axios }) {
    const res = await $axios.$get(
      "/api/fetch-collection-names"
    );
    return {
      names: res
    };
  },
  methods: {
    addQuestion: function() {
      this.questions.push({ text: "", answers: [{ text: "", value: false }] });
    },
    addAnswer: function(index) {
      this.questions[index].answers.push({ text: "", value: false });
    },
    update: async function() {
      await this.$axios.$post("/api/update-collection", {
        name: this.collectionName,
        questions: this.questions
      });
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
    }
  }
};
</script>

<style>
</style>
