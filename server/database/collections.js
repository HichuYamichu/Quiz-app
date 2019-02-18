const db = require('./index.js');
const ObjectID = require('mongodb').ObjectID;
const shortid = require('shortid');

module.exports = {
	async createCollection(collName, questions) {
		const dbInstance = await db();
		await dbInstance.createCollection(collName);
		await dbInstance.collection(collName).insertMany(questions);
	},
	async fetchCollection(name) {
		const dbInstance = await db();
		const coll = await dbInstance.collection(name);
		const questions = await coll.find().toArray();
		return questions
	},

	async editCollections(name, questions) {
		const dbInstance = await db();
		const coll = await dbInstance.collection(name);
		questions.forEach(question => {
			coll.updateOne({ _id: new ObjectID(question._id) }, { $set: { "text": question.text, "answers": question.answers } }, { upsert: true })
		});
	},

	async deleteCollection(name) {
		const dbInstance = await db();
		const coll = await dbInstance.collection(name);
		await coll.drop()
	},

	async generate(quizName, userName) {
		const token = shortid.generate();
		const dbInstance = await db();
		const coll = await dbInstance.collection('users');
		await coll.insertOne({ username: userName, quiz: quizName, token: token })
		return token;
	},

	async authenticateUser(token) {
		const dbInstance = await db();
		const coll = await dbInstance.collection('users');
		try {
			const userObj = await coll.findOne({ token: token })
			return userObj
		} catch (err) {
			return undefined
		}
	}


}