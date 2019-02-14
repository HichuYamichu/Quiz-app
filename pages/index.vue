<template>
  <div>
    <h1>index</h1>
    <v-btn nuxt to="/quiz">
      quiz
    </v-btn>
    <v-form>
      <v-text-field label="pass" v-model="pass">

      </v-text-field>
      <v-btn @click="login">
        login
      </v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pass: ''
    }
  },
  methods: {
    login(password) {
      this.$store.dispatch('login', password)
      this.pass = ''
    }
  }
}
</script>
