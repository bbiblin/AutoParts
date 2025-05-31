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
      this.belongsTo(models.category, {
        foreignKey: "category_id",
        as: "category"
      });
      this.belongsTo(models.brand, {
        foreignKey: "brand_id",
        as: "brand"
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

    retail_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    wholesale_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },


    isActive: {
      type: DataTypes.BOOLEAN,
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
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'category_id'
    },

    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'brand_id'
    },

    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    discount_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 100
      }
    },


    state: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }

  }, {
    sequelize,
    modelName: 'producto',
    tableName: "productos"
  });
  return producto;
};