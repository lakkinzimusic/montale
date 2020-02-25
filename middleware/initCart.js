const service = require('../services/cartService');
module.exports = async function(req, res, next){
    let cart = await service.getCart(req);
    req.session.cart = cart;
    res.locals.cart = req.session.cart;
    next();
};
