'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detalle_pedido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.pedidos, {
        foreignKey: "pedido_id",
        as: "pedido"
      });
      this.belongsTo(models.producto, {
        foreignKey: "product_id",
        as: "product"
      });
    }
  }
  detalle_pedido.init({
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    precio_unitario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    subtotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    descuento_linea: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

  }, {
    sequelize,
    modelName: 'detalle_pedido',
  },
    {
      tableName: "detalles_pedido"
    });
  return detalle_pedido;
};