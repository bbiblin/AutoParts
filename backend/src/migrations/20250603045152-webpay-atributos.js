'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('pedidos', 'webpay_token', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Token de transacción WebPay'
    });

    await queryInterface.addColumn('pedidos', 'webpay_session_id', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Session ID de WebPay'
    });

    await queryInterface.addColumn('pedidos', 'webpay_status', {
      type: Sequelize.ENUM('PENDING', 'AUTHORIZED', 'FAILED', 'NULLIFIED'),
      allowNull: true,
      defaultValue: 'PENDING',
      comment: 'Estado de la transacción WebPay'
    });

    await queryInterface.addColumn('pedidos', 'webpay_amount', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Monto enviado a WebPay'
    });

    await queryInterface.addColumn('pedidos', 'webpay_buy_order', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Orden de compra WebPay'
    });

    await queryInterface.addColumn('pedidos', 'webpay_authorization_code', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Código de autorización WebPay'
    });

    await queryInterface.addColumn('pedidos', 'webpay_response_code', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Código de respuesta WebPay'
    });

    await queryInterface.addColumn('pedidos', 'webpay_transaction_date', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Fecha de transacción WebPay'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('pedidos', 'webpay_token');
    await queryInterface.removeColumn('pedidos', 'webpay_session_id');
    await queryInterface.removeColumn('pedidos', 'webpay_status');
    await queryInterface.removeColumn('pedidos', 'webpay_amount');
    await queryInterface.removeColumn('pedidos', 'webpay_buy_order');
    await queryInterface.removeColumn('pedidos', 'webpay_authorization_code');
    await queryInterface.removeColumn('pedidos', 'webpay_response_code');
    await queryInterface.removeColumn('pedidos', 'webpay_transaction_date');
  }
};
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
