<template>
  <!-- <div class="main">
    <v-text-field :label="label" :type="type" v-model="token" outline v-on:keyup.enter="go"></v-text-field>
    <v-btn @click="go">GO</v-btn>
  </div>-->
  <v-container fill-height fluid grid-list-md text-xs-center>
    <v-layout align-center justify-center>
      <v-flex xs8 md6 lg4>
        <v-layout column wrap>
          <v-flex>
            <v-text-field :label="label" :type="type" v-model="token" outline v-on:keyup.enter="go"></v-text-field>
          </v-flex>
          <v-flex>
            <v-btn @click="go">GO</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      token: "",
      type: "text",
      label: "TOKEN"
    };
  },
  methods: {
    go: async function() {
      if (this.token) {
        await this.$store.dispatch("handeRequest", this.token);
        if (this.$store.state.admin) {
          this.$router.push("/admin/new");
        }
      }
    }
  },
  watch: {
    token: function() {
      if (this.token.charAt(0) == "\\") {
        this.type = "password";
        this.label = "Password";
      } else {
        this.type = "text";
        this.label = "TOKEN";
      }
    }
  }
};
</script>

<style scoped>
.main {
  width: 50%;
  height: 50%;
  margin: 30vh auto;
  text-align: center;
}
</style>
