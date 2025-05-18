'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cart_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      cart_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: "cart",
          key: "id",
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: "producto",
          key: "id",
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      precio_unitario: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cart_items');
  }
};