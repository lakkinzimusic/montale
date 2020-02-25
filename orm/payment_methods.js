/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    let PaymentMethods = sequelize.define('payment_methods', {
            id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            payment_method_name: {
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
            tableName: 'payment_methods',
            getterMethods: {
                getDeliveryMethods: async function () {
                    let models = require('../orm');
                    let ids = [];
                    let delivery_id = await models.delivery_payment.findAll({
                        attributes: ['delivery_method_id'],
                        where: {payment_method_id: this.get('id')},
                        raw: true,
                    });
                    delivery_id.map(id => ids.push(id.delivery_method_id));
                    return await models.delivery_methods.findAll({where: {id: ids}});
                }
            }
        });

    PaymentMethods.prototype.getAvailableDeliveryMethods = async function () {
        this.delivery_methods = await this.getDeliveryMethods;
    };
    // PaymentMethods.prototype.getAvailablePaymentsMethods = async function()  {
    //     this.payments_methods = await this.getPaymentsMethods;
    // };
    //
    // PaymentMethods.associate = function (models) {
    //     models.payment_methods.belongsTo(models.orders, {
    //         foreignKey: 'delivery_method_name',
    //     });
    //
    // };
    return PaymentMethods;
};
