'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pedidos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pedidos.init({
    cod_pedido: DataTypes.STRING,
    address_id: DataTypes.STRING,
    fecha_pedido: DataTypes.DATE,
    state: DataTypes.STRING,
    subtotal: DataTypes.INTEGER,
    shipping_cost: DataTypes.INTEGER,
    metodo_pago: DataTypes.INTEGER,
    origen: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pedidos',
  });
  return pedidos;
};