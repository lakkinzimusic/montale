const CartService = require('../services/cartService');
let iconv = require('iconv-lite');
let crypto = require('crypto');
let windows1251 = require('windows-1251');
const PromoService = require('../services/promoService');
const OrderService = require('../services/orderService');
const models = require('../orm');
//заново корзина


exports.paymentsuccessget = async (req, res, next) => {
    if (req.session.cart) {
        await models.carts.destroy({
            where: {
                id: req.session.cart.id
            }
        });
        res.locals.cart = null;
        req.session.cart = null;
    }
    res.render('payment-success')
};


exports.paymentsuccesspost = async (req, res, next) => {
    let key = '69496d516c36517675705d36664e51547b63686461414260713735';
    let unsorted_fields = {};

    // Извлечение всех параметров POST-запроса, кроме WMI_SIGNATURE
    for (let [key, value] of Object.entries(req.body)) {
        if (key !== 'WMI_SIGNATURE') {
            unsorted_fields[key] = value;
        }

    }
    let sorted_fields = {};

// Сортировка массива по именам ключей в порядке возрастания
    Object.keys(unsorted_fields).sort().forEach(function (key) {
        sorted_fields[key] = unsorted_fields[key];
    });
    let values = '';

    // формирование сообщения, путем объединения значений формы
    for (let [key, value] of Object.entries(sorted_fields)) {
        values += value;
    }
    let sign = crypto.createHash('md5').update(iconv.encode(values + key, 'win1251')).digest('base64');
    console.log(sign);

    if (sign === req.body['WMI_SIGNATURE']) {
        console.log('signatures coincide');
    } else {
        console.log('signatures not coincide');
    }
    await models.orders.update({status: 1}, {
        where: {id: req.body['WMI_PAYMENT_NO']}
    });

    req.session.order = await models.orders.findOne({
        where: {id: req.body['WMI_PAYMENT_NO']}
    });

    await models.carts.destroy({where: {id: req.session.cart.id}});
    res.locals.cart = null;
    req.session.cart = null;
    res.end();


};


exports.checkout = async (req, res, next) => {

    console.log('checkout');
    let success_order = await models.orders.findOne({where: {id: order.id}});
    let delivery_method = await models.delivery_methods.findOne({where: {id: success_order.delivery_method_id}});
    success_order.delivery_method = delivery_method.label;
    let payment_method = await models.payment_methods.findOne({where: {id: success_order.payment_method_id}});
    success_order.payment_method = payment_method.label;


    console.log(success_order.id);
    let order_items = await models.order_items.findAll({where: {order_id: success_order.id}});
    let order_items_id = [];

    if (order_items instanceof Array) {
        order_items.map(item => {
            order_items_id.push(item.product_id);
        });
    }
    else {
        order_items_id.push(order_items.product_id);
    }


    let order_products = await models.products.findAll({
        where: {id: order_items_id}
    });

    if (order_products instanceof Array) {
        order_products.map(product => {
            product.orderProductPrice = null;
            product.orderSumPrice = null;
            product.quantity = null;
            order_items.map(item => {
                if (item.product_id === product.id) {
                    product.orderProductPrice = item.price_const;
                    product.quantity = item.quantity;
                    product.orderSumPrice = item.price_const * item.quantity;
                }
            });
        });
    }
    else {
        order_products.orderProductPrice = null;
        order_products.orderSumPrice = null;
        order_products.quantity = null;
        product.orderProductPrice = order_items.price_const;
        product.quantity = order_items.quantity;
        product.orderSumPrice = order_items.price_const * item.quantity;
    }


    // Формирование значения параметра WMI_SIGNATURE, путем
// вычисления отпечатка, сформированного выше сообщения,
// по алгоритму MD5 и представление его в Base64
    inputs += createInput('WMI_SIGNATURE', crypto.createHash('md5').update(iconv.encode(values + key, 'win1251')).digest('base64'));
    res.render('checkout', {
        inputs: inputs
    })

};


