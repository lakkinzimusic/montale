const Product = require('../models/productModel');
const Collections = require('../models/collectionsModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Promo = require('../models/promoModel');
const Rating = require('../models/ratingModel');
const Category = require('../models/categoriesModel');
const PropertiesService = require('../services/propertiesService');
const CartService = require('../services/cartService');
const ProductService = require('../services/productService');
const FavouriteService = require('../services/favouriteService');
const PromoService = require('../services/promoService');
const OrderService = require('../services/orderService');
const stripe = require('stripe')('pk_test_IrjIdP23DnTC8XZ2RKlnY0qq00VFqbzRtr');
const models = require('../orm');

exports.index = async (req, res) => {

    let bestsellers = await ProductService.getBestsellersOrNewProducts(9, res.locals.favourites_products);
    let newProducts = await ProductService.getBestsellersOrNewProducts(10, res.locals.favourites_products);
    bestsellers = bestsellers.slice(0, 4);
    res.render("index", {
        newProducts: newProducts,
        bestsellers: bestsellers,
        user: !req.session ? null : req.session.user,
        pageTitle: 'Главная страница',
    })
};


exports.addFavorite = async (req, res) => {
    let existFavourite = await models.aromats_favourites.findOne({
        where: {
            user_id: req.session.user.id,
            aromat_id: req.query.id
        }
    });
    if (!existFavourite) {
        let addFavourite = await models.aromats_favourites.create({
            user_id: req.session.user.id,
            aromat_id: req.query.id
        });
        return res.send('added');
    }
    let deleteFavourite = await models.aromats_favourites.destroy({
        where: {
            aromat_id: req.query.id
        }
    });
    return res.send('delete');
};

exports.addRating = async (req, res) => {
    let validResult = await FavouriteService.checkValidator(req, res);
    console.log(validResult);
    if (validResult === 'ok') {

        let now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let ratingValue = parseInt(req.body.rating);

        let rating = await models.aromats_rating.create({
            aromat_id: req.params.id,
            user_id: req.session.user.id,
            comment: req.body.comment,
            rating: ratingValue,
            created_at: now,
            updated_at: now,
            approved: 0,
        });
        return res.send(rating);
    }
};


exports.filter = async (req, res, next) => {
    let categories = await ProductService.getCategoriesByParams(req.query.id, req.query.type, req.query.order, res.locals.favourites_products);


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
        pageTitle: 'Продукты по вашему запросу',
        isAuthenticated: req.session.isLoggedIn,
    });

};


exports.promoProducts = async (req, res, next) => {
    let products_id = [];
    let products_promo = await models.products_promo.findAll();
    products_promo.map(prod => {
        products_id.push(prod.product_id);
    });


    let categories_ids = [];
    let categories = await models.products_categories.findAll({
        distinct: 'category_id',
        where: {product_id: products_id}
    });
    categories.map(category => {
        categories_ids.push(category.category_id);
    });

    categories = await models.categories.findAll({
        where: {id: categories_ids},
        context: {favourites_products: res.locals.favourites_products}
    });


    let requests = categories.map((el) => {
        return new Promise(async (resolve) => {
            await el.initProducts();
            return resolve();
        });
    });
    await Promise.all(requests);

    categories.map(category => {  //перебираем категории
        category.products.map(product => { //перебираем все продукты
            product.promoPrice = null;
            products_promo.map(async prod_prom => { //перебираем акционные товары
                if (prod_prom.product_id === product.id) { //если находим совпадения у нашего товара и акцонного

                    let promo = await models.promo.findOne({ //ищем акцию
                        where: {id: prod_prom.promo_id}
                    });
                    product.promoPrice = product.price - (product.price / 100 * promo.discount); //считаем промо-цену
                }
            });

        })
    });

    res.locals.breadcrumbs.push({'label': 'Акции', 'as_h1':true});

    res.render("allproductsTEST.hbs", {
        categories: categories,
        user: req.session.user,
        pageTitle: 'Акции',
        isAuthenticated: req.session.isLoggedIn,
    });

};


