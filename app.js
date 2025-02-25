const express = require('express');
const bodyparser = require('body-parser');

// Import the router files
const userRoutes = require('./routes/userRoutes');//import thr user routes
const menuRoutes = require('./routes/menuRoutes'); // Import menu routes

const app = express();

app.use(bodyparser.json());

app.use("/user", userRoutes);
app.use('/menu', menuRoutes); // Use menu routes with `/menu` prefix

module.exports = app;