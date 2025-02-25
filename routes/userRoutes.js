const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

//Define the end point, which is the post endpoint
router.post('/sign-up', userController.signUp); //url is sign-up
router.post('/login', userController.login);

module.exports = router;