const db = require('../config/db');

module.exports = class orderModel {

    static createOrder(email, totalPrice, created_at){
        return db.execute(
            'INSERT INTO orders (email, total_price, created_at) VALUES (?, ?, ?)',
            [email, totalPrice, created_at]
        );
    }
    static insertItems(order_id, product_id, quantity, price_const ){
        return db.execute(
            'INSERT INTO order_items (order_id, product_id, quantity, price_const) VALUES (?, ?, ?, ?)',
            [order_id, product_id, quantity, price_const]
        );
    }
    //
    // static insertExistItem(quantity, id){
    //     return db.execute(
    //         "UPDATE order_items SET quantity=? WHERE id=?",
    //         [quantity, id]
    //     );
    // }

};
