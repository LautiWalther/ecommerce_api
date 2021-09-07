const crypto = require('crypto');

var hashes = {}

hashes.hash = (type_key, key) => {
	var cipher = crypto.createCipher('aes256', type_key);

	var encrypted = cipher.update(key, 'utf8', 'hex') + cipher.final('hex');

	return encrypted
}

hashes.unhash = (type_key, key) => {
	var decipher = crypto.createDecipher('aes256', type_key);

	var decrypted = decipher.update(key, 'hex', 'utf8') + decipher.final('utf8');

	return decrypted
}

module.exports = exports = hashes