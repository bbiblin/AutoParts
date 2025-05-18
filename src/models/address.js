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
    user_id: DataTypes.INTEGER,
    street: DataTypes.STRING,
    number: DataTypes.STRING,
    complement: DataTypes.STRING,
    city: DataTypes.STRING,
    region: DataTypes.STRING,
    codigo_postal: DataTypes.STRING,
    is_main: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'address',
  },
  {
    tableName: "addresses"
  });
  return address;
};