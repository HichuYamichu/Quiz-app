const db = require('./questionsDB');
const configDB = require('./configDB');
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

  async fetchCollections() {
    const dbInstance = await db();
    const collNames = await dbInstance.listCollections().toArray()
    return collNames
  },

  async editCollections(name, questions) {
    const dbInstance = await db();
    const coll = await dbInstance.collection(name);
    questions.forEach(question => {
      coll.updateOne({ _id: new ObjectID(question._id) }, { $set: { "text": question.text, "answers": question.answers } }, { upsert: true })
    });
  },

  async deleteCollection(name) {
    try {
      const dbInstance = await db();
      const coll = await dbInstance.collection(name);
      await coll.drop()
    } catch (err) {
      return 'Wrong collection name'
    }
  },

  async generate(quizName, userName) {
    const token = shortid.generate();
    const dbInstance = await configDB();
    const coll = await dbInstance.collection('TOKENS');
    await coll.insertOne({ username: userName, quiz: quizName, token: token })
    return token;
  },

  async fetchTokens() {
    const dbInstance = await configDB();
    const coll = await dbInstance.collection('TOKENS');
    const tokens = await coll.find().toArray()
    return tokens
  },

  async authenticateUser(token) {
    const dbInstance = await configDB();
    const coll = await dbInstance.collection('TOKENS');
    try {
      const userObj = await coll.findOne({ token: token })
      return userObj
    } catch (err) {
      return undefined
    }
  },

  async checkAnsweres(recivedAnswers, user) {
    const dbInstance = await db();
    const dbInstance2 = await configDB();
    const coll = await dbInstance.collection(user.quiz).find().toArray()
    const answersFromDB = coll.map(document => document.answers);
    let points = 0;
    let match;
    for (i = 0; i < recivedAnswers.length; i++) {
      for (j = 0; j < recivedAnswers[i].length; j++) {
        if (recivedAnswers[i][j].value === answersFromDB[i][j].value) match = true
        else {
          match = false
          break
        }
      }
      if (match) points++
    }
    const collectionLength = coll.length
    await dbInstance2.collection('scores').insertOne({ username: user.userName, quiz: user.quiz, score: points, max: collectionLength })
    return { score: points, length: collectionLength }
  },

  async fetchScores() {
    const dbInstance = await configDB();
    const coll = await dbInstance.collection('scores');
    const scores = await coll.find().toArray()
    return scores
  }


}