const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser');
const DBs = require('./database/index');
const collections = require('./database/collections');
const app = express()
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const store = new MongoStore({ dbPromise: DBs.configDB() });

app.use(session({
  store: store,
  secret: process.env.SECRET || 'HIdi}65saUB.fws8DAL.;fPOq,(3',
  resave: false,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 4
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

app.post('/api/send-answers', async (req, res) => {
  req.session.destroy()
  try {
    const results = await collections.checkAnsweres(req.body.answers, req.body.user)
    res.send({ score: results.score, length: results.length })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
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

app.get('/api/fetch-collection-names', async (req, res) => {
  try {
    const collNames = await collections.fetchCollections()
    const names = collNames.map(collName => collName.name)
    res.send(names)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

app.post('/api/update-collection', async (req, res) => {
  if (req.session.admin) {
    try {
      await collections.editCollections(req.body.name, req.body.questions)
      res.sendStatus(200)
    } catch (err) {
      console.log(err)
      res.sendStatus(500)
    }
  } else {
    res / sendStatus(401)
  }
})

app.delete('/api/delete-collection', async (req, res) => {
  if (req.session.admin) {
    try {
      await collections.deleteCollection(req.body.name)
    } catch (err) {
      res.sendStatus(404)
    }
  } else {
    res.sendStatus(401)
  }
})

app.post('/api/generate-token', async (req, res) => {
  const token = await collections.generate(req.body.quizName, req.body.userName)
  res.send({ token: token })
})

app.post('/api/authenticate-user', async (req, res) => {
  try {
    const user = await collections.authenticateUser(req.body.token)
    req.session.user = { userName: user.username, token: user.token, quiz: user.quiz }
    res.send({ userName: user.username, token: user.token, quiz: user.quiz })
  } catch (err) {
    res.sendStatus(404)
  }
})

app.get('/api/get-tokens', async (req, res) => {
  if (req.session.admin) {
    try {
      const tokens = await collections.fetchTokens()
      res.send(tokens)
    } catch (err) {
      console.log(err)
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(401)
  }
})

app.get('/api/get-scores', async (req, res) => {
  if (req.session.admin) {
    try {
      const scores = await collections.fetchScores()
      res.send(scores)
    } catch (err) {
      console.log(err)
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(401)
  }
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason)
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
