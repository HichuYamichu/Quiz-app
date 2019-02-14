const dbInstance = require('./index.js');

module.exports = {
  async addQuestion() {

  },

  async fetchCollection(name) {
		const coll = dbInstance.collection(name);
		const questions = coll.find().toArray();
		return questions
  }


}