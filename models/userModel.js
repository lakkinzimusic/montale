const db = require('../config/db');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');


module.exports = class Users {

    constructor(username,firstname, surname, sex, country, birthday, email, password) {
        this.username = username;
        this.firstname = firstname;
        this.surname = surname;
        this.sex = sex;
        this.country = country;
        this.birthday = birthday;
        this.email = email;
        this.password = password;
    }

    static getAllUsers(){
        return  db.execute("SELECT *, DATE_FORMAT(birthday, '%d.%m.%Y') as birthday FROM users");
    }


    validatePassword = function (password, user ) {
        const existingHash = user[0].password;
        console.log(existingHash);
        // console.log(existingHash);
        const bool = bcrypt.compareSync(password, existingHash);
        return bool;
    };


    static getOne(id) {
        this.id = id;
        return db.execute("SELECT *, DATE_FORMAT(birthday, '%d.%m.%Y') as birthday FROM users WHERE id=?", [this.id]);
    }

    save() {
        return db.execute(
            'INSERT INTO users (username, firstname, surname, sex, country, birthday, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [this.username,  this.firstname, this.surname,  this.sex,   this.country,   this.birthday,
            this.email,  this.password]
        );
    }
    static delete(id){
        this.id = id;
        return db.execute("DELETE FROM users WHERE id=?", [this.id]);
    }
    static update(id, username, email, password, firstname, birthday,country, sex){
        const sql = "UPDATE users SET " +
            "username=?, email=?, password=?, firstname=?, birthday=?, country=?, sex=? " +
            "WHERE id=?";
        const data = [username, email, password, firstname, birthday,country, sex, id];
        return db.execute(sql, data)
    }


    static updateToken(resetToken, resetTokenExpiration, id){
            const sql = "UPDATE users SET resetToken=?, resetTokenExpiration=? WHERE id=?";
        const data = [resetToken, resetTokenExpiration, id];
        return db.execute(sql, data)
    }
    static updatePassword(resetToken, resetTokenExpiration, password, userId){
        const sql = "UPDATE users SET resetToken=?, resetTokenExpiration=?, password=? WHERE id=?";
        const data = [resetToken, resetTokenExpiration, password, userId];
        console.log(data);
        return db.execute(sql, data)
    }

  static  createUser(username, email, password) {
        const sql = "INSERT INTO users(username, email, password) VALUES(?, ? ,?)";
      return  db.execute(sql, [username,email, password])
    }

    static findOneEmail(email) {
        return db.execute(`SELECT *, DATE_FORMAT(birthday, '%Y-%m-%d') as birthday FROM users WHERE email=?`, [email]);
    }
    static findOneToken(resetToken, resetTokenExpiration) {
        return db.execute(`SELECT *, FROM users WHERE resetToken = ? AND resetTokenExpiration > ?`, [resetToken, resetTokenExpiration]);
    }







};