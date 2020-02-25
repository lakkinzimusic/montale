<template>
    <div class="w-100 fill-height">
        <div class="w-100 popout">
            <v-app-bar
                    color="green"
                    dark
            >
                <v-toolbar-title>Управление способами оплаты</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-menu
                        left
                        bottom
                >
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                            <v-icon>fas fa-ellipsis-v</v-icon>
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item>
                            <v-list-item-title>Создать способ оплаты</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-app-bar>
        </div>
        <v-container :fill-height="true" d-block align-start fluid class="px-0">
            <v-simple-table class="w-100 popout mt-1">
                <thead>
                <tr>
                    <th></th>
                    <th class="text-left">Название</th>
                    <th class="text-left">Системное название</th>
                    <th class="text-left">Возможные методы доставки</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in payment_methods" :key="item.name">

                    <td>{{ item.id }}</td>
                    <td>{{ item.label }}</td>
                    <td>{{ item.payment_method_name }}</td>
                    <td>
                        <span v-for="el in item.delivery_methods" :key="el.delivery_method_name">
                            {{ el.delivery_method_name + ', '}}
                        </span>
                    </td>
                    <td class="text-right">
                        <payment-method-modal :payment_method_id="item.id" @refresh="loadPage(page)">
                            <v-btn color="blue" dark>
                                Изменить
                            </v-btn>
                        </payment-method-modal>
                    </td>
                </tr>
                </tbody>
            </v-simple-table>

            <div class=" mt-3">
                <v-pagination
                        v-model="page"
                        :length="parseInt((count / 20).toFixed(0))"
                        prev-icon="fas fa-caret-left"
                        next-icon="fas fa-caret-right"

                ></v-pagination>
            </div>
        </v-container>
    </div>
</template>

<script>
    import PaymentMethodModal from "../../components/elements/modals/PaymentMethodModal";

    export default {
        components: {PaymentMethodModal},
        name: "payment",
        data() {
            return {
                payment_methods: [],
                count: 0,
                page: 1,
            }
        },
        methods: {
            async loadPage(page) {
                let data = await this.$axios.$get(`/api/shop/payment-methods?page=${page}`);
                this.count = data.count;
                this.payment_methods = data.rows;
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

</style>
