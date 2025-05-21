'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pedidos extends Model {
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

      this.hasMany(models.detalle_pedido, {
        foreignKey: "id",
        as: "detalles_pedido"
      });
    }
  }
  pedidos.init({
    cod_pedido: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    subtotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    shipping_cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    metodo_pago: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    origen: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  }, {
    sequelize,
    modelName: 'pedidos',
  },
    {
      tableName: "pedidos"
    });
  return pedidos;
};