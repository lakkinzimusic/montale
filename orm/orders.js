/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    let Orders = sequelize.define('orders', {
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
        total_price: {
            type: "DOUBLE",
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        delivery_method_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        payment_method_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        delivery_address: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        delivery_city: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        user_fullname: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        user_phone: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
        },
    }, {
        createdAt: false,
        updatedAt: false,
        getterMethods: {
            getAromats: async function () {
                let models = require('../orm');
                let options = {};
                let id = [];
                let products_id = await models.order_items.findAll({
                    where: {order_id: this.get('id')},
                });

                products_id.map((el) => id.push(el.product_id));

                return await models.products_categories.findAll({
                    where: {product_id: id},
                    include: {model: models.categories}
                })
            },
        }
    }, {
        timestamps: false,
        tableName: 'orders'
    });

    Orders.prototype.initAromats = async function () {
        this.aromats = await this.getAromats;
    };

    Orders.associate = function (models) {
        models.orders.hasMany(models.order_items, {
            foreignKey: 'order_id',
        });
        // models.orders.hasMany(models.payment_methods, {
        //     foreignKey: 'delivery_method_name',
        // });

        models.orders.hasOne(models.payment_methods,{
            foreignKey: 'id',
            sourceKey: 'payment_method_id',
        });

        models.orders.hasOne(models.delivery_methods,{
            foreignKey: 'id',
            sourceKey: 'delivery_method_id',
        });

        models.orders.hasOne(models.order_statuses,{
            foreignKey: 'id',
            sourceKey: 'status',
        });

        models.orders.hasMany(models.order_comments, {
            foreignKey: 'order_id',
        });
    };
    return Orders;
};
