<template>
    <div class="w-100 fill-height">
        <div class="w-100 popout">
            <v-app-bar
                    color="blue"
                    dark
            >
                <v-toolbar-title>Управление отзывами о товарах</v-toolbar-title>

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
                </v-menu>
            </v-app-bar>
        </div>
        <v-container :fill-height="true" d-block align-start fluid class="px-0">
            <v-simple-table class="w-100 popout mt-1">
                <thead>
                <tr>
                    <th></th>
                    <th class="text-left">ID аромата</th>
                    <th class="text-left">Наименование аромата</th>
                    <th class="text-left">ID пользователя</th>
                    <th class="text-left">Имя пользователя</th>
                    <th class="text-left">Текст</th>
                    <th class="text-left">Количество звёзд</th>
                    <th class="text-left">Дата создания</th>
                    <th class="text-left">Дата обновления</th>
                    <th class="text-left">Допущен к публикации</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in ratings" :key="item.name">
                    <td style="padding: 5px" class="text-center">
                        <img style="max-width: 50px" v-if="item.category.image_url" :src="`${baseUrl}/${item.image_url}`">
                    </td>
                    <td>{{ item.category.id }}</td>
                    <td>{{ item.category.category_name }}</td>
                    <td>{{ item.user.id}}</td>
                    <td>{{ item.user.username }}</td>
                    <td>{{ item.comment }}</td>
                    <td>{{ item.rating }}</td>
                    <td>{{ item.created_at }}</td>
                    <td>{{ item.updated_at }}</td>
                    <td><v-switch v-model="item.approved" label="Отобразить комментарий" @click="approvedChange( item.approved, item.category.id , item.user.id )"></v-switch></td>

                    <td class="text-right">
                        <rating-modal :aromat_id="item.category.id" :user_id="item.user.id">
                            <v-btn color="blue" dark>
                                Изменить
                            </v-btn>
                        </rating-modal>
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
    import RatingModal from "../../components/elements/modals/RatingModal";
    export default {
        name: "products-ratings",
        components: {RatingModal},
        data() {
            return {
                ratings: [],
                count: 0,
                page: 1,
            }
        },
        methods: {
            async loadPage(page) {
                let data = await this.$axios.$get(`/api/catalog/aromats-ratings?page=${page}`);
                this.count = data.count;
                this.ratings = data.rows;
                console.log(this.ratings);
                // debugger
            },
            async approvedChange(approved_value, aromat_id, user_id){
               let props = {
                    approved_value: approved_value,
                    aromat_id: aromat_id,
                    user_id: user_id,
                };
                console.log(props);
                await this.$axios.$put(`/api/catalog/aromats-ratings/approved-change`, props);
            }
        },
        mounted() {
            this.loadPage(this.page);
            this.baseUrl = process.env.apiUrl;
        },
        watch:{
            page: function(val){
                this.loadPage(val);
            }
        }
    }
</script>

<style scoped>

</style>
