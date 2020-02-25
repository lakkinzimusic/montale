/* jshint indent: 2 */
var slugify = require('slugify');

module.exports = function(sequelize, DataTypes) {
    let StaticPage = sequelize.define('static_page', {
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        slug: {
            type: DataTypes.STRING(255),
        },
        content: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
        },
        meta: {
            type: DataTypes.JSON,
        }
    }, {
        tableName: 'static_page',
        timestamps: true,
        hooks: {
            beforeCreate(attributes, options) {
                attributes.slug = slugify(attributes.name, {lower: true});
            }
        }
    });

    return StaticPage;
};
