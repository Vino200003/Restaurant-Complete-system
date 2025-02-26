'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Order extends Model {
    static associate(models) {
      // Define association with User
      Order.belongsTo(models.User, { foreignKey: 'userId' });

      // Define association with OrderItem
      Order.hasMany(models.OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
    }
  }

  Order.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'preparing', 'ready', 'delivered'),
      allowNull: false,
      defaultValue: 'pending'
    },
    type: {
      type: DataTypes.ENUM('dine-in', 'takeaway', 'delivery'),
      allowNull: false
    },
    deliveryAddress: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tableNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders', // Ensure it matches the database table name
    timestamps: true,  // Enables createdAt & updatedAt
    underscored: false // Use camelCase
  });

  return Order;
};