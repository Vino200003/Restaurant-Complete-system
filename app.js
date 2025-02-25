const express = require('express');
const bodyparser = require('body-parser');

//import the router files
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(bodyparser.json());

app.use("/user", userRoutes);

module.exports = app;