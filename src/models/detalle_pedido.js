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
       this.belongsTo(models.pedidos,{
        foreignKey:"pedido_id",
        as:"pedido"
      });
       this.belongsTo(models.producto,{
        foreignKey:"product_id",
        as:"product"
      });
    }
  }
  detalle_pedido.init({
    pedido_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER,
    precio_unitario: DataTypes.INTEGER,
    subtotal: DataTypes.INTEGER,
    descuento_linea: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'detalle_pedido',
  },
  {
    tableName: "detalles_pedido"
  });
  return detalle_pedido;
};