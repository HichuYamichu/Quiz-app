const db = require('./index');

module.exports = async () => {
	const dbInstance = await db();

	const Questions = dbInstance.collection('questions');

	const collections = {
		questions: Questions,
	};
	return collections;
};