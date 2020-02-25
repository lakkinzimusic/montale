const ProductService = require('../services/productService');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var models = require('../orm');
exports.getProduct = async (req, res) => {
    let products = [];
    let cat = await models.categories.findByPk(req.params.id);
    if (cat) {
        products = await cat.products;
        products = await ProductService.productBoxSorting(products);
        products = await ProductService.setBoxAttributes(products, req);
    }

    res.locals.breadcrumbs.push({label: cat.category_name});

    res.render("allproducts.hbs", {
        products: products,
        user: req.session.user,
        pageTitle: !cat ? 'null' : cat.category_name,
        hasProducts: products.length > 0,
        isAuthenticated: req.session.isLoggedIn,
    });
};

exports.getAromat = async (req, res) => {
    let aromat = await models.categories.findOne({
        where: {slug: req.params.slug},
        context: {favourites_products: res.locals.favourites_products},
        include: [{
            model: models.aromats_properties_connect,
            context: {favourites_products: res.locals.favourites_products}
        }]
    });

    await aromat.initProducts();
    await aromat.initProps();
    await aromat.concatinateProps();
    let productsMayLike = await aromat.may_like;
console.log(aromat.propsConcat);
    let requests = productsMayLike.map((el) => {
        return new Promise(async (resolve) => {
            await el.initProducts();
            return resolve();
        });
    });

    await Promise.all(requests);

    let sameCollection = await aromat.same_collection;
    requests = sameCollection.map((el) => {
        return new Promise(async (resolve) => {
            await el.initProducts();
            return resolve();
        });
    });

    await Promise.all(requests);
    let ratings = [];
    if (req.session.user) {
        ratings = await models.aromats_rating.findAll({
            where: {aromat_id: aromat.id, approved: 1, user_id: {[Op.not]: req.session.user.id}},
            include: {model: models.users}
        });
    } else {
        ratings = await models.aromats_rating.findAll({
            where: {aromat_id: aromat.id, approved: 1},
            include: {model: models.users}
        });
    }

    let rat_len = 0;
    ratings.ratingValue = 5;
    if (ratings.constructor === Array) {
        let sum = 0;
        ratings.forEach((rating) => {
            sum += rating.rating
        });
        ratings.ratingValue = sum / ratings.length;
        ratings.ratingValue.toFixed(2);
        rat_len = ratings.length;
    } else {
        ratings.ratingValue = ratings.rating;
        rat_len = 1;
    }
    let userRating = {};
    if (req.session.user) {
        userRating = await models.aromats_rating.findOne({
            where: {
                aromat_id: aromat.id, user_id: req.session.user.id,
            }
        });
        if (userRating) {
            userRating.username = req.session.user.username;
        }
    }
// console.log(ratings);
    if (!ratings.ratingValue) {
        ratings.ratingValue = 5;
    }

    res.render("aromatpageTEST", {
        aromat: aromat,
        productsMayLike: productsMayLike,
        thisCollectionAromats: sameCollection,
        pageTitle: aromat.category_name,
        ratings: ratings,
        rat_len: rat_len,
        userRating: userRating
    });
};

exports.collectionPage = async (req, res) => {
    let products = [];
    let collection_ids = [];
    let collection = await models.collections.findOne({where: {slug: req.params.slug}});

    let aromats_collections = await models.aromats_collections.findAll({
        where: {collection_id: collection.id},
        context: {favourites_products: res.locals.favourites_products},
    });

    aromats_collections.forEach((aromat) => {
        collection_ids.push(aromat.aromat_id)
    });


    let categories = await models.categories.findAll({
        where: {id: collection_ids},
        context: {favourites_products: res.locals.favourites_products},
    });


    res.locals.breadcrumbs.push({'label': 'Коллекция ' + collection.collection_name, 'as_h1': true});

    let requests = categories.map((el) => {
        return new Promise(async (resolve) => {
            await el.initProducts();
            return resolve();
        });
    });
    await Promise.all(requests);


    res.render("allproductsTEST.hbs", {
        categories: categories,
        user: req.session.user,
        pageTitle: !collection ? 'null' : collection.collection_name,
        hasProducts: products.length > 0,
        // isAuthenticated: req.session.isLoggedIn,
    });
};

exports.discoveryKit = async (req, res) => {
    let categories = await models.categories.findAll({
        attributes: ['category_name', 'id'],
        order: [['category_name', 'ASC']]
    });
    res.locals.breadcrumbs.push({'label': 'Discovery Kit'});
    let discoveryKit = await models.categories.findOne({where: {category_name: "Discovery Kit"}});
    await discoveryKit.initProducts();
    let product = discoveryKit.products[0];
    res.render("discoveryKit.hbs", {
        pageTitle: 'Discovery Kit',
        categories: categories,
        product: product
    })
};

exports.search = async (req, res) => {
    let categories = await models.categories.findAll({
        where: {category_name: {[Op.like]: "%" + req.query.key_word + "%"}},
        context: {favourites_products: res.locals.favourites_products}
    });
    res.locals.breadcrumbs.push({'label': 'Поиск "' + req.query.key_word + '"', 'as_h1': true});
    let requests = categories.map((el) => {
        return new Promise(async (resolve) => {
            await el.initProducts();
            return resolve();
        });
    });
    await Promise.all(requests);

    res.render("aromats_selection", {
            categories: categories,
            pageTitle: "Поиск"
        }
    );
};


exports.home = async (req, res) => {

};
