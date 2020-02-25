/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    let OrderComments = sequelize.define('order_comments', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        comment: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
        },
        action: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
        },
    }, {
        createdAt: 'created_at',
        updatedAt: false,
        getterMethods: {}
    }, {
        timestamps: false,
        tableName: 'order_comments'
    });


    OrderComments.associate = function (models) {
        // models.orders.hasMany(models.order_items, {
        //     foreignKey: 'order_id',
        // });
        models.order_comments.hasOne(models.users,{
            foreignKey: 'id',
            sourceKey: 'user_id',
        });
    };
    return OrderComments;
};
