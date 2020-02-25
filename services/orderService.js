const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const Product = require('../models/productModel');
const Promo = require('../models/promoModel');
const Cart = require('../models/cartModel');
const ProductService = require('../services/productService');
const CartService = require('../services/cartService');
const TestService = require('../services/testService');
const models = require('../orm');
const {validationResult} = require('express-validator');
// const initCart = require('../middleware/initCart');
module.exports = class OrderService {


    static async createOrder(req, res) {
        let email = 'null';

        if (req.session.isLoggedIn) email = req.session.user.email;
        if (req.body.email) {
            email = req.body.email;
        }
        // let now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let cart = await TestService.getCart(req);
        if (!cart.cart_items) {
            res.redirect('/');
        }

        function appendLeadingZeroes(n) {
            if (n <= 9) {
                return "0" + n;
            }
            return n
        }
        if(Array.isArray(req.body.city2)){
            req.body.city2 = req.body.city2[0];
        }
        console.log();
        if (req.session.delivery_price) {
            cart.totalPrice += req.session.delivery_price;
        }

        let now = new Date();
        now = now.getFullYear() + "-" + appendLeadingZeroes((now.getMonth() + 1)) + "-" + appendLeadingZeroes(now.getDate()) + " " + appendLeadingZeroes(now.getHours()) + ":" + appendLeadingZeroes(now.getMinutes()) + ':' + appendLeadingZeroes(now.getSeconds());
        let cart_quantity = 0;

        let order = await models.orders.create({
            cart_quantity: cart_quantity,
            email: email,
            total_price: cart.totalPrice,
            created_at: now,
            delivery_method_id: req.body.delivery_method,
            delivery_address: req.body.delivery_address,
            payment_method_id: req.body.payment_method,
            delivery_city: req.body.city2,
            user_fullname: req.body.user_fullname,
            user_phone: req.body.user_phone,
            comment: req.body.comment,
            status: 5,
        });
        let requests = cart.cart_items.map((item) => {

            return new Promise(async (resolve) => {
                await models.order_items.create({
                    order_id: order.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price_const: item.price,
                    params: item.params,
                });
                return resolve();
            });
        });
        await Promise.all(requests);
        return order;
    }

    static async checkValidator(req, res) {
        //finding endpoynt of route
        let endpoynt = req.route.path.split('/');
        endpoynt = endpoynt[endpoynt.length - 1];
        let deliveryMethods = await models.delivery_methods.findAll();
        let defaultDeliveryMethod = deliveryMethods.find(method => method.id === 1);

        let paymentIds = await models.delivery_payment.findAll({
            where: {delivery_method_id: defaultDeliveryMethod.id},
            attributes: ['payment_method_id'],
            raw: true
        });

        let arr = [];

        paymentIds.forEach((el) => {
            arr.push(el.payment_method_id)
        });

        let defaultPaymentMethods = await models.payment_methods.findAll({
            where: {id: arr}
        });
        let cart = await  TestService.getCart(req);
        let cart_quantity = 0;
        cart.cart_items.forEach(item => {
            cart_quantity += item.quantity;
        });
        //check validate errors
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render(
                'order_registration',
                {
                    cart_quantity: cart_quantity,
                    deliveryMethods: deliveryMethods,
                    defaultPaymentMethods: defaultPaymentMethods,
                    pre_selected_delivery_method: req.body.delivery_method,
                    pre_selected_payment_method: req.body.payment_method,
                    errorMessages: errors.array(),
                    oldInput: {
                        user_fullname: req.body.user_fullname,
                        email: req.body.email,
                        user_phone: req.body.user_phone,


                        delivery_city: req.body.delivery_city,
                        delivery_adress: req.body.delivery_adress,
                        comment: req.body.comment,
                    },
                    validationErrors: errors.array()
                });
        }
        //if not errors - return ok;
        return 'ok';
    }

    static async getAllOrdersItems(req) {
        let ordersItems = await models.orders.findAll({
            where: {email: req.session.user.email},
            include: [{
                model: models.order_items,
                include: [{
                    model: models.products,
                    include: [{
                        model: models.products_categories,
                        include: [{
                            model: models.categories,
                        }]
                    }]
                }]
            }]
        });
        return ordersItems;
    }


};
