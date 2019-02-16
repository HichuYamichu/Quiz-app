<template>
	<div class="main">
		<v-text-field label="Collection name" v-model="collectionName" outline></v-text-field>
		<v-btn @click="go">
					GO
				</v-btn>	
	</div>
  <!-- <v-container>
		<v-layout align-center justify-end column fill-height>
			<v-flex xs8 >
				<v-text-field label="Collection name" v-model="collectionName" outline></v-text-field>
			</v-flex>
			<v-flex xs4>
				<v-btn @click="go">
					GO
				</v-btn>
			</v-flex>
		</v-layout>
	</v-container> -->
</template>

<script>
export default {
	data() {
		return {
			collectionName: ''
		}
	},
  methods: {
		go: function() {
			this.$store.commit('PASS', this.collectionName)
			this.$router.push('/quiz')
		}
	}
}
</script>

<style scoped>
	.main {
		width: 30%;
		height: 50%;
		margin: 30vh auto;
		text-align: center;
	}

</style>
