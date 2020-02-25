'use strict';
const Sequelize = require('sequelize');
var models = require('../orm');


module.exports = (sequelize, DataTypes) => {
    var ProductCategory = sequelize.define('products_categories', {
        // attributes
        product_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        category_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
    }, {timestamps: false, underscored: true,});

    ProductCategory.associate = function (models) {
        models.products_categories.hasMany(models.products, {
            foreignKey: 'id',
            targetKey: 'product_id'
        });


        models.products_categories.belongsTo(models.categories, {
            foreignKey: 'category_id',
        });

        models.products_categories.belongsTo(models.products, {
            foreignKey: 'product_id',
        });

        models.products_categories.hasOne(models.products, {
            foreignKey: 'id',
            sourceKey: 'product_id',
            as: 'product_connection'
        });

    };

    return ProductCategory;
};

