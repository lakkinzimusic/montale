const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Promo = require('../models/promoModel');
const ProductService1 = require('../services/productService');
const models = require('../orm');
const {validationResult} = require('express-validator');
module.exports = class PromoService {


    static async setPromo(Allproducts) {

        let allProductsId = [];
        for (let key in Allproducts) {
            Allproducts[key].forEach((product) => {
                allProductsId.push(product.id);
            })

        }
        let promos = await Promo.getProductsPromo(allProductsId);
        promos = promos[0];
        for (let key in Allproducts) {
            Allproducts[key].forEach((product) => {
                for (let k = 0; k < promos.length; k++) {
                    if (product.id === promos[k].product_id) {
                        product.promoPrice = product.price / 100 * promos[k].discount;
                        product.promoName = promos[k].promo_name;
                    }
                }
            })
        }
        return Allproducts;

    }

    static async setPromoInProducts(Allproducts) {
        let allProductsId = [];

        Allproducts.forEach((product) => {
            allProductsId.push(product.id);
        });


        let promos = await Promo.getProductsPromo(allProductsId);
        promos = promos[0];

        Allproducts.forEach((product) => {
            for (let k = 0; k < promos.length; k++) {
                if (product.id === promos[k].product_id) {
                    product.promoPrice = product.price / 100 * promos[k].discount;
                    product.promoName = promos[k].promo_name;
                }
            }
        });

        return Allproducts;
    }

    static async setPromocode(code, totalPrice, session_id) {
        let promocode = await models.promocode.findOne({  //ищем промокод
            where: {code: code}
        });

        await models.carts.update({
            promocode_id: promocode.id
        }, {
            where: {user_id: session_id}
        });

        if (promocode === undefined) {   //если его нет - возвращаем цену неизвенённой
            return totalPrice;
        }
        let discount = parseInt(promocode.discount);
        return Math.round(totalPrice - (totalPrice / 100 * discount));
    }

    static checkValidator(req, res) {
        //check validate errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(422).json({
                errorMessages: errors.array(),
                oldInput: {
                    promocode: req.body.promocode,
                },
                validationErrors: errors.array()
            });
        }
        //if not errors - return ok;
        return 'ok';
    }


    static checkSubscribe(req, res) {
        //check validate errors
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errorMessages: errors.array(),
                oldInput: {
                    email: req.body.email,
                },
                validationErrors: errors.array()
            });
        }
        return 'ok';
    }


};