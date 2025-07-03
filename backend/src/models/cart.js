'use strict';
const {
  Model
} = require('sequelize');
const detalle_pedido = require('./detalle_pedido');
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user"
      });

      this.hasMany(models.cart_item, {
        foreignKey: "cart_id",
        as: "cart_items"
      });
    }
  }
  cart.init({
    user_id: {
      type: DataTypes.INTEGER,
      field: 'user_id'
    },

  }, {
    sequelize,
    modelName: 'cart',
    tableName: 'carts',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });
  return cart;
};