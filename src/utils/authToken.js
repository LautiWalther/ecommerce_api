const hashes = require('./hashes');

module.exports.authToken = (req, res, next) => {
	if(!req.headers)return res.status(401).json({ error: 'Invalid header : authtoken' });

	if(!req.headers.authtoken)return res.status(401).json({ error: 'Invalid header : authtoken' });
	
	var token_crypted = hashes.hash(process.env.KEY, process.env.PRIVATE_TOKEN);
	
	const token = String(req.headers.authtoken);
	
	if(token !== token_crypted)return res.status(401).json({ error: 'Invalid header : authtoken' });
	
	else return next();
}