require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyparser = require('body-parser');

// Import the router files
const userRoutes = require('./routes/userRoutes'); // Import the user routes
const menuRoutes = require('./routes/menuRoutes'); // Import menu routes
const orderRoutes = require('./routes/orderRoutes'); // Import order routes
const kitchenStaffRoutes = require('./routes/kitchenStaffRoutes'); // Import kitchen staff routes

const app = express();

app.use(bodyparser.json());

app.use("/user", userRoutes);
app.use('/menu', menuRoutes); // Use menu routes with `/menu` prefix
app.use('/order', orderRoutes); // Use the order routes with `/order` prefix
app.use('/kitchen', kitchenStaffRoutes); // Use the kitchen staff routes with `/kitchen` prefix

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;