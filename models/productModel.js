const db = require('../config/db');

module.exports = class ProductModel {
    constructor(product_name, price, description, imageUrl) {
        this.product_name = product_name;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    static getOneProduct(id) {
        return db.execute("SELECT * FROM products WHERE id=? " +
            "", [id]);
    }

    static async findOne(id){
        let res = await db.query("SELECT * FROM products WHERE id=? LIMIT 1" +
            "", [id]);
        console.log(res[0]);
        let data = res[0];
        return data[0]?data[0]:null;
    }

    static getSampleKit(id) {
        return db.execute("SELECT * FROM products_kit " +
            "JOIN products ON products.id = products_kit.product_id OR products.id=1 " +
            "WHERE kit_id=1");
    }

    static getMyLittleTreasureBox(id) {
        return db.execute("SELECT * FROM products_kit " +
            "JOIN products ON products.id = products_kit.product_id OR products.id=2" +
            "WHERE kit_id=2");
    }
    static addToFavorite(user_id, aromat_id) {
        return db.execute("INSERT INTO aromats_favourites (user_id, aromat_id) VALUES (?, ?)",
            [user_id, aromat_id]);
    }

    static findFavorite(user_id, aromat_id) {
        return db.execute("SELECT * FROM aromats_favourites WHERE user_id=? AND aromat_id =?",
            [user_id, aromat_id]);
    }


    static getFilteredAndSortedProducts(sortType, id, collection_id) {
        if(collection_id !== 'id'){
            return db.execute("SELECT * FROM aromats_collections " +
                "JOIN categories ON categories.id = aromats_collections.aromat_id " +
                "JOIN products_categories ON products_categories.category_id = categories.id " +
                "JOIN products ON products.id = products_categories.product_id " +
                "WHERE collection_id=?", [collection_id])
        }
        if (id === undefined) {
            return db.execute("SELECT * FROM products ORDER BY " + sortType);
        }
        else{
            if(sortType === undefined)
            {
                sortType = "price ASC";
            }
            return db.execute("SELECT * FROM aromats_properties_connect " +
                "JOIN products_categories ON products_categories.category_id = aromats_properties_connect.aromat_id " +
                "JOIN products ON products.id = products_categories.product_id " +
                "WHERE value_id IN (" + id + ") ORDER BY "  + sortType);
        }

    }

    static deleteThisFavorite(user_id, aromat_id) {
        return db.execute("DELETE FROM aromats_favourites WHERE user_id=? AND aromat_id =?",
            [user_id, aromat_id]);
    }


    static getFavourites(req) {
        let user_id = 40;

        //ЗАГЛУШКА
        if (req.session.user != undefined) {
            user_id = req.session.user.id;
        }
        //ЗАГЛУШКА

        return db.execute("SELECT * FROM aromats_favourites " +
            "JOIN products ON products.id = aromats_favourites.aromat_id WHERE user_id=?", [user_id]);
    }


    static getAllOrders(email) {
        return db.execute("SELECT * FROM orders WHERE email=?", [email]);
    }

    static getAllOrderItems(order_id) {
        return db.execute("SELECT * FROM order_items " +
            "JOIN products ON products.id = order_items.product_id WHERE order_id=?", [order_id]);
    }

    static getAllProducts() {
        return db.execute("SELECT * FROM products");
    }

    static getProducts(id) {
        return db.execute("SELECT * FROM products WHERE id IN (" + id + ")");
    }


    static getAllProperties() {
        return db.execute("SELECT * FROM aromats_properties");
    }

    static getProperty(id) {
        return db.execute("SELECT * FROM products_properties WHERE id=?",
            [id]);
    }

    // static getThisProductThisProperty(property_id, product_id) {
    //     return db.execute("SELECT * FROM products_properties_connect " +
    //         "JOIN products_properties ON products_properties.id = products_properties_connect.property_id " +
    //         "JOIN products_properties_values ON products_properties_values.id = products_properties_connect.value_id " +
    //         "WHERE products_properties_connect.property_id=? AND products_properties_connect.product_id=?",
    //         [property_id, product_id]);
    // }

    static getProductsMayLike(id) {
        return db.execute("SELECT * FROM aromats_may_like " +
            "JOIN products ON products.id = products_may_like.may_like_product " +
            "WHERE products_may_like.product_id=?",
            [id]);
    }

    // static getAllPropertiesValues() {
    //     return db.execute("SELECT  p.id as argument_id, p.argument_name,  pv.id as value_id , pv.value_name  " +
    //         " FROM products_properties as p" +
    //         " JOIN products_properties_values as pv" +
    //         " ON p.id = pv.property_id");
    // }


    static getAllPropertiesValues() {
        return db.execute("SELECT * FROM aromats_properties_values");

    }

    static getFilteredProductsId(id) {
        return db.execute("SELECT * FROM products_properties_connect WHERE value_id IN (" + id + ")");
    }

    static async getNewProductsAndBestsellers() {
        let query = "SELECT *, categories.slug as cat_slug FROM aromats_properties_connect " +
            "JOIN products_categories " +
            "ON products_categories.category_id = aromats_properties_connect.aromat_id " +
            // "AND products_categories.category_id = 1 " +
            "JOIN products ON products.id = products_categories.product_id " +
            "JOIN categories ON categories.id = products_categories.category_id " +
            "WHERE aromats_properties_connect.value_id = 39 OR aromats_properties_connect.value_id=40";
        let res = await db.query(query);
        let data = res[0];
        return data?data:null;
    }

    static getNewProducts() {
        return db.execute("SELECT * FROM products_properties_connect " +
            "JOIN products ON products.id = products_properties_connect.product_id " +
            "WHERE value_id=40");
    }

    static getBestsellers() {
        return db.execute("SELECT * FROM products_properties_connect " +
            "JOIN products ON products.id = products_properties_connect.product_id " +
            "WHERE value_id=39");
    }

    static insertProperties(product_id, property_id, value_id) {
        return db.execute(
            'INSERT INTO products_properties_connect (product_id, property_id, value_id) VALUES (?, ?, ?)',
            [product_id, property_id, value_id]
        );
    }

    static getProductsById(id) {
        return db.execute("SELECT * FROM products WHERE id IN (" + id + ")");
    }

    save() {
        return db.execute(
            'INSERT INTO products (product_name, price, description, imageURL) VALUES (?, ?, ?, ?)',
            [this.product_name, this.price, this.description, this.imageUrl]
        );
    }

    static delete(id) {
        this.id = id;
        console.log(this.id);
        return db.execute("DELETE FROM products WHERE id=?", [this.id]);
    }

    static update(id, product_name, price, description, imageURL) {
        const sql = "UPDATE products SET product_name=?, price=?, description=?, imageURL=? WHERE id=?";
        const data = [product_name, price, description, imageURL, id];
        return db.execute(sql, data)
    }

};
