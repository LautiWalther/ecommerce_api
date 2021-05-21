const route = require('express').Router();

const { authToken } = require('../utils/authToken');

const products = require('../databases/products.json');

route.get('/', authToken, (req, res) => {
	res.json(products);
});

route.get('/:product_id', authToken, (req, res) => {
	if(isNaN(+req.params.product_id))return res.json({error:1, message:'product id param must be a number'});
	var product_with_id = products.find(product => product.id === +req.params.product_id) || {};
	res.json(product_with_id);
});

exports = module.exports = route;