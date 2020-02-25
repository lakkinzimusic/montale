/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('contact_messages', {
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
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },

    }, {
        timestamps: false,
        tableName: 'contact_messages'
    });
};
