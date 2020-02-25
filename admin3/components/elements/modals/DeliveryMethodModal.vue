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
            <v-card :loading="!delivery_method">
                <template v-if="delivery_method">
                    <v-card-title class="headline">
                        Редактирование метода доставки {{delivery_method.label |lowercase}}
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-xl>

                            <v-layout row>
                                <v-flex md6>
                                    <v-text-field
                                            label="Системное имя"
                                            v-model="delivery_method.delivery_method_name"
                                            outlined
                                    ></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                    <v-text-field
                                            label="Название"
                                            v-model="delivery_method.label"
                                            outlined
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                            <h4>Доступные методы оплаты</h4>

                            <v-list>
                                <v-list-item-group color="primary">
                                    <v-list-item
                                            v-for="(item, i) in delivery_method.payment_methods"
                                            :key="i">
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                    {{item.payment_method_name}}
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <delivery-payment-methods-picker-modal :target_id="delivery_method.id"
                                                                           :this_delivery_payments="delivery_method.payment_methods">
                                        <v-btn color="blue" dark class="my-2">Выбрать методы оплаты</v-btn>
                                    </delivery-payment-methods-picker-modal>


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
    import DeliveryPaymentMethodsPickerModal from "./DeliveryPaymentMethodsPickerModal";

    export default {
        components: {DeliveryPaymentMethodsPickerModal},
        name: "DeliveryMethodModal",
        props: ['delivery_method_id'],
        data() {
            return {
                dialog: false,
                delivery_method: null
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
                this.delivery_method = await this.$axios.$get(`/api/shop/get-delivery-method?delivery_method_id=${this.$props.delivery_method_id}`);
                console.log(this.delivery_method);
            },
            async save() {
                await this.$axios.$put(`/api/shop/delivery-methods?delivery_method_id=${this.$props.delivery_method_id}`, this.delivery_method);
                this.$emit('refresh');
            }
        },
        filters: {
            lowercase: function (value) {
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
