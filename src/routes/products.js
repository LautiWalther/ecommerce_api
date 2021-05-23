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

route.put('/', authToken, (req, res) => {
	var new_product = {
		"name": clean(req.body.name) || 'new product',
		"image": clean(req.body.image) || 'no-image',
		"price": clean(req.body.price) || 0,
		"stock": []
	}
	new_product.id = products[products.length-1] ? products[products.length-1].id + 1 : 0

	/*
	
	We spect on stock : [
		{
			"name": "red",
			"count": 3
		},
		{
			"name": "white",
			"count": 4
		}
	]
	
	*/
	if(req.body.stock){
		req.body.stock.forEach(type => {
			type = JSON.parse(type);
			new_product.stock.push(type);
		});
	}
	
	products.push(new_product);
	fs.writeFileSync(path.resolve(`${process.cwd()}${path.sep}src${path.sep}databases${path.sep}products.json`), JSON.stringify(products, null, "\t"));

	res.json(new_product);
});

route.delete('/', authToken, (req, res) => {
	if(isNaN(req.body.id)) return res.json({error:1, message:'id must be an integer.'});
	var to_del = products.find(product => product.id === +req.body.id);
	products.splice(products.indexOf(to_del), 1);
	to_del.deleted = true;
	
	fs.writeFileSync(path.resolve(`${process.cwd()}${path.sep}src${path.sep}databases${path.sep}products.json`), JSON.stringify(products, null, "\t"));
	return res.json(to_del);
});

route.patch('/', authToken, (req, res) => {
	if(isNaN(req.body.id)) return res.json({error:1, message:'id must be an integer.'});
	var to_edit = products.find(product => product.id === +req.body.id);
	if(!to_edit) return res.json({error:1, message:"couldn't find item with id " + req.body.id});
	var to_edit_index = products.indexOf(to_edit);

	var edited = {
		"name": req.body.name || to_edit.name,
		"image": req.body.image || to_edit.image,
		"price": req.body.price || to_edit.price,
		"id": to_edit.id
	};
	if(req.body.stock){
		edited.stock = [];

		req.body.stock.forEach(item => {
			edited.stock.push(JSON.parse(item));
		});
	}

	products[to_edit_index] = edited;

	fs.writeFileSync(path.resolve(`${process.cwd()}${path.sep}src${path.sep}databases${path.sep}products.json`), JSON.stringify(products, null, "\t"));
	return res.json(products[to_edit_index]);
});

exports = module.exports = route;