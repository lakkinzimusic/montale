/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    let Users = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            // defaultValue: '0000-00-00 00:00:00'
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        resetToken: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        resetTokenExpiration: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        firstname: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        surname: {
            type: DataTypes.STRING(255),
            allowNull: true,

        },
        birthday: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        country: {
            type: "SET('РОССИЯ','ФРАНЦИЯ','США')",
            allowNull: true
        },
        sex: {
            type: "SET('MAN','WOMAN')",
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        is_admin: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0
        },
    }, {
        tableName: 'users'
    });
    Users.prototype.getAllOrdersItems = async (req) => {
        await getAllOrdersItems(this)
    };

    Users.associate = function (models) {
        models.users.hasMany(models.promocode_users, {
            foreignKey: 'user_id',
        });
    };
    return Users;
};

async function getAllOrdersItems(user_id) {
    let models = require('../orm');
    let orders = await models.orders.findAll({where: {user_id: user_id}});
    let products = orders.getProducts();
    return products;
}
