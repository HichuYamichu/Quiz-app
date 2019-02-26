<template>
  <v-layout>
    <v-flex>
      <v-toolbar app>
        <v-btn flat @click="open">
          <v-icon>menu</v-icon>
        </v-btn>
      </v-toolbar>
      <v-navigation-drawer temporary v-if="$device.isMobile" v-model="drawerOn" absolute>
        <v-toolbar flat class="transparent">
          <v-list>
            <v-btn flat block large nuxt to="/admin/new">New</v-btn>
            <v-btn flat block large nuxt to="/admin/edit">edit</v-btn>
            <v-btn flat block large nuxt to="/admin/delete">delete</v-btn>
            <v-btn flat block large nuxt to="/admin/generate">generate token</v-btn>
            <v-btn flat block large nuxt to="/admin/tokens">list tokens</v-btn>
            <v-btn flat block large nuxt to="/admin/scores">list scores</v-btn>
          </v-list>
        </v-toolbar>
      </v-navigation-drawer>
      <v-toolbar app v-if="$device.isDesktop">
        <v-btn flat block large nuxt to="/admin/new">New</v-btn>
        <v-btn flat block large nuxt to="/admin/edit">edit</v-btn>
        <v-btn flat block large nuxt to="/admin/delete">delete</v-btn>
        <v-btn flat block large nuxt to="/admin/generate">generate token</v-btn>
        <v-btn flat block large nuxt to="/admin/tokens">list tokens</v-btn>
        <v-btn flat block large nuxt to="/admin/scores">list scores</v-btn>
      </v-toolbar>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ["drawer"],
  watch: {
    drawer: function(newVal) {
      this.drawerOn = newVal;
    }
  },
  data() {
    return {
      drawerOn: false
    };
  },
  methods: {
    open: function() {
      this.drawerOn = !this.drawerOn;
    }
  }
};
</script>

<style>
</style>
