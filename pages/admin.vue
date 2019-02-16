<template>
	<div>
		<new-collection-form/>
		<edit-collection-form/>
		<delete-collection-form/>
	</div>
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
	}
}
</script>

<style>

</style>
