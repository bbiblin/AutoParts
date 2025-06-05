'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class category extends Model {
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
  category.init({
    cate_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cat_descr: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  }, {
    sequelize,
    modelName: 'category',
  },
  {
    tableName: "categories"
  });
  
  return category;
};