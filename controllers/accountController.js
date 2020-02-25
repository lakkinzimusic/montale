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
const PromoService = require('../services/promoService');
const OrderService = require('../services/orderService');
const stripe = require('stripe')('pk_test_IrjIdP23DnTC8XZ2RKlnY0qq00VFqbzRtr');
const models = require('../orm');
const bcrypt = require('bcryptjs');
const AuthService = require('../services/authService');

exports.getAccount = (req, res) => {
    let user = req.session.user;
    if(user.birthday[2] !== '.'){
        let years = user.birthday.substring(0, 4);
        let mounths = user.birthday.substring(5, 7);
        let days = user.birthday.substring(8);
        user.birthday = days + '.' + mounths + '.' + years;

    }

    res.render("account/account", {
        user: user,
        pageTitle: "Мой профиль"
    });
};


exports.getFavourites = async (req, res) => {
    let ids = [];
    res.locals.favourites_products.forEach(async (favourite_product) => {
        ids.push(favourite_product.aromat_id);
    });


    let categories = await models.categories.findAll({
        where: {id: ids},
        context: {favourites_products: res.locals.favourites_products}
    });

    let requests = categories.map((el) => {
        return new Promise(async (resolve) => {
            await el.initProducts();
            return resolve();
        });
    });
    await Promise.all(requests);
    res.render("account/favourites", {
        categories: categories,
        user: req.session.user,
        pageTitle: "Мое избранное"
    });

};


exports.updateUser = async (req, res, next) => {
    let validResult = AuthService.updateValidator(req, res);
    let user_id = req.session.user.id;
    if (validResult === 'ok') {
        if (req.body.birthday === '') {
            req.body.birthday = new Date();
            req.body.birthday = req.body.birthday.getUTCFullYear() + '-' +
                ('00' + (req.body.birthday.getUTCMonth() + 1)).slice(-2) + '-' +
                ('00' + req.body.birthday.getUTCDate()).slice(-2) + ' ' +
                ('00' + req.body.birthday.getUTCHours()).slice(-2) + ':' +
                ('00' + req.body.birthday.getUTCMinutes()).slice(-2) + ':' +
                ('00' + req.body.birthday.getUTCSeconds()).slice(-2);
        }
        else {
            req.body.birthday = AuthService.dateFormating(req.body.birthday)
        }
        let hash_password = await  bcrypt.hash(req.body.password, 12);
        console.log(req.body.sex);
        let request = await models.users.update({
                username: req.body.username,
                firstname: req.body.firstname,
                surname: req.body.surname,
                sex: req.body.sex,
                country: req.body.country,
                birthday: req.body.birthday,
                email: req.body.email,
                password: hash_password,
                phone: req.body.phone,
            },
            {where: {id: user_id}});
        console.log('update');
        res.send(request);
    }
};


exports.getOrders = async (req, res) => {
    let orders_ids = null;
    let orders = await OrderService.getAllOrdersItems(req);

    let requests = orders.map(async (el) => {
        let subs = el.order_items.map((ci) => {
            return new Promise(async (resolve) => {
                await ci.applyKit();
                return resolve();
            });
        });
        await Promise.all(subs);
        return Promise.resolve();
    });
    await Promise.all(requests);
    let orders_statuses = await models.order_statuses.findAll();
    orders.map(order => {
        orders_statuses.map(status => {
            if (order.status === status.id) {
                order.status = status;
            }
        })
    });


    res.render("account/orders", {
        orders: orders,
        user: req.session.user,
        pageTitle: "Мои заказы"
    });
};
