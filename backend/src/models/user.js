'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.address, {
        foreignKey: "address",
        as: "addressDetail"
      });

      this.hasOne(models.cart, {
        foreignKey: "userId",
        as: "cart"
      });

      this.hasMany(models.payment, {
        foreignKey: "userId",
        as: "payments"
      });

      this.hasMany(models.pedidos, {
        foreignKey: "userId",
        as: "pedidos"
      });
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    admin: {
      type: DataTypes.BOOLEAN
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    isDistribuitor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
    {
      sequelize,
      modelName: 'User',
    },
    {
      tableName: "users"
    });
  return User;
};