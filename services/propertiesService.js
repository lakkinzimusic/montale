const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const Product = require('../models/productModel');
let models = require('../orm');
module.exports = class PropertiesService {

    static async getAllPropertiesValues() {

        let property_name = '';
        let properties = {};



        // console.log('*********' + JSON.stringify(prop )+ '************');
        // console.log(prop );


       let bd_properties = await Product.getAllProperties();
        bd_properties = bd_properties[0];
        let bd_properties_values = await Product.getAllPropertiesValues();
        bd_properties_values = bd_properties_values[0];
        for (let i = 0; i < bd_properties.length; i++) {
            property_name = bd_properties[i].argument_name;

            properties[property_name] = {};
            properties[property_name].value_name = [];
            properties[property_name].value_id = [];
            properties[property_name].argument_id = bd_properties[i].id;

            for (let k = 0; k < bd_properties_values.length; k++) {

                if (bd_properties_values[k].property_id === bd_properties[i].id) {
                    properties[property_name].value_name.push(bd_properties_values[k].value_name);
                    properties[property_name].value_id.push(bd_properties_values[k].id);
                }

            }

        }
        return prop;
    }


};
