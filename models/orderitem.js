'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class OrderItem extends Model {
    static associate(models) {
      // Define associations
      OrderItem.belongsTo(models.Order, { foreignKey: 'orderId', onDelete: 'CASCADE' });
      OrderItem.belongsTo(models.Menu, { foreignKey: 'menuId', onDelete: 'CASCADE' });
    }
  }

  OrderItem.init({
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    menuId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items', // Ensure it matches the database table name
    timestamps: true,  // Enables createdAt & updatedAt
    underscored: false // Use camelCase for Sequelize
  });

  return OrderItem;
};