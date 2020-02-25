/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    let AromatsFavourites = sequelize.define('aromats_favourites', {
        user_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        },
        aromat_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        }
    }, {
        timestamps: false,
        tableName: 'aromats_favourites'
    });

    AromatsFavourites.associate = function(models) {
        models.aromats_favourites.belongsTo(models.categories, {foreignKey:'aromat_id', sourceKey: 'aromat_id'});
    };
    return AromatsFavourites;
};
