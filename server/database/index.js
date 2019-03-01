let _configDB;
let _mainDB;

async function connect() {
	const MongoClient = require('mongodb').MongoClient;
  const URI = 'mongodb://mongo:27017';
  const client = await MongoClient.connect(URI, { useNewUrlParser: true });
	_mainDB = client.db('quizCollections');
	const configurationDB = await client.db('quiz');
	_configDB = configurationDB;
	return configurationDB;
}

const configDB = () => _configDB
const mainDB = () => _mainDB


module.exports = { configDB, mainDB, connect }