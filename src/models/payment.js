'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  payment.init({
    id_pedido: DataTypes.INTEGER,
    transaccion_id: DataTypes.STRING,
    proveedor_pago: DataTypes.STRING,
    monto: DataTypes.INTEGER,
    estado_pago: DataTypes.ENUM('Aprobado', 'Rechazado', 'En procesamiento'),
    fecha_pago: DataTypes.DATE,
    detalles_pago: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'payment',
  });
  return payment;
};