const models = require('../models'); // Import Sequelize models

// Create a new menu item
async function createMenu(req, res) {
    try {
        const { name, description, price, category } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ message: "Name, price, and category are required" });
        }

        if (isNaN(price)) {
            return res.status(400).json({ message: "Price must be a valid number" });
        }

        const newMenu = await models.Menu.create({ name, description, price, category });

        res.status(201).json({ message: "Menu item created successfully", menu: newMenu });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// Get all menu items
async function getAllMenus(req, res) {
    try {
        const menus = await models.Menu.findAll();

        if (menus.length === 0) {
            return res.status(404).json({
                message: "No menu items found",
            });
        }

        res.status(200).json(menus);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// Get a single menu item by ID
async function getMenuById(req, res) {
    try {
        const { id } = req.params;
        const menu = await models.Menu.findByPk(id);

        if (!menu) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        res.status(200).json(menu);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// Update a menu item by ID
async function updateMenu(req, res) {
    try {
        const { id } = req.params;
        const { name, description, price, category } = req.body;

        if (price && isNaN(price)) {
            return res.status(400).json({ message: "Price must be a valid number" });
        }

        const menu = await models.Menu.findByPk(id);
        if (!menu) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        await menu.update({ name, description, price, category });

        res.status(200).json({ message: "Menu item updated successfully", menu });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// Delete a menu item by ID
async function deleteMenu(req, res) {
    try {
        const { id } = req.params;
        const menu = await models.Menu.findByPk(id);

        if (!menu) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        await menu.destroy();
        res.status(200).json({ message: "Menu item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

module.exports = {
    createMenu,
    getAllMenus,
    getMenuById,
    updateMenu,
    deleteMenu
};