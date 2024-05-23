const express = require('express');
const app = express();


// app.use('/', (req, res) => { res.send('its woorking') });
app.use('/auth', require('./authRoute'));
app.use('/users', require('./userRoute'));

module.exports = app;