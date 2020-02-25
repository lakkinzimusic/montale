/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  let Subscribers =  sequelize.define('subscribers', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

  }, {
    tableName: 'subscribers',
      timestamps: false,

  });



  return Subscribers;
};
