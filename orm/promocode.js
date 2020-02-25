/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  let Promocode =  sequelize.define('promocode', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    discount: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'promocode',
      timestamps: false,

  });

  Promocode.associate = (models) => {
      // models.products.belongsTo(models.products_categories, {
      //     foreignKey: 'id',
      //     targetKey: 'promocode_id'
      // });
    models.promocode.hasMany(models.promocode_users, {
      foreignKey: 'promocode_id',
    });
  };

  return Promocode;
};
