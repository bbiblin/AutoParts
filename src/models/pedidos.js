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
       this.belongsTo(models.User,{
        foreignKey:"user_id",
        as:"user"
      });

      this.hasMany(models.detalle_pedido, {
        foreignKey: "id",
        as: "detalles_pedido"
      });
    }
  }
  pedidos.init({
    cod_pedido: DataTypes.STRING,
    user_id: DataTypes.STRING,
    state: DataTypes.STRING,
    subtotal: DataTypes.INTEGER,
    shipping_cost: DataTypes.INTEGER,
    metodo_pago: DataTypes.INTEGER,
    origen: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pedidos',
  },
  {
    tableName: "pedidos"
  });
  return pedidos;
};