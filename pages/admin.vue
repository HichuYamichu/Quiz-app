<template>
	<v-layout>
		<v-flex>
			<v-toolbar>
					<v-btn flat block large @click="showNewCollection">
						New
					</v-btn>
					<v-btn flat block large @click="showEditCollection">
						edit
					</v-btn>
					<v-btn flat block large @click="showDeleteCollection">
						delete
					</v-btn>
			</v-toolbar>
			<new-collection-form v-if="newCollection" />
			<edit-collection-form v-if="editCollection" />
			<delete-collection-form v-if="deleteCollection" />
		</v-flex>
	</v-layout>
</template>

<script>
import NewCollectionForm from '@/components/NewCollectionForm'
import EditCollectionForm from '@/components/EditCollectionForm'
import DeleteCollectionForm from '@/components/DeleteCollectionForm'

export default {
	components: {
		NewCollectionForm,
		EditCollectionForm,
		DeleteCollectionForm
	},
	data() {
		return {
			newCollection: true,
			editCollection: false,
			deleteCollection: false
		}
	},
	methods: {
		showNewCollection: function() {
			this.editCollection = false
			this.deleteCollection = false
			this.newCollection = true
		},
		showEditCollection: function() {
			this.editCollection = true
			this.deleteCollection = false
			this.newCollection = false
		},
		showDeleteCollection: function() {
			this.editCollection = false
			this.deleteCollection = true
			this.newCollection = false
		}
	}
}
</script>

<style>

</style>