exports.checkpay = async (req, res, next) => {

};


exports.getCart = async (req, res, next) => {
    console.log('getCart');
    let cart = await  CartService.getCart(req);           //Получаем корзину
    let userPhone = '';
    let userFullname = '';

    if (req.session.user) {
        userPhone = req.session.user.phone;
        userFullname = req.session.user.firstname + ' ' + req.session.user.surname;
    }

    let deliveryMethods = await models.delivery_methods.findAll();
    let defaultDeliveryMethod = deliveryMethods.find(method => method.id === 1);

    let paymentIds = await models.delivery_payment.findAll({
        where: {
            delivery_method_id: defaultDeliveryMethod.id,
        },
        attributes: ['payment_method_id'],
        raw: true,
    });

    let arr = [];

    paymentIds.forEach((el) => {
        arr.push(el.payment_method_id)
    });

    let defaultPaymentMethods = await models.payment_methods.findAll({
        where: {id: arr}
    });
    // for (let key in cart) {
    //     console.log(cart[key]);
    // }

    res.render("cart.hbs", {
        cart: cart,
        pageTitle: 'Корзина',
        userPhone: userPhone,
        defaultDeliveryMethod: defaultDeliveryMethod,
        deliveryMethods: deliveryMethods,
        defaultPaymentMethods: defaultPaymentMethods,
    });
};

exports.addToCart = async (req, res, next) => {
    console.log('addTocart');
    let cart_item = await CartService.addToCart(req);
    let product = await models.products.findOne({where: {id: req.query.id}});
    if (!product) {
        return res.redirect('/');
    }


    //ПРИСВОЕНИЕ АКЦИОННОЙ ЦЕНЫ
    let products_promo = await models.products_promo.findOne({
        where: {product_id: product.id}
    });
    if (products_promo) {
        let promo = await models.promo.findOne({ //ищем акцию
            where: {id: products_promo.promo_id}
        });
        product.promoPrice = product.price - (product.price / 100 * promo.discount);
    }
    //ПРИСВОЕНИЕ АКЦИОННОЙ ЦЕНЫ

    let connection = await models.products_categories.findOne({where: {product_id: product.id}});
    if (connection) {
        product.category = await models.categories.findOne({where: {id: connection.category_id}});
    }
    let params = req.query.params;
    let cart = await CartService.getCart(req);
    return res.render('partials/buy_modal', {
        cart: cart,
        cart_item: cart_item,
        product: product,
        params: params,
    });
};


exports.changeQuantityProduct = async (req, res, next) => {
    let itemId = req.query.id;
    let cartId = req.session.cart.id;
    let destination = req.query.destination;
    let item = await models.cart_items.findOne({where: {cart_id: cartId, id: itemId}});
    let quantity = item.quantity;
    if (destination == 'inc') {
        quantity++;
    } else {
        quantity--;
    }
    item.quantity = quantity;
    // await item.save();\
    if (quantity > 0) {
        await models.cart_items.update({quantity: quantity}, {where: {cart_id: cartId, id: itemId}});
    }
    else {
        await models.cart_items.destroy({where: {cart_id: cartId, id: itemId}});
    }

    let cart = await CartService.getCart(req);

    let response = {};
    response.quantity = quantity;
    response.sum = cart.totalPrice;
    response.promocodePrice = cart.promocodePrice;
    response.count = cart.totalCount;
    console.log(cart.promocodePrice);
    console.log(response.sum);

    return res.json(response);
};


exports.orderInfo = async (req, res, next) => {

    console.log('level');
    console.log(req.query);
    res.render('order-info', {
        // order: order
    })

};

exports.paymentfailget = async (req, res, next) => {
    console.log('payment-fail get');
    res.render('payment-fail')
};


exports.paymentfailpost = async (req, res, next) => {

    console.log('payment-fail post');
    res.end();
};

