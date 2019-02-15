const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser');
const app = express()

app.use(bodyParser.json());

const db = require('./database/questions');
app.post('/api/questions', async (req, res) => {
  questionsFromDB = await db.fetchCollection(req.body.collName = 'questions')
  
  const safeRespnce = []
  questionsFromDB.forEach(question => {
    safeRespnce.push({
      text: question.text,
      answers: question.answers.map(answer => answer.text)
    })
  });
	res.send(safeRespnce)
});

app.post('/api/answers', (req, res) => {
  console.log(req.body)

  res.sendStatus(200)
});

const dbtest = require('./database/index')
app.post('/api/new-collection', async (req, res) => {
  const dbInstance = await dbtest();  
  await dbInstance.createCollection(req.body.name)
	const coll = await dbInstance.collection(req.body.name).insertMany(req.body.questions);
  console.log(req.body)
  res.sendStatus(200)
})

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
