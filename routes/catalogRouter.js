const express = require("express");
const router = express.Router();
const controller = require('../controllers/catalogController');
const service = require('../services/productService');
var models  = require('../orm');
var faker = require('faker');

router.get("/product_test/:id", controller.getProduct);
router.get("/collection/:slug", controller.collectionPage);
router.get("/perfume/:slug", controller.getAromat);
router.get("/resave", async function(req,res){
    let count = 30;
    for (let i = 0; i < count; i++){
        let payload = {
            name: faker.commerce.productName(),
            title: faker.commerce.productName(),
            content: faker.lorem.paragraphs(3, '<br/>')
        };
        await models.static_page.create(payload);
    }
    return res.send('done');
});
router.get("/discovery-kit", controller.discoveryKit);

router.get("/testhome", async function(req,res){
    return res.json(await models.users.findAll({ctx:{lol:'asd'}}));
});

router.get("/search", controller.search);


module.exports = router;
