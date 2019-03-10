let _configDB;
let _mainDB;

async function connect() {
	const MongoClient = require('mongodb').MongoClient;
  const URI = process.env.MONGO || 'mongodb://localhost:27017';
  const client = await MongoClient.connect(URI, { useNewUrlParser: true });
	_mainDB = client.db('quizCollections');
	_configDB = await client.db('quiz');
	return _configDB
	// const configDBPromise = await client.db('quiz');
	// _configDB = configDBPromise;
	// return configDBPromise;
}

const configDB = () => _configDB
const mainDB = () => _mainDB


module.exports = { configDB, mainDB, connect }