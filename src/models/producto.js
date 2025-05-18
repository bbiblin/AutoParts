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
       this.belongsTo(models.category,{
        foreignKey:"category_id",
        as:"category"
      });
       this.belongsTo(models.brand,{
        foreignKey:"brand_id",
        as:"brand"
      });

      this.hasMany(models.detalle_pedido, {
        foreignKey: "id",
        as: "detalles_pedido"
      });
    }
  }
  producto.init({
    product_cod: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    minorist_price:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    mayorist_price:{
      type: DataTypes.INTEGER,
      allowNull: false,
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
  },
  {
    tableName: "productos"
  });
  return producto;
};