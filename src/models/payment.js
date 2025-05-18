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
       this.belongsTo(models.pedidos,{
        foreignKey:"id_pedido",
        as:"pedido"
      });

      this.belongsTo(models.User,{
        foreignKey:"user_id",
        as:"user"
      });
    }
  }
  payment.init({
    id_pedido: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    proveedor_pago: DataTypes.STRING,
    monto: DataTypes.INTEGER,
    estado_pago: DataTypes.ENUM('Aprobado', 'Rechazado', 'En procesamiento'),
    fecha_pago: DataTypes.DATE,
    detalles_pago: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'payment',
  },
  {
    tableName: "payments"
  });
  return payment;
};