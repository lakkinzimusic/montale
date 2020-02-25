/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    let OrderStatuses = sequelize.define('order_statuses', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        status_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        status_label: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        color: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

    }, {
        timestamps: false,
        tableName: 'order_statuses'
    });

    return OrderStatuses
};
