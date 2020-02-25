const db = require('../config/db');
module.exports = class FavouriteModel {




    static addToFavorite(user_id, product_id) {
        return db.execute("INSERT INTO favourites (user_id, product_id) VALUES (?, ?)",
            [user_id, product_id]);
    }

    static findFavorite(user_id, product_id) {
        return db.execute("SELECT * FROM favourites WHERE user_id=? AND product_id =?",
            [user_id, product_id]);
    }




    static deleteThisFavorite(user_id, product_id) {
        return db.execute("DELETE FROM favourites WHERE user_id=? AND product_id =?",
            [user_id, product_id]);
    }

    static getFavourites(req, user_id) {
        return db.execute("SELECT * FROM aromats_favourites WHERE user_id=?", [user_id]);
    }

    // static getFavourites(req) {
    //     let user_id = 0;
    //
    //     //ЗАГЛУШКА
    //     // if (req.session.user != undefined) {
    //     //     user_id = req.session.user.id;
    //     // }
    //    user_id = 51;
    //     //ЗАГЛУШКА
    //
    //     return db.execute("SELECT * FROM favourites " +
    //         "JOIN products ON products.id = favourites.product_id WHERE user_id=?", [user_id]);
    //
    //
    // }



};
