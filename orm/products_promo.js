/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('products_promo', {
    product_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    promo_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'products_promo',
      timestamps: false,
  });
};
