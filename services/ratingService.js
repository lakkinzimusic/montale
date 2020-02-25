const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Rating = require('../models/ratingModel');

module.exports = class RatingService {


    static async setRating(Allproducts) {
        let aromats = Allproducts;
        let allAromatsId = [];
        let summ_ratings = 0;
        for (let key in aromats) {
            allAromatsId.push(aromats[key].category_id);
        }
        //Получаем все отзывы
        let ratings = await Rating.getProductsRating(allAromatsId);
        ratings = ratings[0];

        for (let key in aromats) {
            aromats[key].ratings = {};

            for (let k = 0; k < ratings.length; k++) {

                if (aromats[key].category_id === ratings[k].aromat_id) {

                    aromats[key].ratings_qty = ratings.length; //Количество отзывов
                    summ_ratings += ratings[k].rating;
                    aromats[key].ratings[ratings[k].user_id] = {};
                    aromats[key].ratings[ratings[k].user_id].username = ratings[k].username;
                    aromats[key].ratings[ratings[k].user_id].comment = ratings[k].comment;
                    aromats[key].ratings[ratings[k].user_id].rating = ratings[k].rating;
                }
            }

            aromats[key].average_rating = summ_ratings / ratings.length;
        }
// console.log(aromats);
        return aromats;

    }

};