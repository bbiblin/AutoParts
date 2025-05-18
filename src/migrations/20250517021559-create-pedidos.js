'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pedidos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER

      },
      cod_pedido: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      fecha_pedido: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      subtotal: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      precio_total: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      shipping_cost: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      metodo_pago: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      origen: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      is_pickup: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('pedidos');
  }
};