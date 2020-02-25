const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const Product = require('../models/productModel');
const Promo = require('../models/promoModel');
const Cart = require('../models/cartModel');
const ProductService = require('../services/productService');
const models = require('../orm');

module.exports = class testService {


    // static async addToCart(req) {
    //
    //     let cartItem = null;
    //     if (!req.session || !req.session.cart) return [];
    //     let cartId = req.session.cart.id;
    //     let product = await models.products.findByPk(req.query.id);
    //     if (product.meta_data && product.meta_data.not_stackable == true) {
    //         cartItem = await models.cart_items.findOne({where: {cart_id: cartId, product_id: product.id}});
    //     }
    //     if (!cartItem) {
    //         cartItem = await models.cart_items.build({
    //             cart_id: cartId,
    //             product_id: product.id,
    //             price: product.price,
    //             quantity: 1,
    //             params: req.query.params
    //         }).save();
    //     } else {
    //         let quantity = cartItem.quantity;
    //         quantity++;
    //         cartItem.quantity = quantity;
    //         console.log(cartItem);
    //         await cartItem.save();
    //     }
    //
    //     console.log(cartItem);
    //     return cartItem;
    // }


    static async getCart(req) {

        let sess_id = req.session.id;
        let cart = await models.carts.findOne({
            include: [
                {
                    model: models.cart_items, as: 'cart_items', include: [
                        {
                            model: models.products, include: [
                                {
                                    model: models.products_categories, include: [
                                        {model: models.categories}
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            where: {user_id: sess_id}
        });
        if (!cart) {
            cart = await models.carts.build({user_id: sess_id}).save();
            cart.cart_items = [];
        }
        let requests = cart.cart_items.map((el) => {
            return new Promise(async (resolve) => {
                await el.applyKit();
                return resolve();
            });
        });


        //ПРИСВОЕНИЕ АКЦИОННОЙ ЦЕНЫ
        let products_promo = await models.products_promo.findAll();
        cart.cart_items.map(product => {
            product.promoPrice = null;
            products_promo.map(async prod_prom => {
                if (prod_prom.product_id === product.product_id) { //если находим совпадения у нашего товара и акцонного
                    // let promo = await models.promo.findOne({ //ищем акцию
                    //     where: {id: prod_prom.promo_id}
                    // });
                    // product.promoPrice = product.price - (product.price / 100 * promo.discount); //считаем промо-цену
                    // product.price = product.promoPrice; //присваиваем цене значение промо-цены
                    product.promoPrice = product.price;
                }
            })
        });
        //ПРИСВОЕНИЕ АКЦИОННОЙ ЦЕНЫ




        await Promise.all(requests);
        cart.totalCount = cart.cart_items.length;
        let sum = 0;
        cart.cart_items.forEach(function (item) {

            sum += (item.price * item.quantity);
        });

        cart.totalPrice = sum;
        if (cart.promocode_id) {
            let promocode = await models.promocode.findOne({
                where: {id: cart.promocode_id}
            });
            if (promocode) {
                promocode.discount = parseInt(promocode.discount);
                cart.promocodePrice = 0;
                cart.cart_items.map(product => {
                    if (product.promoPrice === null){
                        cart.promocodePrice += product.price * product.quantity;
                    }
                    else{
                        cart.promocodePrice += Math.round((product.price * product.quantity) - ((product.price * product.quantity)/100 * promocode.discount));
                    }
                });
            }
        }
        return cart;
    }


};
