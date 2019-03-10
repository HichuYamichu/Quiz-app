const express = require('express');
const consola = require('consola');
const fileUpload = require('express-fileupload');
const { Nuxt, Builder } = require('nuxt');
const bodyParser = require('body-parser');
const dbPromise = require('./database/index').connect();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();

app.use(bodyParser.json({limit: '1000kb'}));
app.use(fileUpload());

app.use(
	session({
		store: new MongoStore({ dbPromise: dbPromise }),
		secret: process.env.SECRET || 'HIdi}65saUB.fws8DAL.;fPOq,(3',
		resave: false,
		rolling: true,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60
		}
	})
);

app.use('/api', require('./routes/index.js'));
app.use('/api/admin', require('./routes/admin.js'));

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');

async function start() {
	// Init Nuxt.js
	const nuxt = new Nuxt(config);

	const {
		host = process.env.HOST || '127.0.0.1',
		port = process.env.PORT || 3000
	} = nuxt.options.server;

	// Build only in dev mode
	if (config.dev) {
		const builder = new Builder(nuxt);
		await builder.build();
	}

	// Give nuxt middleware to express
	app.use(nuxt.render);

	// Listen the server
	app.listen(port, host);
	consola.ready({
		message: `Server listening on http://${host}:${port}`,
		badge: true
	});
}
start();
