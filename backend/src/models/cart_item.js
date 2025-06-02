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
      this.belongsTo(models.cart, {
        foreignKey: "cart_id",
        as: "cart"
      });
      this.belongsTo(models.producto, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }
  cart_item.init({
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'cart_id'
    },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id'
    },

    quantity: {  // ← AGREGAR ESTE CAMPO
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },

    precio_unitario: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

  }, {
    sequelize,
    modelName: 'cart_item',
    tableName: 'cart_items'
  });
  return cart_item;
};