module.exports = async () => {
	const db = require('mongodb');
	const url = 'mongodb://localhost:27017';
	const client = await db.MongoClient.connect(url, { useNewUrlParser: true });

	const dbInstance = client.db('quizCollections');

	return dbInstance;
};