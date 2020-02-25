/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    let AromatsSimilar = sequelize.define('aromats_similar', {
        aromat_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        aromat_similar_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        }
    }, {
        tableName: 'aromats_similar',
        timestamps: false,
    });

    AromatsSimilar.associate = function (models) {
        models.aromats_similar.hasMany(models.categories, {
            foreignKey: 'id',
            targetKey: 'aromat_id'
        });

        models.aromats_similar.hasOne(models.categories, {
            foreignKey: 'id',
            sourceKey: 'aromat_similar_id',
            as: "similar"
        });
    };

    return AromatsSimilar;
};
