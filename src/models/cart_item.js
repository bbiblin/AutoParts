'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cart_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cart_item.init({
    cart_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    precio_unitario: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'cart_item',
  });
  return cart_item;
};