/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users_role', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    role_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'users_role'
  });
};
