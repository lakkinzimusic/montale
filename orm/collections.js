/* jshint indent: 2 */
var slugify = require('slugify');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('collections', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
          collection_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
    },
    content: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'collections',
    timestamps: false,
    getterMethods: {
      categories: function(){
        let models  = require('../orm');
        let options = {context: {some: 'some'}};
        options.include = [
          {
            model: models.aromats_collections,
            attributes: [],
            where: {
              collection_id: this.get('id')
            },
            context: {some: 'some'}
          }

        ];
        return models.categories.findAll(options);
      }
    },
    hooks:{
      beforeCreate(attributes, options) {
        attributes.slug = slugify(attributes.collection_name, {lower: true});
      }
    }
  });
};
