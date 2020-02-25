const express = require("express");
const router = express.Router();
const models = require('../../orm');
var Sequelize = require('sequelize');
var os = require('os-utils');

// USERS

router.get("/users", async function (req, res) {
    let page = req.query.page ? req.query.page : 1;
    let limit = 20;
    let offset = (limit * page) - limit;

    let obj = await models.users.findAndCountAll({
        limit: limit,
        offset: offset,
    });
    return res.json(obj)
});

router.put("/users", async function (req, res) {
    console.log('update');
    let obj = await models.users.findOne({
        where: {id: req.query.user_id},
    });
    await obj.update(req.body);
    console.log(obj);
    return res.json(obj)
});



router.get("/get-user", async function (req, res) {
    let user_id = req.query.user_id;
    let obj = await models.users.findOne({
        where: {id: user_id},
    });
    if (!obj) return res.status(404).json({error: 'entity not found'});
    return res.json(obj.get({plain: true}));
});

router.delete("/users/:id", async function(req,res){
    let val = await models.users.findOne({where:{id:req.params.id}});
    val.destroy();
    return res.send(true);
});



// PAYMENTS

router.get("/managers", async function (req, res) {
    let page = req.query.page ? req.query.page : 1;
    let limit = 20;
    let offset = (limit * page) - limit;

    console.log(offset, limit, page);


    return res.json(obj)
});

// DELIVERY


module.exports = router;
