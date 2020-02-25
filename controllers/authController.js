const db = require('../config/db');
const User = require("../models/userModel.js");
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {validationResult} = require('express-validator');
const ProductService = require('../services/productService');
const AuthService = require('../services/authService');
const models = require('../orm');
const Op = require('sequelize').Op;
const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: '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'
        }
    })
);


exports.getLogin = (req, res, next) => {
    // let message = req.flash('error');
    // if (message.length > 0) {
    //     message = message[0];
    // } else {
    //     message = null;
    // }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Войти',
        isAuthenticated: false,
        // errorMessage: message,
        // oldInput: {
        //     email: '',
        //     password: ''
        // },
        // validationErrors: []
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Регистрация',
        isAuthenticated: false
    });
};


exports.postLogin = async (req, res, next) => {
    let validResult = AuthService.checkValidator(req, res);
    if (validResult) {
        let user = await AuthService.loadUserByCredentials(req.body.login, req.body.password);

        req.session.isLoggedIn = true;
        res.locals.isAuthenticated = true;
        req.session.user = user;
        req.session.save(err => {
            res.redirect('/');
        });
    }
};

exports.postSignup = async (req, res, next) => {
    let validResult = AuthService.checkValidator(req, res);
    if (validResult) {
        if (req.body.birthday === '') {
            req.body.birthday = new Date();
            req.body.birthday = req.body.birthday.getUTCFullYear() + '-' +
                ('00' + (req.body.birthday.getUTCMonth() + 1)).slice(-2) + '-' +
                ('00' + req.body.birthday.getUTCDate()).slice(-2) + ' ' +
                ('00' + req.body.birthday.getUTCHours()).slice(-2) + ':' +
                ('00' + req.body.birthday.getUTCMinutes()).slice(-2) + ':' +
                ('00' + req.body.birthday.getUTCSeconds()).slice(-2);
        }
        else {
            req.body.birthday = AuthService.dateFormating(req.body.birthday)
        }
        const errors = validationResult(req);
        let hashedPassword = await  bcrypt.hash(req.body.password, 12); //хэшируем
        let request = await models.users.create({   //создаём юзера
            username: req.body.username,
            firstname: req.body.firstname,
            surname: req.body.surname,
            sex: req.body.sex,
            country: 'Россия',
            birthday: req.body.birthday,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,

        });
        let mail = transporter.sendMail({ //отправляем почту
            to: req.body.email,
            from: 'montaleshop@gmail.com',
            subject: 'Регистрация на сайте Montale Parfums',
            html:
            '<img src="https://www.aroma-butik.ru/images/categories/brands/2/montale.jpg" alt="-">' +
            '<h2>Рады сообщить, что Вы успешно зарегистрированы на нашем сайте</h2>' +
            '<h4>Ваш логин: </>' + req.body.username +
            '<h2><a href="http://138.68.125.45">Ссылка для перехода на сайт</a></h2>'
        });

        let user = await AuthService.loadUserByCredentials(req.body.username, req.body.password);
        if(user){
            req.session.isLoggedIn = true;
            res.locals.isAuthenticated = true;
            req.session.user = user;
        }

        return res.redirect('/');
    }
};


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log("session destroyed");
        res.redirect('/');
    });
};


exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Сброс пароля',
    });
};


exports.postReset = async (req, res, next) => {

    let user = await models.users.findOne({where: {email: req.body.email}});  //ищем пользователя по введённогму мэйлу
    if (!user) {   //если не находим пользователя - редирект
        req.flash('error', 'No account with that email found.');
        return res.redirect('/reset');
    }
    const token = await AuthService.generateToken(); //генерируем токен

    let resetTokenExpiration = Date.now() + 3600000; //время истечения действия токена (час)
    let newToken = await models.users.update({
        resetToken: token,
        resetTokenExpiration: resetTokenExpiration
    }, {
        where:
            {
                id: user.id
            }
    });

    transporter.sendMail({  //мэйл со ссылкой-токеном
        to: req.body.email,
        from: 'shop@node-complete.com',
        subject: 'Password reset',
        html: `<img src="https://www.aroma-butik.ru/images/categories/brands/2/montale.jpg" alt="-">` +
        '<h2>Уважаемый клиент!</h2>' +
        `<p>Вы запросили ссылку для смены пароля</p>` +
        `<p>Перейдите по ссылке <a href="http://138.68.125.45/reset/${token}">link</a> .</p>`
    });

    res.redirect('/');


};


exports.getNewPassword = async (req, res, next) => {
    let user = await models.users.findOne({where: {resetToken: req.params.token}});  //получаем юзера по ссылке из письма пользователю

    res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'Установка нового пароля',
        userId: user.id.toString(),
        passwordToken: req.params.token,
    });

};

exports.postNewPassword = async (req, res, next) => {
    let user = await models.users.findOne({
        where: {
            resetToken: req.body.passwordToken, //передаётся из hidden_input
            resetTokenExpiration: {[Op.gt]: Date.now()} //сравнение с текущей датой (дата истечения срока должна быть больше нынешней);
        }
    });
    let hashedPassword = await bcrypt.hash(req.body.password, 12);

    let updatedPassword = await models.users.update({
        resetToken: '',
        resetTokenExpiration: 0,
        password: hashedPassword
    }, {
        where:
            {
                id: user.id
            }
    });
    res.redirect('/login');


};

//$2a$12$MspP4mtjxC31qJogTIvu1u.Es5iPe4qniUCrc
