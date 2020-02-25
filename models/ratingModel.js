const db = require('../config/db');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');


module.exports = class Rating {



    static addRating(aromat_id, user_id, comment) {
        return db.execute("INSERT INTO aromats_rating (aromat_id, user_id, comment) VALUES (?, ?, ?)",
            [aromat_id, user_id, comment]);
    }

    static getProductsRating(id) {
        return db.execute("SELECT * FROM aromats_rating " +
            "JOIN users ON users.id = aromats_rating.user_id " +
            "WHERE aromat_id IN (" + id + ") and approved=1");
    }
};