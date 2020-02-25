/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  let AromatsPropertiesValues = sequelize.define('aromats_properties_values', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    value_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'aromats_properties_values',
    timestamps: false
  });

  /*AromatsPropertiesValues.associate = function (models) {
    models.aromats_properties_values.hasOne(models.aromats_properties, {
      foreignKey: 'id',
      targetKey: 'property_id'
    })
  };*/

  return AromatsPropertiesValues;
};
