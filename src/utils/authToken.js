const hashes = require('./hashes');

const users = require('../databases/users.json');

require('dotenv').config()

module.exports.authToken = (req, res, next) => {
	if(!req.headers)return res.status(401).json({ error: 'Invalid header : authtoken' });

	if(!req.headers.authtoken)return res.status(401).json({ error: 'Invalid header : authtoken' });
	
	var token = req.headers.authtoken;
	token = hashes.unhash(process.env.KEY, token);
	token = token.split('_');
	if(token.length !== 2)return res.status(401).json({ error: 'Invalid header : authtoken' });
	var user = users.find(i => i.id === +token[0] && i.password === token[1]);

	if(!user)return res.status(401).json({ error: 'Invalid header : authtoken' });
	
	else return next();
}