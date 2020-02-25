/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    let DeliveryPayment = sequelize.define('delivery_payment', {
            delivery_method_id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                primaryKey: true,
            },
            payment_method_id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                primaryKey: true,
            },
        },
        {
            timestamps: false,
            tableName: 'delivery_payment',
            getterMethods: {

            }
        });


    return DeliveryPayment;
};
