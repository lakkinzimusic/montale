/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('products_kit', {
    kit_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'products_kit'
  });
};
