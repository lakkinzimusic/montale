const express = require("express");
const homeController = require("../controllers/homeController.js");
const homeRouter = express.Router();
const {body} = require('express-validator');
const models = require("../orm");


homeRouter.get("/", homeController.index);

homeRouter.get("/filter", homeController.filter);

homeRouter.get("/sample-kit", homeController.SampleKit);
homeRouter.get("/treasure-box", homeController.TreasureBox);

homeRouter.get("/add-favorite", homeController.addFavorite);


homeRouter.post("/add-rating/:id",
    [
        body('comment').not().isEmpty().withMessage('Поле комментария должно быть заполнено'),
    ],
    homeController.addRating);


homeRouter.get("/new-products", homeController.getBestsellersOrNewProducts);
homeRouter.get("/bestsellers", homeController.getBestsellersOrNewProducts);


homeRouter.get("/about", homeController.about);
homeRouter.get("/contact", homeController.contact);
homeRouter.post("/subscribe",
    [
        body('email')
            .isEmail().withMessage('Некорректный email')
            .not().isEmpty().withMessage('Введите email')
            .custom(async (value, {req}) => {
                let subscriber = await models.subscribers.findOne({where: {email: req.body.email}});
                if (subscriber) {
                    return Promise.reject(
                        'Данный email уже подписан на рассылку.'
                    );
                }
            }),
    ],
    homeController.subscribe);
homeRouter.get("/payment-delivery", homeController.paymentDelivery);
homeRouter.get("/aromats-selection", homeController.aromatsSelection);
homeRouter.get("/promo", homeController.promoProducts);

homeRouter.post("/contact", homeController.sendContactMessage);
homeRouter.get("/offer", homeController.offer);

homeRouter.get("/page/:slug", async function(req,res){
    let slug = req.params.slug;
    let page = await models.static_page.findOne({where:{slug:slug}});
    res.locals.breadcrumbs.push({'label': page.name, 'as_h1':true});
    return res.render("page.hbs", {
        pageTitle: page.title,
        page: page
    })
});



module.exports = homeRouter;