exports.getBestsellersOrNewProducts = async (req, res, next) => {
    let bestsellers = req.originalUrl === '/bestsellers';
    let categories = [];
    if (bestsellers){
        categories = await ProductService.getBestsellersOrNewProducts(9, res.locals.favourites_products);
    }
    else{
        categories = await ProductService.getBestsellersOrNewProducts(10, res.locals.favourites_products);
    }

    res.locals.breadcrumbs.push({'label': bestsellers ? 'Бестселлеры' : 'Новинки'});

    res.render(
        bestsellers ? "bestsellers" : "newProducts",
        {
            categories: categories,
            user: req.session.user,
            pageTitle: bestsellers ? 'Бестселлеры' : 'Новинки',
            isAuthenticated: req.session.isLoggedIn,
        });
};

exports.about = function (req, res) {
    res.render("about", {pageTitle:"О нас"});
};

exports.contact = function (req, res) {
    res.render("contact", {pageTitle:"Контакты"});
};

exports.subscribe = async (req, res) => {
    let validResult = await PromoService.checkSubscribe(req, res);
    if (validResult === 'ok') {
        let subscribe = await models.subscribers.create({
            email: req.body.email,
        });
        return res.send(subscribe);
    }
};

exports.paymentDelivery = function (req, res) {
    res.render("payment_delivery",{
        pageTitle: "Доставка и оплата"
    });
};

exports.aromatsSelection = async (req, res) => {
    let aromats = await ProductService.selectAromat(req, res);
    res.locals.breadcrumbs.push({'label': 'Подбор аромата', 'as_h1': true});

    console.log(aromats);
    res.render("aromats_selection", {
            categories: aromats,
        pageTitle: 'Подбор аромата',
        }
    );
};


exports.SampleKit = (req, res, next) => {
    let allProd = [];
    Product.getSampleKit()
        .then(rows => {
            allProd = rows;
            ProductService.setKitBoxes(rows).then((rows) => {


                res.render("sample_kit", {
                    sample_kit: rows,
                    user: req.session.user,
                    pageTitle: 'Бестселлеры',
                    hasProducts: rows.length > 0,
                    isAuthenticated: req.session.isLoggedIn,
                });
            })
        });
};

exports.TreasureBox = (req, res, next) => {
    let allProd = [];
    Product.getMyLittleTreasureBox()
        .then(([rows]) => {
            allProd = rows;
            ProductService.setKitBoxes(rows).then((rows) => {


                res.render("treasure_box", {
                    sample_kit: rows,
                    user: req.session.user,
                    pageTitle: 'Бестселлеры',
                    hasProducts: rows.length > 0,
                    isAuthenticated: req.session.isLoggedIn,
                });
            })
        });
};

exports.sendContactMessage = async (req, res) => {
    let request = await models.contact_messages.create({
        email: req.body.email,
        message: req.body.message
    });
    res.redirect('contact');
};


exports.offer = async (req, res) => {

    res.render('offer');
};



// exports.getAromat = async (req, res) => {
//     let aromat = {};
//     let product_array = [];
//     let productsMayLike = [];
//     let productsThisCollection = [];
//     let allProducts = [];
//     allProducts = await Category.getThisAromatsProducts(req.params.aromat_id);
//     allProducts = await  ProductService.productBoxSorting(allProducts);
//     allProducts = await   ProductService.setBoxAttributes(allProducts, req);
//     aromat = await  ProductService.setThisAromatAttributes(allProducts, req);
//
//     productsMayLike = await Category.getAromatsMayLike(req.params.aromat_id);
//     productsMayLike = await ProductService.productBoxSorting(productsMayLike);
//     productsMayLike = await ProductService.setBoxAttributes(productsMayLike, req);
//
//     productsThisCollection = await Category.getThisCollectionAromats(req.params.aromat_id);
//     productsThisCollection = await ProductService.productBoxSorting(productsThisCollection);
//     productsThisCollection = await ProductService.setBoxAttributes(productsThisCollection, req);
//     res.render("aromatpage", {
//         aromat: aromat,
//         productsMayLike: productsMayLike,
//         thisCollectionAromats: productsThisCollection,
//     });
// };
