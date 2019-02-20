<template>
  <div class="main">
    <v-text-field :label="label" :type="type" v-model="token" outline></v-text-field>
    <v-btn @click="go">GO</v-btn>
  </div>
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
      await this.$store.dispatch("handeRequest", this.token);
      if (this.$store.state.admin) {
        this.$router.push("/admin/new");
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
  width: 30%;
  height: 50%;
  margin: 30vh auto;
  text-align: center;
}
</style>
