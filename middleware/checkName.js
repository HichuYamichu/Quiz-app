export default ({ store, redirect }) => {
	if (!store.state.collectionName) {
		return redirect('/');
	}
};