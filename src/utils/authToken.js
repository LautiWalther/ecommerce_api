module.exports.authToken = (req, res, next) => {
	if(!req.headers)return res.redirect('/');
	if(!req.headers.authtoken)return res.redirect('/');
	const token = String(req.headers.authtoken);
	if(token !== process.env.PRIVATE_TOKEN)return res.redirect('/');
	else return next();
}