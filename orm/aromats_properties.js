/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  let AromatsProperties = sequelize.define('aromats_properties', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    argument_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tag: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'aromats_properties',
    timestamps: false
  });

  AromatsProperties.associate = function (models) {
     models.aromats_properties.hasMany(models.aromats_properties_values, {
      foreignKey: 'property_id',
      targetKey: 'id'
    })
  };

  return AromatsProperties;
};
