'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class address extends Model {
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
    }
  }
  address.init({

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    complement: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    region: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    codigo_postal: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    is_main: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

  }, {
    sequelize,
    modelName: 'address',
  },
    {
      tableName: "addresses"
    });
  return address;
};