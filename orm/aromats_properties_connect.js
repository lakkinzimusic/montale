/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  let AromatPropertiesConnect = sequelize.define('aromats_properties_connect', {
    aromat_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    value_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'aromats_properties_connect',
    timestamps: false,
      getterMethods: {
          categories: function(){
              // console.log('i"m here');
              // console.log(this);
              let models  = require('../orm');
              let options = {};
              options.include = [
                  {
                      model: models.aromats_properties_connect,
                      attributes: [],
                      where: {
                          aromat_id : this.get('aromat_id')
                      }
                  }
              ];
              return models.categories.findAll(options);
          }
      }
  });

  AromatPropertiesConnect.associate = function(models) {
    models.aromats_properties_connect.hasOne(models.categories, {foreignKey:'id', sourceKey: 'aromat_id'});
    models.aromats_properties_connect.hasOne(models.aromats_properties, {foreignKey:'id', sourceKey: 'property_id'});
    models.aromats_properties_connect.hasOne(models.aromats_properties_values, {foreignKey:'id', sourceKey: 'value_id'});
  };

  return AromatPropertiesConnect;
};
