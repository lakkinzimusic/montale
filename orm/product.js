'use strict';
const Sequelize = require('sequelize');
var models = require('../orm');
var slugify = require('slugify');

module.exports = (sequelize, DataTypes) => {
    var Product = sequelize.define('products', {
        // attributes
        product_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        price: {
            type: Sequelize.FLOAT,
        },
        description: {
            type: Sequelize.STRING,
        },
        imageURL: {
            type: Sequelize.STRING,
        },
        type: {
            type: Sequelize.STRING,
        },
        in_stock: {
            type: Sequelize.INTEGER
        },
        additional_property: {
            type: Sequelize.STRING,
        },
        slug: {
            type: Sequelize.STRING
        },
        meta_data: {
            type: Sequelize.JSON
        }
    }, {
        timestamps: false,
        getterMethods: {
            isFavorite: function () {
                return false;
            },
        },
        hooks: {
            beforeCreate(instance, options) {
                instance.slug = slugify(instance.product_name, {lower: true});
                instance.meta_data = {};
            },

        }
    });


    Product.associate = function (models) {
        models.products.belongsTo(models.products_categories, {
            foreignKey: 'id',
            targetKey: 'product_id'
        });

        models.products.belongsTo(models.cart_items, {
            foreignKey: 'id',
            targetKey: 'product_id'
        });

        models.products.hasMany(models.products_categories, {
            foreignKey: 'product_id',
        });

        models.products.hasMany(models.order_items, {
            foreignKey: 'product_id',
        });
    };

    return Product;
};

