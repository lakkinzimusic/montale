const express = require("express");
const router = express.Router();
const models = require('../../orm');
var Sequelize = require('sequelize');
var os = require('os-utils');
const Op = require('sequelize').Op;


// base constants [prop_id,val_id] TODO: move to config
const PROP_BESTSELLER = [9,39];
const PROP_NEW = [10,40];

// PRODUCTS

router.get("/products", async function (req, res) {
    let page = req.query.page ? req.query.page : 1;
    let limit = 20;
    let offset = (limit * page) - limit;

    console.log(offset, limit, page);

    let obj = await models.products.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [['product_name', 'ASC']],
        include: [
            {
                model: models.products_categories, as: 'products_categories', include: [
                    {model: models.categories}
                ]
            }
        ],
    });
    return res.json(obj)
});

router.get("/products/:id", async function (req, res) {
    let id = req.params.id;
    if (!id) return res.status(422).json({error: 'id is undefined'});
    let obj = await models.products.findOne({
        where: {id: id},
        include: [
            {
                model: models.products_categories, as: 'products_categories', include: [
                    {model: models.categories}
                ]
            }
        ],
    });
    if (!obj) return res.status(404).json({error: 'entity not found'});
    return res.json(obj.get({plain: true}));
});

router.put("/products/:id", async function (req, res) {
    let payload = req.body;
    let products_categories = payload.products_categories.map(item =>
        Object.assign({}, {category_id: item.category_id, product_id: item.product_id})
    );
    let id = req.params.id;
    await models.products_categories.destroy({where: {product_id: id}});
    await models.products_categories.bulkCreate(products_categories);

    let product = await models.products.findOne({where: {id: id}});
    await product.update(payload);
    return res.json(product);
});

// COLLECTIONS

router.get("/collections", async function (req, res) {
    let page = req.query.page ? req.query.page : 1;
    let limit = 20;
    let offset = (limit * page) - limit;

    let obj = {};

    if(req.query.nolimit) {
        limit = Infinity;
        offset = 0;
        obj = await models.collections.findAll();
    } else {
        obj = await models.collections.findAndCountAll({
            limit: limit,
            offset: offset,
        });
    }
    return res.json(obj)
});

router.get("/collections/:id", async function (req, res) {
    let id = req.params.id;
    if (!id) return res.status(422).json({error: 'id is undefined'});
    let obj = await models.collections.findOne({
        where: {id: id},
    });
    if (!obj) return res.status(404).json({error: 'entity not found'});
    return res.json(obj.get({plain: true}));
});

router.put("/collections/:id", async function (req, res) {
    let payload = req.body;
    let id = req.params.id;
    let collection = await models.collections.findOne({where: {id: id}});
    await collection.update(payload);
    return res.json(collection);
});

// CATEGORIES (PERFUMES)

router.get("/perfumes", async function (req, res) {
    let page = req.query.page ? req.query.page : 1;
    let limit = 20;
    let offset = (limit * page) - limit;

    console.log(offset, limit, page);

    let obj = await models.categories.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [['category_name', 'ASC']]
    });
    return res.json(obj)
});

router.get("/perfumes/:id", async function (req, res) {
    let id = req.params.id;
    if (!id) return res.status(422).json({error: 'id is undefined'});
    let obj = await models.categories.findOne({
        where: {id: id},
        include: [
            {
                model: models.products_categories, as: 'products_categories', include: ['product_connection']
            },
            {
                model: models.aromats_properties_connect, include: [
                    {model: models.aromats_properties},
                    {model: models.aromats_properties_values},
                ]
            },
            {
                model: models.aromats_collections, include: [
                    {model: models.collections},
                ]
            },
            {
                model: models.aromats_may_like, include: [
                    {model: models.categories},
                ]
            },
            {
                model: models.aromats_recommended, include: ['recommendation']
            },
            {
                model: models.aromats_similar, include: ['similar']
            },
        ],
    });

    let service_fields = {
        bestseller: PROP_BESTSELLER[0],
        new: PROP_NEW[0]
    };
    obj = obj.toJSON();
    obj.markers = {};
    for(let key in service_fields){
        let exists = (obj.aromats_properties_connects.filter(item => item.property_id === service_fields[key])).length > 0;
        obj.markers[key] = exists;
    }


    if (!obj) return res.status(404).json({error: 'entity not found'});
    return res.json(obj);
});

