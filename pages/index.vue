<template>
  <div class="main">
    <v-text-field label="TOKEN" :type="type" v-model="collectionName" outline></v-text-field>
    <v-btn @click="go">GO</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      collectionName: "",
      type: "text"
    };
  },
  methods: {
    go: async function() {
      // this.$store.commit('handeRequest', this.collectionName)
      // this.$router.push('/quiz')
      await this.$store.dispatch("handeRequest", this.collectionName);
      if (this.$store.state.admin) {
        this.$router.push("/admin/new");
      }
    }
  },
  watch: {
    collectionName: function() {
      if (this.collectionName.charAt(0) == "\\") {
        this.type = "password";
      } else {
        this.type = "text";
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
