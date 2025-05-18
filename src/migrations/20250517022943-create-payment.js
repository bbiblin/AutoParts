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
      },
      transaccion_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      proveedor_pago: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      monto: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      estado_pago: {
        type: Sequelize.ENUM('Aprobado', 'Rechazado', 'En procesamiento')
      },
      fecha_pago: {
        type: Sequelize.DATE
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