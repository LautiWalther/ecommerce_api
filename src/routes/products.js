const route = require('express').Router();

const { authToken } = require('../utils/authToken');

route.post('/', authToken, (req, res) => {
	res.end("Wow, you're here!");
})

exports = module.exports = route;