/* jshint indent: 2 */
const models = require('../orm');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = function (sequelize, DataTypes) {
    let CartItems = sequelize.define('cart_items', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        cart_id: {
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
        price: {
            type: DataTypes.INTEGER(11)
        },
        params: {
            type: DataTypes.JSON
        }
    }, {
        tableName: 'cart_items',
        timestamps: false,
        hooks: {
            /*async afterFind(category, options) {
              if(category.constructor === Array) {
                var len = category.length;
                for (var i = 0; i < len; i++) {
                  category[i].image = await category[i].getImage;
                }
              } else {
                category.image = await category.getImage;
              }
            }*/
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
            async afterCreate(item) {
                if (item.constructor === Array) {
                    for (var i = 0; i < item.length; i++) {
                        await applyKit(item[i])
                    }
                } else {
                    await applyKit(item)
                }
            }
        }
    });

    CartItems.prototype.applyKit = async function () {
        await applyKit(this);
    };

    CartItems.associate = function (models) {
        models.cart_items.belongsTo(models.carts, {foreignKey: 'id', targetKey: 'id', underscored: true});
        models.cart_items.hasOne(models.products, {foreignKey: 'id', sourceKey: 'product_id'})
    };

    return CartItems;

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
