const Product = require('../models/productModel');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getAllProducts = (req, res, next) => {
    let productsInfo = {products: [], properties: []};
    Product.getAllProducts().then(([rows]) => {
        productsInfo.products = rows;
        Product.getAllPropertiesValues().then(([rows]) => {

            productsInfo.properties = rows;


            res.send(productsInfo);
        })
    })
};

//
// exports.getAllProductsProperties = (req, res, next) => {
//     Product.getAllProperties().then(([rows]) => {
//         res.send(rows);
//     })
//         .catch(err=> console.log(err));
// };
//
// exports.getAllProductsPropertiesValues = (req, res, next) => {
//     Product.getAllPropertiesValues().then(([rows]) => {
//         res.send(rows);
//     })
//         .catch(err=> console.log(err));
// };


exports.getOneProduct = (req, res, next) => {
    let id = req.params.id;

    Product.getProductsById(id).then(([rows]) => {
        res.send(rows);
    })
        .catch(err => console.log(err));
};


exports.createProduct = (req, res, next) => {
    let product_name = req.body.product_name;
    let price = req.body.price;
    let description = req.body.description;
    let image = req.file;
    let prop = JSON.parse(req.body.properties);
    let insertId = 0;
    const imageURL = image.path;
    const product = new Product(product_name, price, description, imageURL);
    product.save()
        .then(([results]) => {
            insertId = results.insertId;
            for (let key in prop) {

                Product.getProperty(parseInt(key))
                    .then(([rows]) => {
                        if (Array.isArray(prop[key])) {
                            for (let i = 0; i < prop[key].length; i++) {
                                Product.insertProperties(insertId, parseInt(key), prop[key][i])
                            }
                        }
                        else {
                            Product.insertProperties(insertId, parseInt(key), prop[key])
                        }

                    });
            }
        })
};

exports.deleteProduct = (req, res, next) => {
    let id = req.params.id;
    Product.delete(id)
};


exports.updateProduct = (req, res, next) => {
    let id = req.body.id;
    let product_name = req.body.product_name;
    let price = req.body.price;
    let description = req.body.description;
    let imageURL = req.body.imageURL;
    Product.update(id, product_name, price, description, imageURL)
        .then(console.log('Обновлено'));
};