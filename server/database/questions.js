const db = require('./index.js');

module.exports = {
  async addQuestion() {

  },

  async fetchCollection(name) {
    const dbInstance = await db();
    
		const coll = await dbInstance.collection(name);
    const questions = await coll.find().toArray();
		return questions
  }


}