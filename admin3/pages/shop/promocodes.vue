<template>
    <div class="w-100 fill-height">
        <div class="w-100 popout">
            <v-app-bar
                    color="green"
                    dark
            >
                <v-toolbar-title>Управление промокодами</v-toolbar-title>

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
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-app-bar>
        </div>

        <v-container :fill-height="true" d-block align-start fluid class="px-0">
            <v-btn
                    color="pink"
                    dark
                    small
                    absolute
                    bottom
                    right
                    fab
                    @click.stop="dialog = true"
            >
                <v-icon>fas fa-plus</v-icon>
            </v-btn>
            <v-simple-table class="w-100 popout mt-1">
                <thead>
                <tr>
                    <th></th>
                    <th class="text-left">Код</th>
                    <th class="text-left">Процент скидки</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in promocodes" :key="item.name">

                    <td>{{ item.id }}</td>
                    <td>{{ item.code }}</td>
                    <td>{{ item.discount }} %</td>
                    <td class="text-right">
                    <v-btn color="red" @click.stop="deletePromocode(item)" dark>
                        Удалить
                    </v-btn>
                    </td>
                    <td class="text-right">

                        <promocode-modal :promocode_id="item.id" @refresh="loadPage(page)">
                            <v-btn color="blue" dark>
                                Изменить
                            </v-btn>
                        </promocode-modal>

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


        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title class="headline">Создать промокод</v-card-title>
                <v-card-text>
                    <v-alert v-if="newPromocode.error"
                             border="right"
                             colored-border
                             type="error"
                             elevation="2"
                    >
                        {{newPromocode.error}}
                    </v-alert>
                    <v-container grid-list-xl>
                        <v-layout row>
                            <v-flex md6>
                                <v-text-field
                                        label="Код"
                                        v-model="newPromocode.code"
                                        outlined
                                        hint="Строка"
                                ></v-text-field>
                            </v-flex>
                            <v-flex md6>
                                <v-text-field
                                        label="Скидка"
                                        type="number"
                                        suffix="%"
                                        v-model="newPromocode.discount"
                                        hint="Число"
                                        outlined
                                        :max="100"
                                        :min="0"
                                ></v-text-field>
                            </v-flex>

                        </v-layout>

                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="red" @click="dialog = false">ОТМЕНА</v-btn>
                    <v-btn text color="success" @click="createPromocode()">СОХРАНИТЬ</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


    </div>
</template>

<script>
    import PromocodeModal from "../../components/elements/modals/PromocodeModal";

    export default {
        name: "promocodes",
        components: {PromocodeModal},
        data() {
            return {
                promocodes: [],
                count: 0,
                page: 1,
                dialog: false,
                newPromocode: {}
            }
        },
        methods: {
            async loadPage(page) {
                let data = await this.$axios.$get(`/api/shop/promocodes?page=${page}`);
                this.count = data.count;
                this.promocodes = data.rows;
            },
            async createPromocode() {
                if (!this.newPromocode.code) {
                    this.$set(this.newPromocode, 'error', 'Необходимо ввести код');
                }
                if (!this.newPromocode.discount) {
                    this.$set(this.newPromocode, 'error', 'Необходимо ввести процент скидки');
                }
                else {
                    let newObject = await this.$axios.$post(`/api/shop/promocodes/`, this.newPromocode);
                    this.promocodes.push(newObject);
                    this.newPromocode = {};
                    this.dialog = false;
                }
            },
            async deletePromocode(item) {
                let res = await this.$confirm('Вы уверены, что хотите удалить промокод?',
                    {title: ' Подтвердить действие'}
                );
                if (res) {
                    await this.$axios.$delete(`/api/shop/promocodes/${item.id}`);
                    let index = this.promocodes.findIndex(val => val.id === item.id);
                    if(index >= 0){
                        this.promocodes.splice(index, 1);
                    // this.item = null;
                    }
                }
            },
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
