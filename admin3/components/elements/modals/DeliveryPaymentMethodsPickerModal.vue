<template>
    <div>
        <div id="link" @click.stop="dialog = true">
            <slot>
                <v-btn>Выбрать</v-btn>
            </slot>
        </div>
        <v-dialog
                v-model="dialog"
                max-width="40vw"
        >
            <v-card>
                <v-card-text>
                    <v-container fluid>
                        <v-layout row>
                            <v-flex>
                                <v-list>
                                    <v-subheader>Все существующие методы оплаты</v-subheader>
                                    <v-list-item-group v-model="chosen_payment" color="primary">
                                        <v-list-item
                                                :disabled="paymentMethodExists(item.id)"
                                                v-for="(item, i) in payment_methods"
                                                :key="i"
                                                @click="appendPaymentMethod(item)"
                                        >
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    {{item.label}}
                                                    <i class="fas fa-caret-right"></i>
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list-item-group>
                                </v-list>
                                <div class=" mt-3">
                                    <v-pagination
                                            v-model="page"
                                            :length="parseInt((count / 20).toFixed(0))"
                                            prev-icon="fas fa-caret-left"
                                            next-icon="fas fa-caret-right"
                                            color="green"
                                    ></v-pagination>
                                </div>
                            </v-flex>
                            <v-divider vertical></v-divider>
                            <v-flex md4>
                                <v-list>
                                    <v-subheader>Выбранные методы оплаты</v-subheader>
                                    <v-list-item-group color="primary">
                                        <v-list-item
                                                v-for="(item, i) in this_delivery_payments"
                                                :key="i"
                                                @click="removeCategory(item)"
                                        >
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    {{item.label}}
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list-item-group>
                                </v-list>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: "DeliveryPaymentMethodsPickerModal",
        props: ['this_delivery_payments', 'target_id', 'from_name', 'to_name', 'obj_name'],
        data() {
            return {
                dialog: false,
                payment_methods: [],
                count: 0,
                page: 1,
                chosen_payment: null,
            }
        },
        methods: {
            async loadPage(page) {
                let data = await this.$axios.$get(`/api/shop/payment-methods?page=${page}`);
                this.count = data.count;
                this.payment_methods = data.rows; //all payment methods
                console.log(this.this_delivery_payments); //payment methods of this shippig method
                console.log(this.target_id); //id of this delivery method
            },
            appendPaymentMethod(method) {
                this.this_delivery_payments.push(method);
            },
            removeCategory(method) {
                let that = this;
                let index = this.this_delivery_payments.findIndex(item => item.id === method.id);
                if (index < 0) return true;
                this.this_delivery_payments.splice(index, 1);
            },
            paymentMethodExists(id) {
                let that = this;
                return this.this_delivery_payments.some(item => item.id === id)
            }
        },
        mounted() {
            this.loadPage(this.page);
            this.baseUrl = process.env.apiUrl;
        },
        watch: {
            page: function (val) {
                this.loadPage(val);
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