router.put("/perfumes/:id", async function (req, res) {
    let id = req.params.id;
    let payload = req.body;
    let category = await models.categories.findOne({where:{id:id}});
    let aromats_collection = {aromat_id: id, collection_id: payload.aromats_collection.collection_id};
    let aromats_properties_connects = payload.aromats_properties_connects.map(item =>
        Object.assign({}, {aromat_id: id, property_id: item.property_id, value_id: item.value_id})
    );
    let aromats_recommendeds = payload.aromats_recommendeds.map(item =>
        Object.assign({}, {aromat_id: id, aromat_recommended_id: item.aromat_recommended_id})
    );
    let aromats_similars = payload.aromats_similars.map(item =>
        Object.assign({}, {aromat_id: id, aromat_similar_id: item.aromat_similar_id})
    );
    let aromats_may_likes = payload.aromats_may_likes.map(item =>
        Object.assign({}, {aromat_id: id, may_like_aromat: item.may_like_aromat})
    );
    let products_categories = payload.products_categories.map(item =>
        Object.assign({}, {category_id: item.category_id, product_id: item.product_id})
    );

    await category.update(payload);

    await models.aromats_collections.destroy({where: {aromat_id: id}});
    await models.aromats_collections.create(aromats_collection);

    await models.aromats_properties_connect.destroy({where: {aromat_id: id}});
    await models.aromats_properties_connect.bulkCreate(aromats_properties_connects);

    await models.aromats_recommended.destroy({where: {aromat_id: id}});
    await models.aromats_recommended.bulkCreate(aromats_recommendeds);

    await models.aromats_similar.destroy({where: {aromat_id: id}});
    await models.aromats_similar.bulkCreate(aromats_similars);

    await models.aromats_may_like.destroy({where: {aromat_id: id}});
    await models.aromats_may_like.bulkCreate(aromats_may_likes);

    await models.products_categories.destroy({where: {category_id: id}});
    await models.products_categories.bulkCreate(products_categories);

    if(payload.markers){
        await models.aromats_properties_connect.destroy({
            where: {
                aromat_id: id,
                [Op.or]: [
                    {property_id:PROP_NEW[0]},
                    {property_id:PROP_BESTSELLER[0]},
                ]
            }
        });

        if(payload.markers.new) await models.aromats_properties_connect.create({
            aromat_id: id,
            property_id: PROP_NEW[0],
            value_id: PROP_NEW[1]
        });

        if(payload.markers.bestseller) await models.aromats_properties_connect.create({
            aromat_id: id,
            property_id: PROP_BESTSELLER[0],
            value_id: PROP_BESTSELLER[1]
        });
    }
    return res.json(payload);
});

//PRODUCTS-RATINGS

router.get("/aromats-ratings", async function (req, res) {
    let page = req.query.page ? req.query.page : 1;
    let limit = 20;
    let offset = (limit * page) - limit;

    console.log(offset, limit, page);
//Выбираем уникальные методы доставки
    let obj = await models.aromats_rating.findAndCountAll({
        limit: limit,
        offset: offset,
        include: [{model: models.users}, {model: models.categories}],
    });

    return res.json(obj)
});

router.get("/get-rating", async function (req, res) {
    let aromat_id = req.query.aromat_id;
    let user_id = req.query.user_id;
    if (!aromat_id) return res.status(422).json({error: 'aromat_id is undefined'});
    if (!user_id) return res.status(422).json({error: 'user is undefined'});
    let obj = await models.aromats_rating.findOne({
        where: {aromat_id: aromat_id, user_id: user_id},
        include: {model: models.users},
    });
    if (!obj) return res.status(404).json({error: 'entity not found'});
    return res.json(obj.get({plain: true}));
});

router.put("/aromats-ratings", async function (req, res) {
    console.log('update');
    let obj = await models.aromats_rating.findOne({
        where: {aromat_id: req.query.aromat_id, user_id: req.query.user_id},
    });
    await obj.update(req.body);
    return res.json(obj)
});

router.put("/aromats-ratings/approved-change", async function (req, res) {
    console.log(req.body);
    console.log(req.body.approved_value);

    req.body.approved_value === 1 ? req.body.approved_value = 0 : req.body.approved_value = 1;

    let obj = await models.aromats_rating.update({approved: req.body.approved_value}, {
        where: {aromat_id: req.body.aromat_id, user_id: req.body.user_id},
    });
    return res.json(req.body)
});


// PROPERTIES

router.get("/properties", async function (req, res) {
    let obj = await models.aromats_properties.findAll(
        {
            include:[{model:models.aromats_properties_values}],
            order:[['argument_name', 'ASC']],
            where: {tag: {[Op.not]: 'service'}}
        });
    return res.json(obj)
});

router.post("/properties/:id/value", async function(req,res){
    let payload = req.body;
    let val = await models.aromats_properties_values.create(payload);
    return res.json(val);
});

router.put("/properties/:id/value/:value_id", async function(req,res){
    let payload = req.body;
    payload.id = undefined;
    let val = await models.aromats_properties_values.findOne({where:{id:req.params.value_id}});
    val.update(payload);
    return res.json(val);
});

router.delete("/properties/:id/value/:value_id", async function(req,res){
    let val = await models.aromats_properties_values.findOne({where:{id:req.params.value_id}});
    val.destroy();
    return res.send(true);
});

module.exports = router;
