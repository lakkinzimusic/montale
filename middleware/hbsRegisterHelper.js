const hbs = require('hbs');
const pluralize = require("handlebars-pluralize");
const moment = require('moment');
moment.locale('ru');
module.exports = async function(req, res, next){

    Number.prototype.pad = function(size) {
        var s = String(this);
        while (s.length < (size || 2)) {s = "0" + s;}
        return s;
    };

    hbs.registerHelper("pluralize", pluralize);
    hbs.registerHelper('checklength', function (v1, v2, options) {
        'use strict';
        if (v1 && v1.length > v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    hbs.registerHelper('json', function(context) {
        return JSON.stringify(context);
    });
    hbs.registerHelper('ifeq', function (a, b, options) {
        if (a == b) {
             return options.fn(this); }
        return options.inverse(this);
    });

    hbs.registerHelper('ifnoteq', function (a, b, options) {

        if (a != b) { return options.fn(this); }
        return options.inverse(this);
    });
    hbs.registerHelper('image', function(url){
        if(!url) return 'images\\2019-06-25T21-01-23.180Z-2019-06-16T19-48-15.776Z-rose-elixir-hair-mist.jpg';
        return url;
    });
    hbs.registerHelper('existInArray', function(arr){
        if(indexOf(arr) >= 0) return true;
        return false;
    });
    hbs.registerHelper('times', function(n, block) {
        var accum = '';
        for(var i = 0; i < n; ++i)
            accum += block.fn(i);
        return accum;
    });
    hbs.registerHelper('for', function(from, to, incr, block) {
        var accum = '';
        for(var i = from; i < to; i += incr)
            accum += block.fn(i);
        return accum;
    });
    hbs.registerHelper('pad', function(num, pad) {
        return parseInt(num).pad(pad);
    });
    hbs.registerHelper('date', function(date, format){
        let datum = !date?new Date():Date.parse(date);
        let m = moment(datum).format(format);
        return m;
    });


    next();

};
