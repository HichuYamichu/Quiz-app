<template>
  <div class="pt-3">
    <label>
      <i class="material-icons">file_upload</i>
      <input v-show="false" type="file" :ref="`image${index}`" @change="fileChanged(index)">
    </label>
    <h5>{{ fileName }}</h5>
  </div>
</template>

<script>
export default {
	data() {
		return {
			file: '',
			fileName: ''
		}
	},
	props: ['index'],
	methods: {
		fileChanged: function(index) {
			if (!this.$refs[`image${index}`].files[0]) return
			this.fileName = this.$refs[`image${index}`].files[0].name;
      const reader = new FileReader();
      reader.readAsDataURL(this.$refs[`image${index}`].files[0]);
      reader.onload = () => {
				this.$emit('fileChanged', reader.result, this.index)
			};
      reader.onerror = function(error) {
        console.log("Error: ", error);
      };
		}
	}
};
</script>

<style>
</style>
