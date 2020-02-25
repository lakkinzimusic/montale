/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    let AromatsRatings = sequelize.define('aromats_rating', {
        aromat_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        updated_at: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        approved: {
            type: DataTypes.INTEGER(1),
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'aromats_rating'
    });

    AromatsRatings.associate = function (models) {
        models.aromats_rating.hasOne(models.users, {foreignKey: 'id', sourceKey: 'user_id'});
        models.aromats_rating.hasOne(models.categories, {foreignKey: 'id', sourceKey: 'aromat_id'})
    };

    return AromatsRatings;
};