exports.failedOrderProcessing = async (req, res, next) => {
    res.locals.paymentErrorMsg = '';
    if (req.body.action === 'cancelled') {
        res.locals.paymentErrorMsg = 'Заказ отменён';
        await models.orders.update({status: 4},
            {
                where: {
                    id: req.session.order.id
                }
            });
    }

    if (req.body.action === 'update') {
        await models.orders.update({
            status: 1,
            payment_method_id: 2
        }, {
            where: {
                id: req.session.order.id
            }
        });
        res.locals.paymentErrorMsg = 'Заказ принят, оплата будет произведена наличными'
    }
    if (req.body.action === 'cancelled' || req.body.action === 'update') {
        await models.carts.destroy({
            where: {
                id: req.session.cart.id
            }
        });
        res.locals.cart = null;
        req.session.cart = null;
        req.session.order = null;
        res.redirect('/')
    }
    if (req.body.action === 'repeat') {
        console.log('repeat');
        res.redirect('/cart/payment-form')
    }
};
exports.createOrder = async (req, res, next) => {
    let validResult = await OrderService.checkValidator(req, res);
    let order = null;
    if (validResult === 'ok') {

        order = await  OrderService.createOrder(req, res);

        req.session.order = order;        //ФОРМИРУЕМ СТРАНИЦУ ОПЛАТЫ
        console.log(typeof req.session.order.payment_method_id);
        if (req.session.order.payment_method_id != 2) {
            console.log('pay');
            res.redirect('/cart/payment-form')
            // //формируем чек
            // let order_items_id = [];
            // let order_items = await models.order_items.findAll({where: {order_id: order.id}});
            // order_items.map(item => order_items_id.push(item.id));
            // let products = await models.order_items.findAll({where: {id: order_items_id}});
            // let wmi_order_items = [];
            // let obj = {};
            // order_items.map(item => {
            //     products.map(product => {
            //         if (item.product_id === products.id) {
            //             obj.title = product.product_name;
            //             obj.Quantity = item.quantity;
            //             obj.UnitPrice = item.price_const;
            //             obj.SubTotal = item.quantity * item.price_const;
            //             obj.TaxType = 'tax_ru_1';
            //             obj.Tax = 0.00;
            //             wmi_order_items.push(obj);
            //         }
            //     })
            // });


        }
        else {
            console.log('pay2');
            res.redirect('/cart/payment-success')
        }

    }
};


exports.paymentform = async (req, res) => {
    let key = '3252756d6c614c426e746d603247576f37354753715f3045474546';

    let fields = {
        WMI_MERCHANT_ID: '154661832812',
        WMI_PAYMENT_AMOUNT: req.session.order.total_price,
        WMI_CURRENCY_ID: '643',
        WMI_PAYMENT_NO: req.session.order.id,
        WMI_DESCRIPTION: 'Payment for order #' + req.session.order.id + ' in MYSHOP.com',
        WMI_EXPIRED_DATE: '2019-12-31T23:59:59',
        WMI_SUCCESS_URL: 'http://138.68.125.45:8081/cart/payment-success',
        WMI_FAIL_URL: 'http://138.68.125.45:8081/cart/payment-fail',
        WMI_PTENABLED: 'CreditCardRUB',
    };
    console.log(req.session.order.total_price);
    console.log(req.session.order.id);
    let comparator = function (a, b) {
        var a = a.toLowerCase();
        var b = b.toLowerCase();
        return a > b ? 1 : a < b ? -1 : 0;
    };

    let createInput = function (name, value) {
        return '<input hidden name="' + name + '" value="' + value + '">';
    };

    let inputs = '';
    let values = '';

    // Формирование сообщения, путем объединения значений формы,
    // отсортированных по именам ключей в порядке возрастания
    Object.keys(fields).sort(comparator).forEach(function (name) {
        var value = fields[name];
        if (Array.isArray(value)) {
            values += value.sort(comparator).join('');
            inputs += value.map(function (val) {
                return createInput(name, val);
            }).join('');
        }
        else {
            values += value;
            inputs += createInput(name, value);
        }
    });
    // inputs += createInput('WMI_SIGNATURE', );
    let sign = crypto.createHash('md5').update(iconv.encode(values + key, 'win1251')).digest('base64');
    let form = '<form method="POST" id="payForm" action="https://wl.walletone.com/checkout/checkout/Index" accept-charset="UTF-8">' + inputs + '<input hidden type="submit"></form>';
    console.log(sign);
    res.render('checkout', {
        order: req.session.order,
        sign: sign
    })
};


