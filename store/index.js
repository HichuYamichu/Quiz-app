export const state = () => ({
  collectionName: null
})

export const mutations = {
  PASS(state, name) {
		state.collectionName = name
	}
}