'use strict';
const Sequelize = require('sequelize');
let models = require('../orm');


module.exports = function (sequelize, DataTypes) {
    let PromocodeUsers = sequelize.define('promocode_users', {
        promocode_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
        }
    }, {
        timestamps: false,
        tableName: 'promocode_users'
    });

    PromocodeUsers.associate = function (models) {
        // models.promocode_users.hasMany(models.users, {
        //     foreignKey: 'id',
        //     targetKey: 'user_id'
        // });

        // models.promocode_users.hasMany(models.promocodes, {
        //     foreignKey: 'id',
        //     targetKey: 'promocode_id'
        // });

        // models.promocode_users.hasOne(models.users, {
        //     foreignKey: 'user_id',
        // });
        //
        // models.promocode_users.hasOne(models.promocodes, {
        //     foreignKey: 'promocode_id',
        // });

    };


    return PromocodeUsers;
};
