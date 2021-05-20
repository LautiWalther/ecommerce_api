const express = require('express');
const app = express();

const { authToken } = require('./src/utils/authToken');

require('dotenv').config();

app.get('/', (req, res) => {
	res.end('Hmmm, what are you searching for!?')
});

app.use('/products', require('./src/routes/products'));

app.listen(process.env.PORT, () => console.log('API Listening on port ' + process.env.PORT));