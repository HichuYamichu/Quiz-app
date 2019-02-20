export default ({ store, redirect }) => {
	if (!store.state.score) {
		return redirect('/');
	}
};