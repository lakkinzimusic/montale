/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  let AromatsMayLike = sequelize.define('aromats_may_like', {
    aromat_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    may_like_aromat: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'aromats_may_like',
    timestamps: false
  });

  AromatsMayLike.associate = function(models) {
    models.aromats_may_like.hasOne(models.categories,{
      foreignKey: 'id',
      sourceKey: 'may_like_aromat',
    });
  };

  return AromatsMayLike;
};
