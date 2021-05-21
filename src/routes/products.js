const route = require('express').Router();

const { authToken } = require('../utils/authToken');
const { clean } = require('../utils/clean');

const products = require('../databases/products.json');

const fs = require('fs');

const path = require('path');

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
		"id": products[products.length-1].id + 1 || 0,
		"name": clean(req.body.name) || 'new product',
		"image": clean(req.body.image) || 'no-image',
		"price": clean(req.body.price) || 0,
		"stock": {}
	}

	/*
	
	We spect on stock : [
		{
			name: 'red',
			count: 3
		},
		{
			name: 'white',
			count: 4
		}
	]
	
	*/

	req.body.stock.forEach(type => {
		new_product.stock[clean(type.name)] = type.count;
	})
	
	products.push(new_product);

	fs.writeFileSync(path.resolve(`${process.cwd()}${path.sep}src${path.sep}databases${path.sep}products.json`));
})
exports = module.exports = route;