export default ({ store, redirect }) => {
	if (!store.state.admin) {
		return redirect('/');
	}
};