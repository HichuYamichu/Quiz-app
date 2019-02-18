<template>
  <div>
    <admin-panel/>
    <v-container grid-list-xl text-xs-center>
      <v-layout column warp>
        <v-flex align-self-center xs12>
          <h1 class="headline">Delete collection</h1>
        </v-flex>
        <v-flex xs12>
          <v-card>
            <v-layout row warp>
              <v-flex xs8 offset-xs1>
                <v-text-field label="Collection name" outline v-model="name"></v-text-field>
              </v-flex>
              <v-flex xs2>
                <v-btn block large @click="deleteCollection">Delete</v-btn>
              </v-flex>
            </v-layout>
          </v-card>
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
      name: "",
      error: null
    };
  },
  methods: {
    deleteCollection: async function() {
      try {
        const res = await this.$axios.$delete(
          "http://localhost:3000/api/delete-collection",
          { data: { name: this.name } }
        );
      } catch (err) {
        this.error = err;
        console.log(err);
      }
    }
  }
};
</script>

<style>
</style>
