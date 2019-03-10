<template v-touch="{
      right: () => swipe()
    }">
  <v-layout column fill-height>
    <admin-panel :drawer="drawerVisible"/>
    <v-flex>
      <h1 class="headline my-2">Create new collection</h1>
    </v-flex>
    <v-flex>
      <v-text-field label="collection name" v-model="collectionName" outline></v-text-field>
    </v-flex>
    <v-flex v-for="(question, index) in questions" :key="index" my-4>
      <v-card dark elevation-15 class="pb-3">
        <file-input :index="index" @fileChanged="handleFileUpload" ></file-input>
        <v-layout row wrap>
          <v-flex xs12 my-4>
            <h3 class="headline">Question: {{ index + 1 }}</h3>
          </v-flex>
          <v-flex xs6 offset-xs2>
            <v-text-field label="Question text" outline v-model="question.text"></v-text-field>
          </v-flex>
					<v-flex xs2>
            <v-text-field label="time" outline v-model="question.time"></v-text-field>
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
    <v-flex>
      <v-btn large @click="create">create collection</v-btn>
    </v-flex>
    <v-snackbar v-model="error" :timeout="5000" :top="true">
      {{ errorMessage }}
      <v-btn color="pink" flat @click="error = false">Close</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import AdminPanel from "@/components/AdminPanel";
import FileInput from "@/components/FileInput";

export default {
  components: {
    AdminPanel,
		FileInput
  },
  middleware: "auth",
  data() {
    return {
      collectionName: "",
      questions: [
        { text: "", img: null, time: 60, answers: [{ text: "", value: false }] }
      ],
      images: [],
      fileName: [],
      error: null,
      errorMessage: "",
      drawerVisible: true
    };
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
    handleFileUpload: async function(file, index) {
      this.questions[index].img = file;
    },
    create: function() {
      if (this.collectionName && !this.collectionName.includes(".")) {
        this.$axios.$post("/api/admin/new-collection", {
          name: this.collectionName,
          questions: this.questions
        });
        this.collectionName = "";
        this.questions = [
          { text: "", img: "", answers: [{ text: "", value: false }] }
        ];
      } else {
        this.error = true;
        this.errorMessage = "Collection name must not be empty or contain .";
      }
    },
    swipe: function() {
      this.drawerVisible = !this.drawerVisible;
    }
  }
};
</script>

<style scoped>
</style>
