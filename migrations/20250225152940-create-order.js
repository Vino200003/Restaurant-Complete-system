'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Assuming the users table is already created
          key: 'id'
        },
        onDelete: 'CASCADE' // Ensures related orders are deleted if user is deleted
      },
      totalPrice: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'preparing', 'ready', 'delivered'),
        allowNull: false,
        defaultValue: 'pending'
      },
      type: {
        type: Sequelize.ENUM('dine-in', 'takeaway', 'delivery'),
        allowNull: false
      },
      deliveryAddress: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      tableNumber: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};