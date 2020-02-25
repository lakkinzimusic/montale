/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    let AromatsRecommended = sequelize.define('aromats_recommended', {
        aromat_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        aromat_recommended_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        }
    }, {
        tableName: 'aromats_recommended',
        timestamps: false,
    });

    AromatsRecommended.associate = function (models) {
        models.aromats_recommended.hasMany(models.categories, {
            foreignKey: 'id',
            targetKey: 'aromat_id'
        });

        models.aromats_recommended.hasOne(models.categories, {
            foreignKey: 'id',
            sourceKey: 'aromat_recommended_id',
            as: "recommendation"
        });
    };

    return AromatsRecommended;
};
