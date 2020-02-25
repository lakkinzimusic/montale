const db = require('../config/db');

module.exports = class ProductModel {


    static async getAllCollections() {
        let res = await db.execute("SELECT * FROM collections");
        let data = res[0];
        return data?data:null
    }


};
