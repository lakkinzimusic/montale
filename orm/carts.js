/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    let Carts = sequelize.define('carts', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        created_at: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        updated_at: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        user_id: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        promocode_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        }
    }, {
        tableName: 'carts',
        timestamps: false,
        getterMethods: {
            quantity: function () {
                return 'asd';
            }
        }
    });

    Carts.associate = function (models) {
        models.carts.hasMany(models.cart_items, {foreignKey: 'cart_id'});
    };

    return Carts;

};
