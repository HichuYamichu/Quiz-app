<template>
  <div>
    <admin-panel/>
    <v-container grid-list-xl text-xs-center>
      <v-layout column warp>
        <v-card>
          <v-flex align-self-center xs12>
            <h1 class="headline">Delete collection</h1>
          </v-flex>
          <v-flex xs12>
            <v-layout row warp>
              <v-flex xs8 offset-xs1>
                <v-text-field label="Collection name" outline v-model="name"></v-text-field>
              </v-flex>
              <v-flex xs2>
                <v-btn block large @click="deleteCollection">Delete</v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-card>
      </v-layout>
    </v-container>
    <v-snackbar v-model="error" :timeout="5000" :top="true">
      {{ errorMessage }}
      <v-btn color="pink" flat @click="error = false">Close</v-btn>
    </v-snackbar>
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
      name: "",
      error: null,
      errorMessage: ""
    };
  },
  methods: {
    deleteCollection: async function() {
      const res = await this.$axios.$delete(
        "/api/delete-collection",
        { data: { name: this.name } }
      );
      if (res) {
        this.error = true;
        this.errorMessage = res;
      }
    }
  }
};
</script>

<style>
</style>
