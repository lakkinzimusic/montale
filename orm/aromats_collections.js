/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  let AromatsCollections = sequelize.define('aromats_collections', {
    aromat_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    collection_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'aromats_collections',
    timestamps: false,
  });

  AromatsCollections.associate = function(models) {
    models.aromats_collections.hasMany(models.categories,{
      foreignKey: 'id',
      targetKey: 'aromat_id'
    });

    models.aromats_collections.hasOne(models.collections,{
      foreignKey: 'id',
      targetKey: 'collection_id'
    });
  };

  return AromatsCollections;
};
