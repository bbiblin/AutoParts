'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class pedidos extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user"
      });

      this.hasMany(models.detalle_pedido, {
        foreignKey: "pedido_id",
        as: "detalles_pedido"
      });
    }
  }

  pedidos.init({
    cod_pedido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shipping_cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    metodo_pago: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    origen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Nuevos campos para WebPay
    webpay_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    webpay_session_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    webpay_status: {
      type: DataTypes.ENUM('PENDING', 'AUTHORIZED', 'FAILED', 'NULLIFIED'),
      allowNull: true,
      defaultValue: 'PENDING',
    },
    webpay_amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    webpay_buy_order: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    webpay_authorization_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    webpay_response_code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    webpay_transaction_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'pedidos',
    tableName: "pedidos"
  });

  return pedidos;
};