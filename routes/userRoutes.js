const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

//Define the end point, which is the post endpoint
router.post('/sign-up', userController.signUp); //url is sign-up

module.exports = router;