const db = require('../config/db');

module.exports = class CategoriesModel {

    static getAllAromats() {
        return db.execute("SELECT * FROM categories WHERE category_type='Аромат'");
    }

    static getNecessaryCategories(id) {
        //if(id.length <= 0) return [[]];
        return db.execute("SELECT DISTINCT product_id, category_id, category_name FROM products_categories " +
            "JOIN categories ON categories.id = products_categories.category_id " +
            "AND categories.category_type='Ароматы' " +
            "WHERE product_id IN (" + id + ")" );
    }


    //
    // static getNecessaryAromats(id) {
    //     return db.execute("SELECT DISTINCT product_id, category_id, category_name FROM products_categories " +
    //         "JOIN categories ON categories.id = products_categories.category_id " +
    //         "AND categories.category_type='Ароматы' " +
    //         "WHERE product_id IN (" + id + ")" );
    // }

    static getProductType(id) {
        return db.execute("SELECT product_id, category_id, category_name FROM products_categories " +
            "JOIN categories ON categories.id = products_categories.category_id " +
            "AND categories.category_type != 'Ароматы' " +
            "WHERE product_id IN (" + id + ")" );
    }

    static getNecessaryProductId(id) {
        if(id.length <= 0) return [[]];
        return db.execute("SELECT * FROM products_categories WHERE category_id IN (" + id + ")" );
    }
    static async getThisAromatsProducts(id) {
        let res = await db.execute("SELECT * FROM products_categories " +
            "JOIN products ON products.id = products_categories.product_id " +
            "WHERE category_id IN (" + id + ")" );

        let data = res[0];
        return data?data:null;
    }

    static getAllProperties() {
        return db.execute("SELECT * FROM aromats_properties");
    }

    static async getAromatsMayLike(aromat_id){
        let res = await db.execute("SELECT * FROM aromats_may_like " +
            "JOIN products_categories " +
            "ON products_categories.category_id = aromats_may_like.may_like_aromat " +
            "JOIN products ON products.id = products_categories.product_id " +

            "WHERE aromats_may_like.aromat_id=?" , [aromat_id]);

        let data = res[0];
        return data?data:null;
    }

    static async getThisCollectionAromats(aromat_id){
        let res = await db.execute("SELECT * FROM aromats_collections " +
            "JOIN products_categories " +
            "ON products_categories.category_id = aromats_collections.aromat_id " +
            "JOIN products ON products.id = products_categories.product_id " +
            "WHERE aromats_collections.aromat_id=?" , [aromat_id]);
        let data = res[0];
        return data?data:null;
    }

    static getThisAromatProperties(aromat_id) {
        return db.execute("SELECT DISTINCT aromats_properties_connect.property_id, aromats_properties.argument_name " +
            "FROM aromats_properties_connect " +
            "JOIN aromats_properties ON aromats_properties.id = aromats_properties_connect.property_id " +
            "WHERE aromats_properties_connect.aromat_id=?",
            [aromat_id]);
    }

    static getThisAromatPropertiesValues(aromat_id, property_id) {
        return db.execute("SELECT aromats_properties_values.property_id, " +
            "aromats_properties_values.value_name, " +
            "aromats_properties_values.id " +
            "FROM aromats_properties_connect " +
            "JOIN aromats_properties ON aromats_properties.id = aromats_properties_connect.property_id " +
            "JOIN aromats_properties_values ON aromats_properties_values.id = aromats_properties_connect.value_id " +
            "WHERE aromats_properties_connect.aromat_id=? AND aromats_properties_connect.property_id IN (" + property_id + ")" ,
            [aromat_id]);
    }
};
