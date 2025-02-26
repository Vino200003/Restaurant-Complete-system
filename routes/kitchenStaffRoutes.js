const express = require('express');
const router = express.Router();
const kitchenStaffController = require('../controllers/kitchenStaffController');
const { checkAuth } = require('../middleware/check-auth');
const { checkRole } = require('../middleware/check-role');

// Fetch all active orders (only accessible by kitchen staff)
router.get('/orders', checkAuth, checkRole('kitchen_staff'), kitchenStaffController.getActiveOrders);

// Update order status
router.put('/orders/:id/status', checkAuth, checkRole('kitchen_staff'), kitchenStaffController.updateOrderStatus);

// Fetch order details
router.get('/orders/:id', checkAuth, checkRole('kitchen_staff'), kitchenStaffController.getOrderDetails);

module.exports = router;