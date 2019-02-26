const db = require('./index');
const ObjectID = require('mongodb').ObjectID;
const shortid = require('shortid');
// shortid.characters(
//   '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
// );

module.exports = {
  async createCollection(collName, questions) {
    await db.mainDB().createCollection(collName);
    await db
      .mainDB()
      .collection(collName)
      .insertMany(questions);
  },

  async fetchCollection(name) {
    const coll = await db.mainDB().collection(name);
    const questions = await coll.find().toArray();
    return questions;
  },

  async fetchCollections() {
    const collections = await db
      .mainDB()
      .listCollections()
      .toArray();
    const collNames = collections.map(coll => coll.name);
    return collNames;
  },

  async editCollections(name, questions) {
    const coll = await db.mainDB().collection(name);
    questions.forEach(question => {
      coll.updateOne(
        { _id: new ObjectID(question._id) },
        { $set: { text: question.text, answers: question.answers } },
        { upsert: true }
      );
    });
  },

  async deleteCollection(name) {
    const coll = await db.mainDB().collection(name);
    await coll.drop();
  },

  async generate(quizName, userName) {
    const token = shortid.generate();
    const coll = await db.configDB().collection('TOKENS');
    coll.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });
    await coll.insertOne({
      createdAt: new Date(),
      username: userName,
      quiz: quizName,
      token: token
    });
    return token;
  },

  async fetchTokens() {
    const coll = await db.configDB().collection('TOKENS');
    const tokens = await coll.find().toArray();
    return tokens;
  },

  async authenticateUser(token) {
    const coll = await db.configDB().collection('TOKENS');
    const userObj = await coll.findOne({ token: token });
    return userObj;
  },

  async checkAnsweres(recivedAnswers, user) {
    const coll = await db
      .mainDB()
      .collection(user.quiz)
      .find()
      .toArray();
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
    await db
      .configDB()
      .collection('scores')
      .insertOne({
        username: user.userName,
        quiz: user.quiz,
        score: points,
        max: collectionLength
      });
    return { score: points, length: collectionLength };
  },

  async fetchScores() {
    const coll = await db.configDB().collection('scores');
    const scores = await coll.find().toArray();
    return scores;
  },

  async deleteScores(score) {
    const coll = await db.configDB().collection('scores');
    await coll.deleteOne({ _id: new ObjectID(score._id) });
  },

  async deleteUser(user) {
    const coll = await db.configDB().collection('TOKENS');
    await coll.deleteOne({ token: user.token });
  }
};
