/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    let DeliveryMethods = sequelize.define('delivery_methods', {
            id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            delivery_method_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            label: {
                type: DataTypes.STRING(255),
                allowNull: false,
            }
        },
        {
            timestamps: false,
            tableName: 'delivery_methods',
            getterMethods: {
                getPaymentMethods: async function () {
                    let models = require('../orm');
                    let ids = [];
                    let payments_id = await models.delivery_payment.findAll({
                        attributes: ['payment_method_id'],
                        where: {delivery_method_id: this.get('id')},
                        raw: true,
                    });
                    payments_id.map(id => ids.push(id.payment_method_id));
                    return await models.payment_methods.findAll({where: {id: ids}});
                }
            }
        });

    DeliveryMethods.prototype.getAvailablePaymentMethods = async function () {
        this.payment_methods = await this.getPaymentMethods;
    };

    //
    // PaymentMethods.associate = function (models) {
    //     models.payment_methods.belongsTo(models.orders, {
    //         foreignKey: 'delivery_method_name',
    //     });
    //
    // };
    return DeliveryMethods;
};
