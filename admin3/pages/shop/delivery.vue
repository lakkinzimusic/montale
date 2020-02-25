<template>
    <div class="w-100 fill-height">
        <div class="w-100 popout">
            <v-app-bar
                    color="green"
                    dark
            >
                <v-toolbar-title>Управление способами доставки</v-toolbar-title>

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
                            <v-list-item-title>Создать способ доставки</v-list-item-title>
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
                <tr v-for="item in delivery_methods" :key="item.name">

                    <td>{{ item.id }}</td>
                    <td>{{ item.label }}</td>
                    <td>{{ item.delivery_method_name }}</td>
                    <td>
                        <span v-for="el in item.payment_methods" :key="el.payment_method_name">
                            {{ el.payment_method_name + ', '}}
                        </span>
                    </td>
                    <td class="text-right">
                    <delivery-method-modal :delivery_method_id="item.id" @refresh="loadPage(page)">
                        <v-btn color="blue" dark>
                            Изменить
                        </v-btn>
                    </delivery-method-modal>
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
    import DeliveryMethodModal from "../../components/elements/modals/DeliveryMethodModal";

    export default {
        components: {DeliveryMethodModal},
        name: "delivery",
        data() {
            return {
                delivery_methods: [],
                count: 0,
                page: 1,
            }
        },
        methods: {
            async loadPage(page) {
                let data = await this.$axios.$get(`/api/shop/delivery-methods?page=${page}`);
                this.count = data.count;
                this.delivery_methods = data.rows;
                console.log( data.rows);
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
