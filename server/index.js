const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser');
const db = require('./database/index');
const collections = require('./database/questions');
const app = express()
const helpers = require('./helpers')


const arr1 = [{ text: 'blablah', value: false }, { text: 'blablah', value: true }, { text: 'blablah', value: false }]
const arr2 = [{ text: 'blablah', value: false }, { text: 'blablah', value: false }, { text: 'blablah', value: false }]

console.log(helpers.compare(arr1, arr2))

app.use(bodyParser.json());

app.post('/api/questions', async (req, res) => {
  questions = await collections.fetchCollection(req.body.collName)
	questions.forEach(question => {
		delete question._id
		question.answers.forEach(answer => {
			answer.value = false
		})
	});
	res.send(questions)
});

app.post('/api/answers', (req, res) => {
  console.log(req.body)

  res.sendStatus(200)
});


app.post('/api/new-collection', async (req, res) => {
  const dbInstance = await db();  
  await dbInstance.createCollection(req.body.name)
	await dbInstance.collection(req.body.name).insertMany(req.body.questions);
  console.log(req.body)
  res.sendStatus(200)
})

app.post('/api/fetch-collection', async (req, res) => {
	try {
		questionsFromDB = await collections.fetchCollection(req.body.name)
		res.send(questionsFromDB)
	} catch (err) {
		res.sendStatus(500)
	}
})

app.post('/api/update-collection', async (req, res) => {
  await collections.editCollections(req.body.name, req.body.questions)
  res.sendStatus(200)
})

app.post('/api/delete-collection', async (req, res) => {
  await collections.deleteCollection(req.body.name)
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
