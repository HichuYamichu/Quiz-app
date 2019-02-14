<template>
	<div id="app">
  <div v-for="(field, index) in fields" :key="index">
    <v-text-field label="text" v-model="field.value"></v-text-field>
  </div>
  <button @click="addField">
    add
  </button>
	<button @click="check">
    check
  </button>
  <pre>{{ $data }}</pre>
</div>
</template>

<script>
export default {
	data() {
		return {
			fields: []
		}
	},
	methods: {
    addField: function () {
      this.fields.push({ value: '' });
    },
		check: function() {
			console.log(this.fields)
		}
  }
}
</script>

<style>

</style>
