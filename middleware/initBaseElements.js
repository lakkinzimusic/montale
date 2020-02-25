const models = require('../orm');
const FavouritesServise = require('../services/favouriteService');
module.exports = async function (req, res, next) {
    let collections = await models.collections.findAll();
    res.locals.collections = collections;

    let aromats_properties = await models.aromats_properties.findAll({
        include: [
            {model: models.aromats_properties_values}
        ]
    });
    res.locals.aromats_properties = aromats_properties;
    // console.log(   res.locals.aromats_properties);
    if(req.session.isLoggedIn && res.locals.favourites_products === undefined){
        res.locals.favourites_products = await FavouritesServise.getFavourites(req);
    }


    // if(req.session.isLoggedIn){
    //
    //     let favourites_products = await models.aromats_favourites.findAll({
    //         where: {user_id: req.session.user.id},
    //         attributes: ['aromat_id'],
    //     });
    //     if (favourites_products){
    //         res.locals.favourites_products = favourites_products.map(aromat => aromat.aromat_id);
    //            // console.log(res.locals.favourites_products);
    //         // console.log("favourite_aromats_of_user: " +  res.locals.favourites_products);
    //     }
    // }

    next();
};


