const express = require("express");
const cartController = require("../controllers/cartController.js");
const {body} = require('express-validator');
const cartRouter = express.Router();
const isAuth = require('../middleware/is-auth');
const models = require("../orm");

cartRouter.get('/', cartController.getCart);
cartRouter.post('/payment-fail', cartController.paymentfailpost);
cartRouter.get('/payment-fail', cartController.paymentfailget);
cartRouter.get('/payment-success', cartController.paymentsuccessget);
cartRouter.post('/payment-success', cartController.paymentsuccesspost);
cartRouter.get('/get-payment-methods', cartController.getPaymentMethods);

cartRouter.get('/change-qty/:id', cartController.changeQuantityProduct);
cartRouter.get('/order-info', cartController.orderInfo);
cartRouter.post('/checkout', cartController.checkout);
cartRouter.get('/payment-form', cartController.paymentform);


cartRouter.post('/failed-order-processing', cartController.failedOrderProcessing);

cartRouter.post('/checkpay', cartController.checkpay);
cartRouter.post('/apply-promo-code',
    [
        body('promocode')
            .custom(async (value, {req}) => {
                //check promo exist

                let promo = await models.promocode.findOne(
                    {where: {code: req.body.promocode}});
                if (!promo) {
                    return Promise.reject(
                        'Неверный промокод'
                    );
                }
            })

    ],
    cartController.applyPromoCode);

cartRouter.post('/create-order',
    [
        body('delivery_method').not().isEmpty().withMessage('Необходим выбрать метод доставки'),
        body('email').not().isEmpty().withMessage('Поле email должно быть заполнено'),
        body('email').isEmail().withMessage('Некорректный email'),
        body('payment_method').not().isEmpty().withMessage('Необходим выбрать метод оплаты'),
        body('user_phone').not().isEmpty().withMessage('Необходим телефон покупателя'),
        body('user_fullname').not().isEmpty().withMessage('Необходим ввести имя покупателя'),
        body('city2').custom(async (value, {req}) => {
            console.log(req.body.delivery_method);
            if (req.body.delivery_method == 4) {
                console.log('1:' + value[0]);
                console.log('2:' + req.session.delivery_city);
                if (req.session.delivery_city !== value[0])
                    return Promise.reject(
                        'Город доставки указан некорректно'
                    );
            }
        })

    ],
    cartController.createOrder);

cartRouter.post('/order-registration', cartController.orderRegistration);

cartRouter.get('/order-registration', function (req, res) {
    return res.redirect('/cart');
});

cartRouter.get('/:id', cartController.addToCart);

cartRouter.post('/add-delivery-price', cartController.addDeliveryPrice);
cartRouter.post('/remove-delivery-price', cartController.removeDeliveryPrice);


module.exports = cartRouter;
