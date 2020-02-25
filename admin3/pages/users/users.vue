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
            <v-simple-table class="w-100 popout mt-1" dense>
                <thead>
                <tr>
                    <th class="text-left">ID</th>
                    <th class="text-left">Имя пользователя</th>
                    <th class="text-left">email</th>
                    <th class="text-left">Дата регистрации</th>
                    <th class="text-left">Последняя дата изменения</th>
                    <th class="text-left">Имя</th>
                    <th class="text-left">Фамилия</th>
                    <th class="text-left">Страна</th>
                    <th class="text-left">Дата рождения</th>
                    <th class="text-left">Телефон</th>
                    <th class="text-left">Пол</th>
                    <th class="text-left">Наличие прав администратора</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in users" :key="item.name">

                    <td>{{ item.id }}</td>
                    <td>{{ item.username }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.createdAt }}</td>
                    <td>{{ item.updatedAt }}</td>
                    <td>{{ item.firstname }}</td>
                    <td>{{ item.surname }}</td>
                    <td>{{ item.country }}</td>
                    <td>{{ item.birthday }}</td>
                    <td>{{ item.phone }}</td>
                    <td>{{ item.sex }}</td>
                    <td>{{ item.is_admin }}</td>

                    <td class="text-right">
                        <v-btn color="red" @click.stop="deleteUser(item)" dark>
                            Удалить
                        </v-btn>
                    </td>
                    <td class="text-right">
                        <user-modal :user_id="item.id" @refresh="loadPage(page)">
                            <v-btn color="blue" dark>
                                Изменить
                            </v-btn>
                        </user-modal>
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
    import UserModal from "../../components/elements/modals/UserModal";

    export default {
        name: "users",
        components: {UserModal},
        data() {
            return {
                users: [],
                count: 0,
                page: 1,
            }
        },
        methods: {
            async loadPage(page) {
                let data = await this.$axios.$get(`/api/users/users?page=${page}`);
                this.count = data.count;
                this.users = data.rows;
            },
            async deleteUser(item) {
                let res = await this.$confirm('Вы уверены, что хотите удалить пользователя?',
                    {title: ' Подтвердить действие'}
                );
                if (res) {
                    await this.$axios.$delete(`/api/users/users/${item.id}`);
                    let index = this.users.findIndex(val => val.id === item.id);
                    if (index >= 0) {
                        this.users.splice(index, 1);
                        this.item = null;
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
