'use strict';
const Sequelize = require('sequelize');
var slugify = require('slugify');
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {
    var Category = sequelize.define('categories', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        category_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        category_type: {
            type: Sequelize.FLOAT,
        },
        description: {
            type: Sequelize.STRING,
        },
        image_url: {
            type: Sequelize.STRING,
        },
        slug: {
            type: Sequelize.STRING,
        },

    }, {
        timestamps: false,
        getterMethods: {
            getProducts: async function () {
                let models = require('../orm');
                let options = {};
                options.include = [
                    {
                        model: models.products_categories,
                        attributes: [],
                        where: {
                            category_id: this.get('id')
                        }
                    }
                ];
                let products = await models.products.findAll(options);


                //ПРИСВОЕНИЕ АКЦИОННОЙ ЦЕНЫ
                let products_promo = await models.products_promo.findAll();
                products.map(product => {
                    product.promoPrice = null;
                    products_promo.map(async prod_prom => {
                        if (prod_prom.product_id === product.id) { //если находим совпадения у нашего товара и акцонного
                            let promo = await models.promo.findOne({ //ищем акцию
                                where: {id: prod_prom.promo_id}
                            });
                            product.promoPrice = product.price - (product.price / 100 * promo.discount); //считаем промо-цену
                        }
                    })
                });
                //ПРИСВОЕНИЕ АКЦИОННОЙ ЦЕНЫ


                return products
            },
            getImage: async function () {
                let products = await this.getProducts;
                if (products[0]) {
                    return products[0].imageURL;
                }
                return null;
            },
            getProps: async function () {
                let models = require('../orm');
                let connections = await models.aromats_properties_connect.findAll({
                    where: {aromat_id: this.id}, include:
                        [
                            {model: models.aromats_properties},
                            {model: models.aromats_properties_values}
                        ]
                });
                return connections;
            },

            may_like: async function () {
                let models = require('../orm');
                let maylike = await models.aromats_may_like.findAll({
                    limit: 3,
                    where: {aromat_id: this.id},
                    context: {some: 'some'}
                });
                let ids = maylike.map(a => a.may_like_aromat);
                let categories = await models.categories.findAll({
                    where: {id: {[Op.in]: ids}},
                    context: {some: 'some'}
                },);
                return categories;
            },
            same_collection: async function () {
                let models = require('../orm');
                let collection = await models.aromats_collections.findOne({
                    where: {aromat_id: this.id},
                    context: {some: 'some'}
                });
                if (!collection) return [];
                let productsInCollection = await models.aromats_collections.findAll({
                    limit: 3,
                    where: {collection_id: collection.collection_id},
                    context: {some: 'some'}
                });
                let ids = productsInCollection.map(a => a.aromat_id);
                let index = ids.indexOf(this.id);
                if (index > -1) {
                    ids.splice(index, 1); // удаляем из выборки текущую категорию
                }

                let categories = await models.categories.findAll({
                    where: {id: {[Op.in]: ids}},
                    context: {some: 'some'}
                });
                return categories;
            },
        },

        /*instanceMethods: {
            initProducts: async function() {
                this.products = await this.getProducts;
            }
        },*/
        hooks: {

            async afterFind(category, options) {
                if (!options.context) return false;
                if(!category) return false;
                let favourites = options.context.favourites_products;
                if (category.constructor === Array) {
                    var len = category.length;

                    for (var i = 0; i < len; i++) {
                        category[i].image = await category[i].getImage;
                        if (favourites) {    //проверяем, является ли товар любимым (если пользователь залогинен)
                            favourites.forEach((aromat) => {
                                aromat.category.id === category[i].id ? category[i].isFavourite = true : false;
                            })
                        }
                    }
                } else {
                    category.image = await category.getImage;
                    if (favourites) {
                        favourites.forEach((aromat) => {
                            aromat.category.id === category.id ? category.isFavourite = true : false;
                        });
                    }
                }

            },
            beforeSave(instance, options) {
                instance.slug = slugify(instance.category_name, {lower: true});
            }
        }
    });

    Category.prototype.initProducts = async function () {
        this.products = await this.getProducts;
    };

    Category.prototype.initProps = async function () {
        this.props = await this.getProps;
        if (this.props.length > 0) {
            let needed = null;
            this.props.forEach(function (el) {
                if (el.aromats_property.tag === 'sex') needed = el;
            });
            this.sex = needed;
        }
    };

    Category.prototype.concatinateProps = function () {
        if (this.props && this.props.length > 0) {
            let propVals = {};
            this.props.forEach(function (el) {
                if (!propVals[el.aromats_property.id]) propVals[el.aromats_property.id] = {
                    name: el.aromats_property.argument_name,
                    items: []
                };
                propVals[el.aromats_property.id].items.push(el.aromats_properties_value.value_name);
                propVals[el.aromats_property.id].tag = el.aromats_property.tag;
            });
            for (let prop in propVals) {
                propVals[prop].value = propVals[prop].items.join(', ');
            }
            // console.log(propVals);
            this.propsConcat = propVals;
        }
    };

    // Category.addHook("afterFind", (instance, options) => {
    //     console.log(options.favourites);
    //
    // });

    Category.associate = function (models) {

    };
    Category.associate = function (models) {
        models.categories.belongsTo(models.aromats_collections, {
            foreignKey: 'id',
            targetKey: 'aromat_id'
        });

        models.categories.hasMany(models.aromats_properties_connect, {
            foreignKey: 'aromat_id',
            targetKey: 'aromat_id'
        });

        models.categories.hasMany(models.aromats_favourites, {
            foreignKey: 'aromat_id',
            targetKey: 'aromat_id'
        });

        models.categories.hasMany(models.aromats_may_like, {
            foreignKey: 'aromat_id',
            targetKey: 'aromat_id'
        });

        models.categories.hasMany(models.aromats_recommended, {
            foreignKey: 'aromat_id',
            targetKey: 'aromat_id'
        });

        models.categories.hasMany(models.aromats_similar, {
            foreignKey: 'aromat_id',
            targetKey: 'aromat_id'
        });

        models.categories.hasMany(models.products_categories, {
            foreignKey: 'category_id',
        });

    };

    return Category;
};


