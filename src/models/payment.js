'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.pedidos, {
        foreignKey: "id_pedido",
        as: "pedido"
      });

      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user"
      });
    }
  }
  payment.init({
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    proveedor_pago: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    monto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    estado_pago: {
      type: DataTypes.ENUM('Aprobado', 'Rechazado', 'En procesamiento'),
      allowNull: false,
    },

    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    detalles_pago: {
      type: DataTypes.JSONB,
      allowNull: false,
    },

  }, {
    sequelize,
    modelName: 'payment',
  },
    {
      tableName: "payments"
    });
  return payment;
};