exports.applyPromoCode = async (req, res) => {
    let validResult = PromoService.checkValidator(req, res);
    if (validResult === 'ok') {

        let newPrice = await PromoService.setPromocode(req.body.promocode, parseInt(req.body.totalPrice), req.session.id);

        return res.send({newPrice: JSON.stringify(newPrice)});
    }
};


exports.getPaymentMethods = async (req, res, next) => {
    console.log('getPaymentMethods');
    let paymentIds = await models.delivery_payment.findAll({
        where: {delivery_method_id: req.query.delivery_method_id},
        attributes: ['payment_method_id'],
        raw: true
    });

    let arr = [];

    paymentIds.forEach((el) => {
        arr.push(el.payment_method_id)
    });
    let methods = await models.payment_methods.findAll({
        where: {id: arr}
    });

    return res.json(methods)
};

exports.orderRegistration = async (req, res, next) => {
    console.log('hi2');
    let cart = await  CartService.getCart(req);
    //Получаем корзину
    let userPhone = '';
    let userFullname = '';
    if (req.session.user) {
        userPhone = req.session.user.phone;
        userFullname = req.session.user.firstname + ' ' + req.session.user.surname;
    }

    let deliveryMethods = await models.delivery_methods.findAll();
    let defaultDeliveryMethod = deliveryMethods.find(method => method.id === 1);

    let paymentIds = await models.delivery_payment.findAll({
        where: {delivery_method_id: defaultDeliveryMethod.id},
        attributes: ['payment_method_id'],
        raw: true
    });

    let arr = [];

    paymentIds.forEach((el) => {
        arr.push(el.payment_method_id)
    });

    let defaultPaymentMethods = await models.payment_methods.findAll({
        where: {id: arr}
    });

    let cart_quantity = 0;
    cart.cart_items.forEach(item => {
        cart_quantity += item.quantity;
    });

    res.render('order_registration', {
        cart_quantity: cart_quantity,
        cart: cart,
        deliveryMethods: deliveryMethods,
        defaultPaymentMethods: defaultPaymentMethods,
        pre_selected_delivery_method: req.body.delivery_method,
        pre_selected_payment_method: req.body.payment_method,
        userFullname: userFullname,
        userPhone: userPhone,
        user: req.session.user,
        pageTitle: "Оформление заказа",
    });

};

exports.cancelOrder = async (req, res, next) => {
    let cart = await  CartService.getCart(req);
    //Получаем корзину


    res.render('order_registration', {
        cart: cart,
        deliveryMethods: deliveryMethods,
        defaultPaymentMethods: defaultPaymentMethods,
        pre_selected_delivery_method: req.body.delivery_method,
        pre_selected_payment_method: req.body.payment_method,
        userFullname: userFullname,
        userPhone: userPhone,
        user: req.session.user,
        pageTitle: "Оформление заказа",
    });

};
exports.addDeliveryPrice = (req, res, next) => {
    // console.log('add')
    // console.log(req.body)
    // console.log(req.body.delivery_city)
    // console.log(req.body['delivery_city'])
    console.log(typeof req.body['delivery_city']);
    req.session.delivery_price = null;
    req.session.delivery_city = null;
    req.session.delivery_price = parseInt(req.body.delivery_price);
    req.session.delivery_city = req.body['delivery_city'];
console.log( req.session.delivery_city);
    return res.json(req.session.delivery_price)
};
exports.removeDeliveryPrice =  (req, res, next) => {
    console.log(console.log('delete'));
    req.session.delivery_price = null;
    req.session.delivery_city = null;

    return res.json(req.session.delivery_price)
};