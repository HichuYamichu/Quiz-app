<template v-touch="{
      right: () => swipe()
    }">
  <v-layout column fill-height align-content-space-around>
    <v-card>
      <h1 class="headline pa-3">Delete collection</h1>
      <v-flex xs8 offset-xs2>
        <v-text-field label="Collection name" outline v-model="name"></v-text-field>
      </v-flex>
      <v-flex xs2 offset-xs5 mb-3>
        <v-btn block large @click="deleteCollection">Delete</v-btn>
      </v-flex>
    </v-card>
    <v-snackbar v-model="error" :timeout="5000" :top="true">
      {{ errorMessage }}
      <v-btn color="pink" flat @click="error = false">Close</v-btn>
    </v-snackbar>
    <admin-panel :drawer="drawerVisible"/>
  </v-layout>
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
      errorMessage: "",
      drawerVisible: false
    };
  },
  methods: {
    deleteCollection: async function() {
      try {
        const res = await this.$axios.$delete("/api/delete-collection", {
          data: { name: this.name }
        });
        if (res) {
          this.error = true;
          this.errorMessage = res;
        }
      } catch (err) {
        console.log(err);
        this.$rouer.push("/");
      }
    },
    swipe: function() {
      this.drawerVisible = !this.drawerVisible;
    }
  }
};
</script>

<style>
</style>
