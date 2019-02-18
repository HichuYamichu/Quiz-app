<template>
  <v-layout>
    <v-flex>
      <v-toolbar>
        <v-btn flat block large nuxt to="/admin/new">New</v-btn>
        <v-btn flat block large nuxt to="/admin/edit">edit</v-btn>
        <v-btn flat block large nuxt to="/admin/delete">delete</v-btn>
        <v-btn flat block large nuxt to="/admin/generate">generate token</v-btn>
      </v-toolbar>
    </v-flex>
  </v-layout>
</template>

<script>
export default {};
</script>

<style>
</style>
