'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Menu extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  Menu.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Menu',
    tableName: 'menu', // Ensures it matches the database table name
    timestamps: true,  // Enables createdAt & updatedAt
    underscored: false
  });

  return Menu;
};
