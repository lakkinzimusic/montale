const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Promo = require('../models/promoModel');
const Favourite = require('../models/favouriteModel');
const ProductService1 = require('../services/productService');
const models = require('../orm');
const {validationResult} = require('express-validator');
module.exports = class FavouriteService {


    static async setFavourite(Allproducts, req, user_id) {

        let aromats = Allproducts;              //Получаем все ароматы
        let allAromatsId = [];
        for (let key in aromats) {
            allAromatsId.push(aromats[key].category_id);    //Достаём все id
        }

        let favourites = await Favourite.getFavourites(allAromatsId, user_id); //Получаем все любимые ароматы user-а

        favourites = favourites[0];
        for (let key in aromats) {
            for (let k = 0; k < favourites.length; k++) {
                if (aromats[key].category_id === favourites[k].aromat_id) {
                    aromats[key].isFavourite = true; //Если среди наших ароматов есть любимый - присваиваем свойство
                }
            }
        }
        return aromats;
    }


    static async getFavourites(req) {

        let favourites_categories = await models.aromats_favourites.findAll({
            include: [
                {
                    model: models.categories,
                }
            ],
            where: {user_id: req.session.user.id}
        });
        let requests = favourites_categories.map((aromat) => {
            return new Promise(async (resolve) => {
                await aromat.category.initProducts();
                return resolve();
            });
        });

        await Promise.all(requests);

        if (!favourites_categories) {
            // cart = await models.carts.build({user_id: req.session.user.id}).save();
            favourites_categories = [];
        }
        favourites_categories.quantity = favourites_categories.length;
        return favourites_categories;
    }

    static checkValidator(req, res) {
        //finding endpoynt of route
        let endpoynt = req.route.path.split('/');
        endpoynt = endpoynt[endpoynt.length - 1];

        //check validate errors
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json(

                {
                    errorMessages: errors.array(),
                    oldInput: {
                        comment: req.body.comment,
                    },
                    validationErrors: errors.array()
                });
        }
        //if not errors - return ok;
        return 'ok';
    }

};