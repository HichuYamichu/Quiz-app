const express = require('express');
const router = express.Router();
const collections = require('../database/collections');

router.post('/new-collection', async (req, res) => {
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

router.get('/fetch-collection-names', async (req, res) => {
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

router.get('/fetch-collection', async (req, res) => {
	try {
		const questions = await collections.fetchCollection(req.query.name);
		res.send(questions);
	} catch (err) {
		res.sendStatus(404);
	}
});

router.post('/update-collection', async (req, res) => {
	if (req.session.admin) {
		try {
			await collections.editCollections(req.body.name, req.body.questions);
			res.sendStatus(200);
		} catch (err) {
			console.log(err);
			res.sendStatus(500);
		}
	} else {
		res.sendStatus(401);
	}
});

router.delete('/delete-collection', async (req, res) => {
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

router.post('/generate-token', async (req, res) => {
	const token = await collections.generate(
		req.body.quizName,
		req.body.userName
	);
	res.send({ token: token });
});

router.get('/get-tokens', async (req, res) => {
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

router.get('/get-scores', async (req, res) => {
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

router.delete('/delete-scores', async (req, res) => {
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

module.exports = router;