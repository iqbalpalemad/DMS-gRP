const express       = require('express');
const authRoute     = require('./Routes/auth')

const app           = express();

app.use(express.json());

app.use('/auth',authRoute);

module.exports      = app;