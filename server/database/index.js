async function connect() {
	const MongoClient = require('mongodb').MongoClient
	const url = 'mongodb://localhost:27017';
	const client = await MongoClient.connect(url, { useNewUrlParser: true });
	return client
};

module.exports.mainDB = async () => {
  const client = await connect();
  const mainDB = client.db('quizCollections');
  return mainDB
}

module.exports.configDB = async () => {
  const client = await connect();
  const configDB = await client.db('quiz');
  return configDB
}