const fs = require('fs');
const path = require('path');
const db = require('../config/db');
// const p = path.join(
//     path.dirname(process.mainModule.filename),
//     'data',
//     'cart.json'
// );

module.exports = class CartModel {

    static createCart(user_id) {
        return db.execute(
            'INSERT INTO carts (user_id) VALUES (?)',
            [user_id]
        );
    }

    static getOneCart(user_id) {
        return db.execute(
            'SELECT * FROM carts WHERE user_id=?',
            [user_id]
        );
    }

    static getCartId(id) {
        return db.execute(
            'SELECT * FROM carts WHERE id=?',
            [id]
        );
    }

    static getCartItems(cart_id) {
        return db.execute(
            'SELECT * FROM cart_items ' +
            'JOIN products ON products.id = cart_items.product_id WHERE cart_id=?',
            [cart_id]
        );
    }

    static insertNotExistItem(cart_id, product_id, quantity) {
        return db.execute(
            'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
            [cart_id, product_id, quantity]
        );
    }

    static insertExistItem(cart_id, product_id, quantity) {

        if (quantity >= 1) {
            return db.execute(
                "UPDATE cart_items SET quantity=? WHERE cart_id=? AND product_id=?",
                [quantity, cart_id, product_id]);

        }
        else {
            return db.execute(
                "DELETE FROM cart_items WHERE cart_id=? AND product_id=?",
                [cart_id, product_id]);
        }
    }


    static addProduct(id, productPrice) {
        // Fetch the previous cart
        console.log('ok1');

        // fs.readFile(p, (err, fileContent) => {
        //     let cart = {products: [], totalPrice: 0};
        //     if (!err) {
        //         cart = JSON.parse(fileContent);
        //     }
        //     console.log(cart);
        //
        //     // // Analyze the cart => Find existing product
        //     const existingProductIndex = cart.products.findIndex(
        //         prod => prod.id === id
        //     );
        //     const existingProduct = cart.products[existingProductIndex];
        //     let updatedProduct;
        //     // Add new product/ increase quantity
        //     if (existingProduct) {
        //         updatedProduct = {...existingProduct};
        //         updatedProduct.qty = updatedProduct.qty + 1;
        //         cart.products = [...cart.products];
        //         cart.products[existingProductIndex] = updatedProduct;
        //     } else {
        //         updatedProduct = {id: id, qty: 1};
        //         cart.products = [...cart.products, updatedProduct];
        //     }
        //     cart.totalPrice = cart.totalPrice + +productPrice;
        //     fs.writeFile(p, JSON.stringify(cart), err => {
        //         console.log(err);
        //     });
        // });
    }

    //
    //
    // static getCart(cb) {
    //     fs.readFile(p, (err, fileContent) => {
    //         const cart = JSON.parse(fileContent);
    //         if (err) {
    //             cb(null);
    //         } else {
    //             cb(cart);
    //         }
    //     });
    // }

};
