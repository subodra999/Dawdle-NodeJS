const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.json());

// connect to mongoose
mongoose.connect('mongodb://localhost/dawdle');
const db = mongoose.connection;

require('./routes/routes.js')(app);

app.listen(3000);
console.log('Running on port 3000');
