'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      id_pedido: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model:"pedidos",
          key:"id",
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model:"Users",
          key:"id",
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      proveedor_pago: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      estado_pago: {
        type: Sequelize.ENUM('Aprobado', 'Rechazado', 'En procesamiento')
      },

      detalles_pago: {
        type: Sequelize.JSONB
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
    await queryInterface.dropTable('payments');
  }
};