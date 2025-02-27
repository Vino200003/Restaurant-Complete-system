const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();


router.post('/sign-up', userController.signUp);
router.post('/login', userController.login);

router.get('/users', userController.getAllUsers);
router.get('/users/role/:role', userController.getUsersByRole); // More specific route comes first
router.get('/users/:id', userController.getUserById); // Generic parameter route comes after
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser );

module.exports = router;