'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detalle_pedidos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pedido_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model:  "pedidos",
          key: "id"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "productos",
          key: "id",
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',

      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      precio_unitario: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      subtotal: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      descuento_linea: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable('detalle_pedidos');
  }
};