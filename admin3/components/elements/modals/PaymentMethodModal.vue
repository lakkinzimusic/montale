<template>
    <div>
        <div id="link" @click.stop="dialog = true">
            <slot>
                <v-btn>Изменить</v-btn>
            </slot>
        </div>
        <v-dialog
                v-model="dialog"
                max-width="40vw"
        >
            <v-card :loading="!payment_method">
                <template v-if="payment_method">
                    <v-card-title class="headline">
                        Редактирование метода оплаты {{payment_method.label | lowercase }}
                    </v-card-title>

                    <v-card-text>
                        <v-container grid-list-xl>
                        <v-layout row>
                            <v-flex md6>
                                <v-text-field
                                        label="Системное имя"
                                        v-model="payment_method.payment_method_name"
                                        outlined
                                ></v-text-field>
                            </v-flex>
                            <v-flex md6>
                                <v-text-field
                                        label="Название"
                                        v-model="payment_method.label"
                                        outlined
                                ></v-text-field>
                            </v-flex>

                        </v-layout>
                        <h4>Доступные методы доставки</h4>

                        <v-list>
                            <v-list-item-group color="primary">
                                <v-list-item
                                        v-for="(item, i) in payment_method.delivery_methods"
                                        :key="i">
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{item.label}}
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <payment-delivery-methods-picker-modal :target_id="payment_method.id"
                                                                       :this_payments_delivery="payment_method.delivery_methods"
                                >
                                    <v-btn color="blue" dark class="my-2">Выбрать методы оплаты</v-btn>
                                </payment-delivery-methods-picker-modal>


                            </v-list-item-group>
                        </v-list>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                                color="red darken-1"
                                text
                                @click="dialog = false">
                            Отмена
                        </v-btn>

                        <v-btn
                                color="green darken-1"
                                text
                                @click="save(), dialog = false">
                            Сохранить
                        </v-btn>
                    </v-card-actions>
                </template>
                <template v-else>
                    <v-card-text>
                        Загрузка...
                        <v-progress-linear
                                indeterminate
                                color="white"
                                class="mb-0"
                        ></v-progress-linear>
                    </v-card-text>
                </template>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import PaymentDeliveryMethodsPickerModal from "./PaymentDeliveryMethodsPickerModal";

    export default {
        components: {PaymentDeliveryMethodsPickerModal},
        name: "PaymentMethodModal",
        props: ['payment_method_id'],
        data() {
            return {
                dialog: false,
                payment_method: null
            }
        },
        watch: {
            dialog: function (val) {
                if (val === true) {
                    this.load();
                }
            }
        },
        methods: {
            async load() {
                this.payment_method = await this.$axios.$get(`/api/shop/get-payment-method?payment_method_id=${this.$props.payment_method_id}`);
                console.log(this.payment_method);
            },
            async save() {
                await this.$axios.$put(`/api/shop/payment-methods?payment_method_id=${this.$props.payment_method_id}`, this.payment_method);
                this.$emit('refresh');
            }
        },
        filters: {
            lowercase : function (value) {
                if (!value) return '';
                value = value.toString();
                return value.charAt(0).toLowerCase() + value.slice(1)
            }
        }
    }
</script>

<style scoped>
    #link {
        display: inline-block;
        cursor: pointer;
    }
</style>
