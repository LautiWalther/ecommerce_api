const route = require('express').Router();

const { authToken } = require('../utils/authToken');

const products = require('../databases/products.json');

route.get('/', authToken, (req, res) => {
	res.json(products);
});

exports = module.exports = route;