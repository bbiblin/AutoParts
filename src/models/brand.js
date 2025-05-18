'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.producto, {
        foreignKey: "id",
        as: "productos"
      });
    }
  }
  brand.init({
    brand_name: DataTypes.STRING,
    brand_code: DataTypes.STRING,
    origin_country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'brand',
  },
  {
    tableName: "brands"
  });
  return brand;
};