const models = require('../models');

// Fetch all active orders (pending or preparing)
async function getActiveOrders(req, res) {
    try {
        const activeOrders = await models.Order.findAll({
            where: {
                status: ['pending', 'preparing']
            },
            include: [{
                model: models.OrderItem,
                as: 'orderItems', // Use the correct alias
                include: [{
                    model: models.Menu,
                    as: 'menu'
                }]
            }]
        });

        res.status(200).json(activeOrders);
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

// Update the status of an order
async function updateOrderStatus(req, res) {
    const orderId = req.params.id;
    const { status } = req.body;

    try {
        const order = await models.Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Validate status update
        if (!['pending', 'preparing', 'ready', 'delivered'].includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Allowed values: pending, preparing, ready, delivered"
            });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

// Fetch details of a specific order
async function getOrderDetails(req, res) {
    const orderId = req.params.id;

    try {
        const order = await models.Order.findByPk(orderId, {
            include: [{
                model: models.OrderItem,
                as: 'orderItems', // Use the correct alias
                include: [{
                    model: models.Menu,
                    as: 'menu'
                }]
            }]
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

module.exports = {
    getActiveOrders,
    updateOrderStatus,
    getOrderDetails
};