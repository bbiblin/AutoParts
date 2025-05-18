'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class producto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  producto.init({
    product_cod: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    brand_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    state: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },

    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    }

  }, {
    sequelize,
    modelName: 'producto',
  });
  return producto;
};