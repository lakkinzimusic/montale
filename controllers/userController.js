const db = require('../config/db');
const bcrypt = require('bcryptjs');
const User = require("../models/userModel.js");
// const jsonParser = express.json();
const bodyParser = require("body-parser");
// exports.addUser = function (request, response){
//     response.render("create.hbs");
// };

exports.createUser = (req, res) => {

    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    const user = new User(username, email, password);
    user.save();

};


exports.getAllUser = (req, res) => {
    User.getAllUsers().then(([rows]) => {
        res.send(rows)
    })
        .catch(err => console.log(err));
};

exports.getOneUser = (req, res, next) => {
    let id = req.params.id;

    User.getOne(id).then(([rows]) => {
        res.send(rows);
    })
        .catch(err => console.log(err));
};


exports.deleteUser = function (req, res) {
    let id = req.params.id;
    User.delete(id)
};



exports.postUser = function (request, response) {
    const username = request.body.name;
    const userage = request.body.age;
    const user = new User(username, userage);
    user.save();
    response.redirect("/users");
};