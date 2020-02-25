/* jshint indent: 2 */
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = function (sequelize, DataTypes) {
    let OrderItems =  sequelize.define('order_items', {
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
            product_id: {
                type: DataTypes.INTEGER(11),
                allowNull: false
            },
            quantity: {
                type: DataTypes.INTEGER(11),
                allowNull: false
            },
            price_const: {
                type: DataTypes.INTEGER(11),
                allowNull: false
            },
            params: {
                type: DataTypes.JSON
            }
        },

        {
            timestamps: false,
            tableName: 'order_items',
            hooks: {
                async afterFind(item, options) {
                    if (item) {
                        if (item.constructor === Array) {
                            for (var i = 0; i < item.length; i++) {
                                await applyKit(item[i])
                            }
                        } else {
                            await applyKit(item)
                        }
                    }
                },
            }
        }
    );

    OrderItems.prototype.applyKit = async function () {
        await applyKit(this);
    };

    OrderItems.associate = function(models) {
        models.order_items.belongsTo(models.products,{
            foreignKey: 'product_id',
        });
        models.order_items.belongsTo(models.orders,{
            foreignKey: 'order_id',
        });
    };

    return OrderItems
};

async function applyKit(item) {
    if (item.params && item.params.items) {
        let models = require('../orm');
        let kit = await models.categories.findAll({where: {id: {[Op.in]: item.params.items}}});
        let products = [];
        item.params.items.forEach(function (id, index) {
            products[index] = kit.find(x => x.id == id);
        });
        item.kit = products;
    }
}
