const express = require("express");
const {body} = require('express-validator');
const authController = require("../controllers/authController.js");
const authService = require("../services/authService.js");

const authRouter = express.Router();
const models = require("../orm");
authRouter.get('/login', authController.getLogin);
authRouter.get('/signup', authController.getSignup);
authRouter.post('/login',
    [
        body('password', 'Некорректный пароль.')
            .isLength({min: 6}).withMessage('Длина пароля должна превышать 6 символов'),
        body('emailOrLogin')
            .custom(async (value, {req}) => {
                //check user exist
                let user = await authService.loadUserByCredentials(req.body.login, req.body.password);
                if (!user) {
                    return Promise.reject(
                        'Неверные логин или пароль'
                    );
                }
            })

    ],
    authController.postLogin
);


authRouter.post('/signup',
    [
        body('username')
            .not()
            .isEmpty()
            .withMessage('Имя пользователя должно быть заполнено')
            .custom(async (value, {req}) => {
                let user = await models.users.findOne({where: {username: req.body.username}});
                if (user) {
                    return Promise.reject(
                        'Данный логин уже используется.'
                    );
                }
            }),
        body('email')
            .isEmail()
            .withMessage('Некорректный email.')
            .custom(async (value, {req}) => {
                let user = await models.users.findOne({where: {email: req.body.email}});
                if (user) {
                    return Promise.reject(
                        'Данный email уже используется.'
                    );
                }
            }),
        body('password', 'Некорректный пароль.')
            .isLength({min: 6}).withMessage('Пароль должен быть не короче 6 символов.')
    ],
    authController.postSignup
)
;

authRouter.post('/logout', authController.postLogout);
authRouter.get('/logout', authController.postLogout);

authRouter.get('/reset', authController.getReset);
authRouter.post('/reset', authController.postReset);
authRouter.get('/reset/:token', authController.getNewPassword);
authRouter.post('/new-password', authController.postNewPassword);
module.exports = authRouter;
