const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Menu routes
router.post('/menu', menuController.createMenu); // Create menu item
router.get('/menu', menuController.getAllMenus); // Get all menu items
router.get('/menu/:id', menuController.getMenuById); // Get single menu item by ID
router.put('/menu/:id', menuController.updateMenu); // Update menu item by ID
router.delete('/menu/:id', menuController.deleteMenu); // Delete menu item by ID

module.exports = router;
