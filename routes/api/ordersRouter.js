const express = require("express");
const router = express.Router();
const models = require("../../orm");

router.get('/orders', async function(req,res){
    let page = req.query.page ? req.query.page : 1;
    let limit = 20;
    let offset = (limit * page) - limit;

    let obj = await models.orders.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [['id','DESC']],
        include: [
            {model: models.payment_methods},
            {model: models.delivery_methods},
            {model: models.order_statuses},
        ]
    });
    return res.json(obj)
});

router.get("/orders/:id", async function(req,res){
    let val = await models.orders.findOne({
        where:{id:req.params.id},
        include: [
            {model: models.payment_methods},
            {model: models.delivery_methods},
            {model: models.order_statuses},
            {
                model: models.order_items,
                include: [
                    {model: models.products}
                ]
            },
            {
                model: models.order_comments,
                include: [
                    {model: models.users}
                ]
            }
        ],
    });
    return res.json(val);
});

router.put("/orders/:id", async function(req,res){
    let payload = req.body.order;
    let trace = req.body.trace;
    payload.id = undefined;

    let order_items = payload.order_items.map(item =>
        Object.assign({}, {
            product_id: item.product_id,
            order_id: req.params.id,
            price_const: item.price_const,
            quantity: item.quantity,
            params: item.params
        })
    );

    let messages = trace.map(item =>
        Object.assign({}, {
            comment: item.content,
            action: item.action,
            order_id: req.params.id,
            user_id: req.api_user.id,
        })
    );

    await models.order_items.destroy({where: {order_id: req.params.id}});
    await models.order_items.bulkCreate(order_items);
    await models.order_comments.bulkCreate(messages);

    let val = await models.orders.findOne({where:{id:req.params.id}});
    val.update(payload);
    return res.json(val);
});

// COMMENTS

router.post("/orders/comment/:id", async function(req,res){
    let payload = req.body;
    payload.order_id = req.params.id;
    payload.user_id = req.api_user.id;
    let val = await models.order_comments.create(payload);
    return res.json(val);
});

router.get("/orders/comment/:id", async function(req,res){
    let val = await models.order_comments.findAll({
        where: {order_id:req.params.id},
        include: [
            {model: models.users}
        ]
    });
    return res.json(val);
});

module.exports = router;
