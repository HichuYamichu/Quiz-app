const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser');
const db = require('./database/index');
const collections = require('./database/collections');
const app = express()
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const helpers = require('./helpers')

const store = new MongoStore({ dbPromise: db() });

app.use(session({
  store: store,
  secret: process.env.SECRET || 'HIdi65saUB.fds8DAL.;fPOq,(3',
  resave: false,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 2
  }
}));

app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {
  if (req.body.password === process.env.PASSWORD || 'Qwerty123') {
    req.session.admin = true
    res.send({ admin: true })
  } else {
    res.send(401)
  }
})

app.get('/api/questions', async (req, res) => {
  if (req.query.name) {
    try {
      questions = await collections.fetchCollection(req.query.name)
      questions.forEach(question => {
        delete question._id
        question.answers.forEach(answer => {
          answer.value = false
        })
      });
      res.send(questions)
    } catch (err) {
      res.sendStatus(404)
    }
  } else {
    res.sendStatus(404)
  }
});

app.post('/api/answers', (req, res) => {
  console.log(req.body)

  res.sendStatus(200)
});


app.post('/api/new-collection', async (req, res) => {
  if (req.session.admin) {
    await collections.createCollection(req.body.name, req.body.questions)
    res.sendStatus(200)
  } else {
    res.sendStatus(401)
  }
})

app.get('/api/fetch-collection', async (req, res) => {
  try {
    questions = await collections.fetchCollection(req.query.name)
    res.send(questions)
  } catch (err) {
    res.sendStatus(404)
  }
})

app.post('/api/update-collection', async (req, res) => {
  if (req.session.admin) {
    await collections.editCollections(req.body.name, req.body.questions)
    res.sendStatus(200)
  } else {
    res / sendStatus(401)
  }
})

app.delete('/api/delete-collection', async (req, res) => {
  if (req.session.admin) {
    await collections.deleteCollection(req.body.name)
    res.sendStatus(200)
  } else {
    res.sendStatus(401)
  }
})

app.post('/api/generate-token', async (req, res) => {
  const token = await collections.generate(req.body.quizName, req.body.userName)
  res.send({ token: token })
})

app.post('/api/authenticate', async (req, res) => {
  const user = await collections.authenticateUser(req.body.token)
  if (user) {
    req.session.user = { userName: user.username, token: user.token, quiz: user.quiz }
    res.send(user.quiz)
  } else {
    res.sendStatus(404)
  }
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
