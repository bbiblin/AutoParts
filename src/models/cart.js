'use strict';
const {
  Model
} = require('sequelize');
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
        foreignKey: "id",
        as: "cart_items"
      });
    }
  }
  cart.init({
    user_id: {
      type: DataTypes.INTEGER,
    },

  }, {
    sequelize,
    modelName: 'cart',
  },
    {
      tableName: "carts"
    });
  return cart;
};