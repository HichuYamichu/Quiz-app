const db = require('./index.js');
const ObjectID = require('mongodb').ObjectID;

module.exports = {
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
			coll.updateOne({ _id: new ObjectID(question._id) }, { $set: { "text": question.text, "answers": question.answers }}, { upsert: true })
		});
	},

	async deleteCollection(name) {
		const dbInstance = await db();
		const coll = await dbInstance.collection(name);
		await coll.drop()
	}


}