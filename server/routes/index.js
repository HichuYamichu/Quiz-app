const express = require('express');
const router = express.Router();
const collections = require('../database/collections');

router.post('/login', (req, res) => {
	if (req.body.password === (process.env.PASSWORD || 'Qwerty123')) {
		req.session.admin = true;
		res.send({ admin: true });
	} else {
		res.sendStatus(401);
	}
});

router.get('/questions', async (req, res) => {
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

router.post('/send-answers', async (req, res) => {
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

router.get('/fetch-collection', async (req, res) => {
	try {
		const questions = await collections.fetchCollection(req.query.name);
		res.send(questions);
	} catch (err) {
		res.sendStatus(404);
	}
});

router.post('/generate-token', async (req, res) => {
	const token = await collections.generate(
		req.body.quizName,
		req.body.userName
	);
	res.send({ token: token });
});

router.post('/authenticate-user', async (req, res) => {
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

module.exports = router;