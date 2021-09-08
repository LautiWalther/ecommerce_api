const route = require('express').Router();

const { authToken } = require('../utils/authToken');
const { clean } = require('../utils/clean');

const products = require('../databases/products.json');
const requests = require('../databases/requests.json');

const fs = require('fs');

const path = require('path');

route.get('/', authToken, (req, res) => {
	res.json(requests);
});

route.post('/', authToken, (req, res) => {
	if(isNaN(+req.body.request_id))return res.json({error:1, message:'request_id must be a number'});
	var request_with_id = requests.find(request => request.id === +req.body.request_id) || {};
	res.json(request_with_id);
});

route.put('/', authToken, (req, res) => {
	if(!req.body.email || !req.body.name || !req.body.lastname || !req.body.email || !req.body.phone || !req.body.products || !req.body.payment) return res.json({error:'Missing Data.'});
	/*
		req.body.products.forEach(i => {
			map = products.filter(j => j.id === i.id);
			if(!map) return res.json({error:'There is no stock of ' + i.id})
		})
	*/
	var new_request = {
		"email": clean(req.body.email),
		"name": clean(req.body.name),
		"lastname": clean(req.body.lastname),
		"phone": clean(req.body.phone),
		"products": clean(req.body.products),
		"payment_method": clean(req.body.payment_method),
		"payed": false,
		"delivered": false
	}
	new_request.id = requests[requests.length-1] ? requests[requests.length-1].id + 1 : 0

	/*
	
	We spect on products : [
		{
			"id": 0,
			"count": 2
		},
		{
			"id": 1,
			"count": 1
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
	if(!to_del) return res.json({error:1, message:'id doesnt exists.'});
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