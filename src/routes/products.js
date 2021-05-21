const route = require('express').Router();

const { authToken } = require('../utils/authToken');
const { clean } = require('../utils/clean');

const products = require('../databases/products.json');

route.get('/', authToken, (req, res) => {
	res.json(products);
});

route.post('/', authToken, (req, res) => {
	if(isNaN(+req.body.product_id))return res.json({error:1, message:'product_id must be a number'});
	var product_with_id = products.find(product => product.id === +req.body.product_id) || {};
	res.json(product_with_id);
});

route.post('/create', authToken, (req, res) => {
	var new_product = {
	}
})
exports = module.exports = route;