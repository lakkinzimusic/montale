const {validationResult} = require('express-validator');
const crypto = require('crypto');
const models = require("../orm");
const bcrypt = require('bcryptjs');
const Op = require('sequelize').Op;


module.exports = class AuthService {

    static dateFormating(date) {
    let days = date.substring(0, 2);
    let mounths = date.substring(3, 5);
    let years = date.substring(6);
    return years + '-' + mounths + '-' + days;
    }

    static async generateToken() {
        const buffer = await new Promise((resolve, reject) => {
            crypto.randomBytes(256, function (ex, buffer) {
                if (ex) {
                    reject("error generating token");
                }
                resolve(buffer);
            });
        });
        const token = crypto
            .createHash("sha1")
            .update(buffer)
            .digest("hex");
        return token;
    }

    static async loadUserByCredentials(login, password) {
        if (!login || !password) return false;
        let user = await models.users.findOne(
            {
                where:
                    {
                        [Op.or]:
                            [
                                {email: {[Op.eq]: login}},
                                {username: {[Op.eq]: login}},
                            ]
                    }
            }
        );
        if (!user) return false;
        let passwordCorrect = await bcrypt.compare(password, user.password);
        if (!passwordCorrect) return false;
        else return user;
    }

    static checkValidator(req, res) {
        //finding endpoynt of route
        let endpoynt = req.route.path.split('/');
        endpoynt = endpoynt[endpoynt.length - 1];


        //check validate errors
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            console.log(req.body.password);
            return res.status(422).render(
                //check endpoynt;
                endpoynt === 'signup' ? 'auth/signup' : 'auth/login',
                {
                    errorMessages: errors.array(),

                    oldInput: {
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password,
                        login: req.body.login,
                        birthday: req.body.birthday,
                        firstname: req.body.firstname,
                        surname: req.body.surname,
                    },
                    validationErrors: errors.array()
                });
        }
        //if not errors - return ok;
        return 'ok';
    }


    static updateValidator(req, res) {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send(
                {
                    errorMessages: errors.array(),

                    oldInput: {
                        username: req.body.username,
                        firstname: req.body.firstname,
                        surname: req.body.surname,
                        sex: req.body.sex,
                        country: req.body.country,
                        birthday: req.body.birthday,
                        email: req.body.email,
                        password: req.body.password,
                        phone: req.body.phone,
                    },
                    validationErrors: errors.array()
                });
        }
        return 'ok';
    }
};
