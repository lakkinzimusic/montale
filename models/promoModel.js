const db = require('../config/db');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');


module.exports = class Promo {

    static getPromos() {
        return db.execute('SELECT * FROM promo');
    }

    static getProductsPromo(id) {
        return db.execute("SELECT * FROM products_promo " +
            "JOIN promo ON promo.id = products_promo.promo_id " +
            "WHERE product_id IN (" + id + ")");
    }


    static getPromocode(code) {
        return db.execute("SELECT * FROM promocode " +
            "WHERE code=?", [code]);
    }
};