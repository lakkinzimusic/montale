const express = require("express");
const {body} = require('express-validator');
const accountController = require("../controllers/accountController.js");
const userController = require("../controllers/userController.js");
const accountRouter = express.Router();
const models = require("../orm");

accountRouter.get("/", accountController.getAccount);
accountRouter.get("/favourites", accountController.getFavourites);
accountRouter.get("/orders", accountController.getOrders);
accountRouter.get("/orders/:id", accountController.getOrders);
accountRouter.post("/update/:id",
    [
        body('username').not().isEmpty().withMessage('Имя пользователя должно быть заполнено'),
        body('email')
            .isEmail()
            .withMessage('Некорректный email.')
            .custom(async (value, {req}) => {
                let existUser = await models.users.findOne({where: {id: req.session.user.id}});
                if (req.body.email !== existUser.email) {
                   let user = await models.users.findOne({where: {email: req.body.email}});
                    if (user) {
                        return Promise.reject(
                            'Данный email уже используется.'
                        );
                    }
                }

            }),
        body('password', 'Некорректный пароль.')
            .custom(async (value, {req}) => {
                if(!value || value.length <= 0){
                    return true;
                } else {
                    if(value.length <= 5){
                        return Promise.reject(
                            'Пароль должен быть не короче 6 символов.'
                        );
                    }
                }
            })
    ],

    accountController.updateUser);
module.exports = accountRouter;

