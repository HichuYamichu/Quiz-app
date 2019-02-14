const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser');
const app = express()

app.use(bodyParser.json());

const questions = [
  {
    text: 'Question 1',
    answers: [
      { text: 'Answer A', value: false },
      { text: 'Answer B', value: false },
      { text: 'Answer C', value: false }
    ]
  },
  {
    text: 'Question 2',
    answers: [
      { text: 'Answer A', value: false },
      { text: 'Answer B', value: false },
      { text: 'Answer C', value: false }
    ]
  }
]

app.get('/api/questions', (req, res) => {
	res.send([{name: 'lolol', number: 0, id: 0}, {name: 'lolol', number: 1, id: 1}, {name: 'lolol', number:2, id: 2}])
});

app.post('/api/questions', (req, res) => {
  console.log(req.body)
	res.send(questions[req.body.questionNR])
});

app.post('/api/answers', (req, res) => {
  console.log(req.body)
});

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
