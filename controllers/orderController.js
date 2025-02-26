const models = require('../models');  // Import models
const { Op } = require('sequelize'); // Sequelize operator for querying

// Create a new order
async function createOrder(req, res) {
    try {
        const { userId, totalPrice, status, type, deliveryAddress, tableNumber, items } = req.body;

        // Validate required fields
        if (!userId || !totalPrice || !status || !type || !items || !Array.isArray(items)) {
            return res.status(400).json({ message: "User ID, total price, status, type, and items are required" });
        }

        if (isNaN(totalPrice)) {
            return res.status(400).json({ message: "Total price must be a valid number" });
        }

        // Create the order first
        const order = await models.Order.create({
            userId,
            totalPrice,
            status,
            type,
            deliveryAddress,
            tableNumber,
        });

        // Create associated order items
        const orderItems = items.map(item => ({
            orderId: order.id,
            menuId: item.menuId,
            quantity: item.quantity,
            price: item.price,
        }));

        await models.OrderItem.bulkCreate(orderItems);  // Bulk insert order items

        res.status(201).json({
            message: 'Order created successfully',
            order,
            items: orderItems,
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

// Get all orders
async function getAllOrders(req, res) {
    try {
        const orders = await models.Order.findAll({
            include: [{ model: models.OrderItem, include: [{ model: models.Menu }] }],
        });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

// Get a specific order by ID
async function getOrderById(req, res) {
    try {
        const { id } = req.params;
        const order = await models.Order.findByPk(id, {
            include: [{ model: models.OrderItem, include: [{ model: models.Menu }] }],
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

// Update an order by ID
async function updateOrder(req, res) {
    try {
        const { id } = req.params;
        const { status, totalPrice, deliveryAddress, tableNumber, items } = req.body;

        const order = await models.Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update order fields
        await order.update({ status, totalPrice, deliveryAddress, tableNumber });

        // Update order items if they exist
        if (items && items.length > 0) {
            await models.OrderItem.destroy({ where: { orderId: id } });  // Delete existing items

            const orderItems = items.map(item => ({
                orderId: order.id,
                menuId: item.menuId,
                quantity: item.quantity,
                price: item.price,
            }));

            await models.OrderItem.bulkCreate(orderItems);  // Insert new items
        }

        res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

// Delete an order and associated items
async function deleteOrder(req, res) {
    try {
        const { id } = req.params;
        const order = await models.Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Delete associated order items
        await models.OrderItem.destroy({ where: { orderId: id } });

        // Delete the order
        await order.destroy();

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

// Add order items to an existing order
async function createOrderItems(req, res) {
    try {
        const { orderId } = req.params;
        const { items } = req.body;

        // Validate items
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: "Items are required and must be an array" });
        }

        // Find the order by its ID
        const order = await models.Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Create the order items
        const orderItems = items.map(item => ({
            orderId: order.id,
            menuId: item.menuId,
            quantity: item.quantity,
            price: item.price,
        }));

        await models.OrderItem.bulkCreate(orderItems);

        res.status(201).json({
            message: 'Order items added successfully',
            orderItems
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    createOrderItems
};