const DBs = require('./index');
const ObjectID = require('mongodb').ObjectID;
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

module.exports = {
  async createCollection(collName, questions) {
    const dbInstance = await DBs.mainDB();
    await dbInstance.createCollection(collName);
    await dbInstance.collection(collName).insertMany(questions);
  },

  async fetchCollection(name) {
    const dbInstance = await DBs.mainDB();
    const coll = await dbInstance.collection(name);
    const questions = await coll.find().toArray();
    return questions;
  },

  async fetchCollections() {
    const dbInstance = await DBs.mainDB();
    const collNames = await dbInstance.listCollections().toArray();
    return collNames;
  },

  async editCollections(name, questions) {
    const dbInstance = await DBs.mainDB();
    const coll = await dbInstance.collection(name);
    questions.forEach(question => {
      coll.updateOne({ _id: new ObjectID(question._id) }, { $set: { text: question.text, answers: question.answers } }, { upsert: true });
    });
  },

  async deleteCollection(name) {
    const dbInstance = await DBs.mainDB();
    const coll = await dbInstance.collection(name);
    await coll.drop();
  },

  async generate(quizName, userName) {
    const token = shortid.generate();
    const dbInstance = await DBs.configDB();
    const coll = await dbInstance.collection('TOKENS');
    coll.createIndex({ lastModifiedDate: 1 }, { expireAfterSeconds: 20 });
    await coll.insertOne({ createdAt: new Date(), username: userName, quiz: quizName, token: token });
    return token;
  },

  async fetchTokens() {
    const dbInstance = await DBs.configDB();
    const coll = await dbInstance.collection('TOKENS');
    const tokens = await coll.find().toArray();
    return tokens;
  },

  async authenticateUser(token) {
    const dbInstance = await DBs.configDB();
    const coll = await dbInstance.collection('TOKENS');
    const userObj = await coll.findOne({ token: token });
    return userObj;
  },

  async checkAnsweres(recivedAnswers, user) {
    const dbInstance = await DBs.mainDB();
    const dbInstance2 = await DBs.configDB();
    const coll = await dbInstance.collection(user.quiz).find().toArray();
    const answersFromDB = coll.map(document => document.answers);
    let points = 0;
    let match;
    for (let i = 0; i < recivedAnswers.length; i++) {
      for (let j = 0; j < recivedAnswers[i].length; j++) {
        if (recivedAnswers[i][j].value === answersFromDB[i][j].value) {
          match = true;
        } else {
          match = false;
          break;
        }
      }
      if (match) points++;
    }
    const collectionLength = coll.length;
    await dbInstance2.collection('scores').insertOne({ username: user.userName, quiz: user.quiz, score: points, max: collectionLength });
    return { score: points, length: collectionLength };
  },

  async fetchScores() {
    const dbInstance = await DBs.configDB();
    const coll = await dbInstance.collection('scores');
    const scores = await coll.find().toArray();
    return scores;
  }
};
