/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('promo', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    promo_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    discount: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'promo',
      timestamps: false,
  });
};
