const express = require("express");
const router = express.Router();
const models = require('../../orm');

router.get('/pages', async function(req,res){
    let page = req.query.page ? req.query.page : 1;
    let limit = 20;
    let offset = (limit * page) - limit;

    let obj = await models.static_page.findAndCountAll({
        limit: limit,
        offset: offset,
    });
    return res.json(obj)
});
router.get("/pages/:id", async function(req,res){
    let val = await models.static_page.findOne({where:{id:req.params.id}});
    return res.json(val);
});
router.post("/pages", async function(req,res){
    let payload = req.body;
    let val = await models.static_page.create(payload);
    return res.json(val);
});

router.put("/pages/:id", async function(req,res){
    let payload = req.body;
    payload.id = undefined;
    let val = await models.static_page.findOne({where:{id:req.params.id}});
    val.update(payload);
    return res.json(val);
});

router.delete("/pages/:id", async function(req,res){
    let val = await models.static_page.findOne({where:{id:req.params.id}});
    val.destroy();
    return res.send(true);
});

module.exports = router;
