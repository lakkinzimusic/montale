const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const Product = require('../models/productModel');
const Favourite = require('../models/favouriteModel');
const Categories = require('../models/categoriesModel');
const FavouriteService = require('../services/favouriteService');
const PromoService = require('../services/promoService');
const RatingService = require('../services/ratingService');
const OrderService = require('../services/orderService');
const models = require('../orm');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


module.exports = class ProductService {


    static async setBoxAttributes(allProducts, req) {
        let productsWithProperties = {};

        //Устанавливаем акции для КАЖДОГО ТОВАРА В АРОМАТЕ
        productsWithProperties = await PromoService.setPromo(allProducts);

        if (req.session.user) {    // Если user зареган -устанавливаем АРОМАТ как любимый.
            let user_id = req.session.user.id;
            productsWithProperties = await FavouriteService.setFavourite(productsWithProperties, req, user_id);
        }

        //Устанавливаем рейтинг АРОМАТУ
        productsWithProperties = await RatingService.setRating(productsWithProperties, req);
        return productsWithProperties;
    }

    static async productBoxSorting(allProducts) {
        let allProductsId = [];
        let products_containers = {};
        let allAromatsId = [];


        //Получаем необходимые ID для получения категорий
        allProducts.forEach((elem, index) => {
            if (elem.product_id) allProductsId.push(elem.product_id);
            else allProductsId.push(elem.id)
        });
// console.log(allProductsId);
        let products_aromats = await Categories.getNecessaryCategories(allProductsId);
        products_aromats = products_aromats[0];

        //Получаем ID ароматов для получения необходимых ID товаров
        products_aromats.forEach((aromat, i) => {
            allAromatsId.push(aromat.category_id)
        });

        let necessaryProductsId = await Categories.getNecessaryProductId(allAromatsId);
        necessaryProductsId = necessaryProductsId[0];

        //Переопределяем категории с ДУХИ на нужный АРОМАТ
        allProducts.forEach((product, i) => {
            necessaryProductsId.forEach((necId, i) => {

                if (product.id === necId.product_id) {
                    product.category_id = necId.category_id;
                }

            });
        });

        //Сортировка по контейнерам, каждому контейнеру присваивается id аромата
        products_aromats.forEach((aromat, i) => {
            products_containers[aromat.category_name] = [];
            products_containers[aromat.category_name].category_id = aromat.category_id;
            allProducts.forEach((product, k) => {
                if (product.category_id === aromat.category_id) {

                    products_containers[aromat.category_name].push(product);

                }
            });
        });

        return products_containers;
    }


    static async setThisAromatAttributes(thisAromat, req) {
        let aromat_id = undefined;
        let properties_id = [];

        //Получаем все id аромата (ароматов)
        for (let aromat in thisAromat) {
            aromat_id = thisAromat[aromat].category_id;
        }

        //Получаем все свойства, которые относятся к этому аромату
        let bd_properties = await Categories.getThisAromatProperties(aromat_id);
        bd_properties = bd_properties[0];
        //Получаем их id
        for (let property in bd_properties) {
            properties_id.push(bd_properties[property].property_id);
        }
        //Получаем все значения этих свойств
        let bd_properties_values = await Categories.getThisAromatPropertiesValues(aromat_id, properties_id);
        bd_properties_values = bd_properties_values[0];

        for (let aromat in thisAromat) {
            thisAromat[aromat].properties = {};  //Формируем объект свойсв в объекте аромата
            for (let attribute in bd_properties) {

                let property_name = bd_properties[attribute].argument_name; //Добавляем аргумент свойсва
                thisAromat[aromat].properties[property_name] = {};
                thisAromat[aromat].properties[property_name].value_name = [];
                thisAromat[aromat].properties[property_name].value_id = [];
                thisAromat[aromat].properties[property_name].argument_id = bd_properties[attribute].property_id;

                for (let attribute_value in bd_properties_values) {
                    //Если id свойсв соответствуют - добавляем информацию в аргумент свойства.
                    if (bd_properties[attribute].property_id === bd_properties_values[attribute_value].property_id) {

                        thisAromat[aromat].properties[property_name].value_name.push(bd_properties_values[attribute_value].value_name);
                        thisAromat[aromat].properties[property_name].value_id.push(bd_properties_values[attribute_value].id);


                    }
                }
            }
        }


        return thisAromat;
    }

    static async getBestsellersOrNewProducts(bestsellers, favourites_prod) {
        // console.log('Best ' + bestsellers);

        let categories = [];
        // console.log(request.favourites_products);
        // let fav = res.locals.favourites_products;

        let aromats = await models.aromats_properties_connect.findAll({
            where: {property_id: bestsellers},
            context: 'some'
        });
        if(bestsellers === 10){
         console.log(aromats)
        }
        // console.log(aromats)
        for (let i = 0; i < aromats.length; i++) {
            let category = await models.categories.findOne({
                where: {id: aromats[i].aromat_id},
                context: {favourites_products: favourites_prod}
            });
            categories.push(category)
        }

        let requests = categories.map((el) => {
            return new Promise(async (resolve) => {
                if(el) await el.initProducts();
                return resolve();
            });
        });
        await Promise.all(requests);



        return categories.filter(function(el){
            return el !== null;
        });
    }

    static async setKitProp(allProducts) {
        allProducts.forEach((product) => {
            if (product.id === 1 || product.id === 2) {
                container[product.product_name] = []
            }
        });
        allProducts.forEach((product) => {
            if ('Набор миниатюр' in container && product.id !== 1 || product.id !== 2) {
                container['Набор миниатюр'].push(product);
            }
            if ('Ваша маленькая шкатулка сокровищ' in container && product.id !== 1 || product.id !== 2) {
                container['Ваша маленькая шкатулка сокровищ'].push(product);
            }
        });
        return container;
    }

    static async setKitBoxes(allProducts) {
        let container = {};
        allProducts.forEach((product) => {
            if (product.id === 1 || product.id === 2) {
                container[product.product_name] = [];
                container[product.product_name].products = [];

                container[product.product_name].kit_id = product.id;
                container[product.product_name].image_url = product.imageURL;
                container[product.product_name].description = product.description;
                container[product.product_name].price = product.price;
            }
        });
        allProducts.forEach((product) => {
            if ('Набор миниатюр' in container && product.id !== 1 || product.id !== 2) {
                container['Набор миниатюр'].products.push(product);
            }
            // if('Ваша маленькая шкатулка сокровищ' in container && product.id !== 1 || product.id !== 2 ){
            //     container['Ваша маленькая шкатулка сокровищ'].products.push(product);
            // }
        });
        return container;
    }

    static async getProductsId(allProducts) {
        let allProductsId = [];
        for (let i = 0; i < allProducts.length; i++) {
            allProductsId.push(allProducts[i].id);
        }
        return allProductsId;
    }

    static async setCartItemsAttribures(cartItems) {
        let allProductsId = [];
        cartItems.forEach((product) => {       //достаём все id из массива
            allProductsId.push(product.id);
        });

        let cartProducts = await PromoService.setPromoInProducts(cartItems);    //устанавливаем акции для каждого продукта
        let aromats = await Categories.getNecessaryCategories(allProductsId);   //получаем ароматы из связки - категория-продукт
        let productType = await Categories.getProductType(allProductsId);       //получаем типы продуктов из связки категория-продукт
        aromats = aromats[0];
        productType = productType[0];


        cartProducts.forEach((product) => {              //присвоение свойсв каждому товару
            aromats.forEach((aromat) => {

                if (product.id === aromat.product_id) {
                    product.aromatName = aromat.category_name;
                    product.aromatId = aromat.category_id;
                    product.fullName = aromat.category_name + " " + product.product_name;
                }
            });
            productType.forEach((type) => {
                if (product.id === type.product_id) {
                    product.type = type.category_name;
                    product.typeId = type.category_id;
                }
            });
        });

        return cartProducts;
    }

    static async getCategoriesByParams(params /*[param_id,param_id]*/, type_sort, order, favourites_prod) {

        if (type_sort === undefined) type_sort = 'category_name';
        if (order === undefined) order = 'ASC';
        console.log(1);
        if (params === undefined) {
            return await models.categories.findAll({
                order: [[type_sort, order]],
                context: {favourites_products: favourites_prod},
                include: {model: models.aromats_properties_connect},
            });
        }
        console.log(2);
        return await models.categories.findAll({
            context: {favourites_products: favourites_prod},
            order: [[type_sort, order]],
            include:
                [{
                    model: models.aromats_properties_connect,
                    where: {
                        value_id: params
                    }
                }],
        });

    }


    static async selectAromat(req, res) {
        let array_aromats_id = [];
        // 1. Получаем все продукты, которые покупал пользователь и любимые
        let orders = await OrderService.getAllOrdersItems(req);
        let favourites = res.locals.favourites_products;


        //добавляем все id в отдельный массив
        orders.forEach((order) => {
            order.order_items.forEach((product) => {
                array_aromats_id.push(product.product.products_category.category.id)
            })
        });
        favourites.forEach((favourite) => {
            array_aromats_id.push(favourite.aromat_id);
        });


        let result = {};
//ищем, что больше всего покупал юзер
        array_aromats_id.forEach(function (a) {
            if (result[a] != undefined)
                ++result[a];
            else
                result[a] = 1;
        });
        let needed_id = [];
        let maxQ = 0;
        let count_of_sampling = 2;
        for (let i = 0; i < count_of_sampling; i++) {
            for (let key in result) {
                if (result[key] > maxQ) {
                    maxQ = key;
                }
            }
            delete result[maxQ];
            needed_id.push(parseInt(maxQ));
            maxQ = 0;
        }

        // Ищем все связки aromats_recommended и aromats_similar
        let aromats_recommended = await models.aromats_recommended.findAll({
            where: {aromat_id: needed_id}
        });
        let aromats_similar = await models.aromats_similar.findAll({
            where: {aromat_id: needed_id}
        });
        aromats_recommended.forEach((aromat) => {
            needed_id.push(aromat.aromat_recommended_id)
        });
        aromats_similar.forEach((aromat) => {
            needed_id.push(aromat.aromat_similar_id)
        });
        needed_id = needed_id.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
        });


        // Выбираем несколько продуктов

        let category = await models.categories.findAll({
            where: {id: needed_id},
            context: {favourites_products: res.locals.favourites_products}
        });


        let requests = category.map((el) => {
            return new Promise(async (resolve) => {
                await el.initProducts();
                return resolve();
            });
        });
        await Promise.all(requests);
        return category;
    }

};
