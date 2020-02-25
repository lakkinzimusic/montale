const express = require("express");
const router = express.Router();
const models = require('../../orm');
var Sequelize = require('sequelize');
var os = require('os-utils');

// PROMOCODES

router.get("/promocodes", async function (req, res) {
    let page = req.query.page ? req.query.page : 1;
    let limit = 20;
    let offset = (limit * page) - limit;

    console.log(offset, limit, page);

    let obj = await models.promocode.findAndCountAll({
        limit: limit,
        offset: offset,
    });
    return res.json(obj)
});

router.put("/promocodes", async function (req, res) {
    console.log('update');
    let obj = await models.promocode.findOne({
        where: {id: req.query.promocode_id},
    });
    await obj.update(req.body);
    return res.json(obj)
});


router.get("/get-promocode", async function (req, res) {
    console.log(req.query.promocode_id);
    let obj = await models.promocode.findOne({
        where: {id: req.query.promocode_id},
    });
    if (!obj) return res.status(404).json({error: 'entity not found'});
    return res.json(obj.get({plain: true}));
});


router.post("/promocodes", async function (req, res) {
    let payload = req.body;
    let val = await models.promocode.create(payload);
    return res.json(val);
});

router.delete("/promocodes/:id", async function (req, res) {
    let val = await models.promocode.findOne({where: {id: req.params.id}});
    val.destroy();
    return res.send(true);
});


// PAYMENTS

router.get("/payment-methods", async function (req, res) {
    let page = req.query.page ? req.query.page : 1;
    let limit = 20;
    let offset = (limit * page) - limit;

    console.log(offset, limit, page);
//Выбираем уникальные методы оплаты

    let obj = await models.payment_methods.findAndCountAll({
        limit: limit,
        offset: offset,

    });

//для каждого уникального момента добываем массив возможных способов доставки
    let request = obj.rows.map((method) => {
        return new Promise(async (resolve) => {
            await method.getAvailableDeliveryMethods();
            return resolve()
        })
    });
    await Promise.all(request);

    // ВНИМАНИЕ, ВЕЛОСИПЕД
    // Запихиваем в rows методы. Не смог понять, почему после ответа был недоступно свойство delivery_methods
    obj.rows.map((method) => {
        method.dataValues.delivery_methods = [];
        method.delivery_methods.forEach((del) => {
            method.dataValues.delivery_methods.push(del);
        });
    });

    return res.json(obj)
});

router.get("/get-payment-method", async function (req, res) {
    let obj = await models.payment_methods.findOne({
        where: {id: req.query.payment_method_id},
    });
    await obj.getAvailableDeliveryMethods();
    obj.dataValues.delivery_methods = [];

    // ВНИМАНИЕ, ВЕЛОСИПЕД
    // Запихиваем в rows методы. Не смог понять, почему после ответа был недоступно свойство delivery_methods

    obj.delivery_methods.forEach((method) => {
        obj.dataValues.delivery_methods.push(method);
    });

    if (!obj) return res.status(404).json({error: 'entity not found'});
    return res.json(obj);
});

router.put("/payment-methods", async function (req, res) {
    let payment_method = await models.payment_methods.findOne({
        where: {id: req.query.payment_method_id},
    });
    await payment_method.update(req.body);

    let delivery_payment = req.body.delivery_methods.map(item =>
        Object.assign({}, {delivery_method_id: item.id , payment_method_id: req.query.payment_method_id})
    );
    console.log(delivery_payment);
    await models.delivery_payment.destroy({where: {payment_method_id: req.query.payment_method_id}});
    await models.delivery_payment.bulkCreate(delivery_payment);

    return res.json(payment_method)
});


// DELIVERY

router.get("/delivery-methods", async function (req, res) {
    let page = req.query.page ? req.query.page : 1;
    let limit = 20;
    let offset = (limit * page) - limit;


    let obj = await models.delivery_methods.findAndCountAll({
        limit: limit,
        offset: offset,
    });

    //для каждого уникального момента добываем массив возможных способов доставки
    let request = obj.rows.map((method) => {
        return new Promise(async (resolve) => {
            await method.getAvailablePaymentMethods();
            return resolve()
        })
    });
    await Promise.all(request);

    // ВНИМАНИЕ, ВЕЛОСИПЕД
    // Запихиваем в rows методы. Не смог понять, почему после ответа был недоступно свойство payment_methods
    obj.rows.map((method) => {
        method.dataValues.payment_methods = [];
        method.payment_methods.forEach((del) => {
            method.dataValues.payment_methods.push(del);
        });
    });

    return res.json(obj)
});

router.get("/get-delivery-method", async function (req, res) {

    let obj = await models.delivery_methods.findOne({
        where: {id: req.query.delivery_method_id},
    });
    await obj.getAvailablePaymentMethods();
    obj.dataValues.payment_methods = [];

    // ВНИМАНИЕ, ВЕЛОСИПЕД
    // Запихиваем в rows методы. Не смог понять, почему после ответа был недоступно свойство payment_methods

    obj.payment_methods.forEach((method) => {
        obj.dataValues.payment_methods.push(method);
    });

    if (!obj) return res.status(404).json({error: 'entity not found'});
    return res.json(obj);
});

router.put("/delivery-methods", async function (req, res) {
    // console.log(req.body.payment_methods);
    let delivery_method = await models.delivery_methods.findOne({
        where: {id: req.query.delivery_method_id},
    });
    await delivery_method.update(req.body);

    let delivery_payment = req.body.payment_methods.map(item =>
        Object.assign({}, {delivery_method_id: req.query.delivery_method_id, payment_method_id: item.id})
    );
    console.log(delivery_payment);
    await models.delivery_payment.destroy({where: {delivery_method_id: req.query.delivery_method_id}});
    await models.delivery_payment.bulkCreate(delivery_payment);

    return res.json(delivery_method)
});

// STATUSES

router.get("/statuses", async function (req,res){
    return res.json(await models.order_statuses.findAll());
});

module.exports = router;
