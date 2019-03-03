module.exports = (app) => {
	const fs = require('fs');
	const collections = require('./database/collections');

	app.post('/api/login', (req, res) => {
		if (req.body.password === (process.env.PASSWORD || 'Qwerty123')) {
			req.session.admin = true;
			res.send({ admin: true });
		} else {
			res.sendStatus(401);
		}
	});

	app.get('/api/questions', async (req, res) => {
		if (req.query.name) {
			try {
				const questions = await collections.fetchCollection(req.query.name);
				questions.forEach(question => {
					delete question._id;
					question.answers.forEach(answer => {
						answer.value = false;
					});
				});
				res.send(questions);
			} catch (err) {
				res.sendStatus(404);
			}
		} else {
			res.sendStatus(404);
		}
	});

	app.post('/api/send-answers', async (req, res) => {
		try {
			await collections.deleteUser(req.session.user);
			req.session.destroy();
			const results = await collections.checkAnsweres(
				req.body.answers,
				req.body.user
			);
			res.send({ score: results.score, length: results.length });
		} catch (err) {
			console.log(err);
			res.sendStatus(500);
		}
	});

	app.post('/api/new-collection', async (req, res) => {
		if (req.session.admin) {
			try {
				await collections.createCollection(req.body.name, req.body.questions);
				res.sendStatus(200);
			} catch (err) {
				console.log(err);
				res.sendStatus(500);
			}
		} else {
			res.sendStatus(401);
		}
	});

	app.get('/api/fetch-collection', async (req, res) => {
		try {
			const questions = await collections.fetchCollection(req.query.name);
			res.send(questions);
		} catch (err) {
			res.sendStatus(404);
		}
	});

	app.get('/api/fetch-collection-names', async (req, res) => {
		if (req.session.admin) {
			try {
				const collNames = await collections.fetchCollections();
				res.send(collNames);
			} catch (err) {
				console.log(err);
				res.sendStatus(500);
			}
		} else {
			res.sendStatus(401);
		}
	});

	app.post('/api/update-collection', async (req, res) => {
		if (req.session.admin) {
			try {
				const questions = JSON.parse(req.body.questions);
				if (req.files) {
					Object.keys(req.files).forEach(file => {
						fs.writeFile(`./static/images/${req.files[file].name}`, req.files[file].data, err => {
							if (err) throw err;
						})
					})
				}
				await collections.editCollections(req.body.name, questions);
				res.sendStatus(200);
			} catch (err) {
				console.log(err);
				res.sendStatus(500);
			}
		} else {
			res.sendStatus(401);
		}
	});

	app.delete('/api/delete-collection', async (req, res) => {
		if (req.session.admin) {
			try {
				await collections.deleteCollection(req.body.name);
				res.sendStatus(200);
			} catch (err) {
				res.send('Collection not found!');
			}
		} else {
			res.sendStatus(401);
		}
	});

	app.post('/api/generate-token', async (req, res) => {
		const token = await collections.generate(
			req.body.quizName,
			req.body.userName
		);
		res.send({ token: token });
	});

	app.post('/api/authenticate-user', async (req, res) => {
		try {
			const user = await collections.authenticateUser(req.body.token);
			req.session.user = {
				userName: user.username,
				token: user.token,
				quiz: user.quiz
			};
			res.send({ userName: user.username, token: user.token, quiz: user.quiz });
		} catch (err) {
			res.sendStatus(404);
		}
	});

	app.get('/api/get-tokens', async (req, res) => {
		if (req.session.admin) {
			try {
				const tokens = await collections.fetchTokens();
				res.send(tokens);
			} catch (err) {
				console.log(err);
				res.sendStatus(500);
			}
		} else {
			res.sendStatus(401);
		}
	});

	app.get('/api/get-scores', async (req, res) => {
		if (req.session.admin) {
			try {
				const scores = await collections.fetchScores();
				res.send(scores);
			} catch (err) {
				console.log(err);
				res.sendStatus(500);
			}
		} else {
			res.sendStatus(401);
		}
	});

	app.delete('/api/delete-scores', async (req, res) => {
		if (req.session.admin) {
			try {
				await collections.deleteScores(req.body);
				res.sendStatus(200);
			} catch (err) {
				console.log(err);
				res.sendStatus(500);
			}
		} else {
			res.sendStatus(401);
		}
	});
};