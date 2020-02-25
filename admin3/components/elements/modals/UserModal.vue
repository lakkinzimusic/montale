<template>
    <div>
        <div id="link" @click.stop="dialog = true">
            <slot>
                <v-btn>Изменить</v-btn>
            </slot>
        </div>
        <v-dialog
                v-model="dialog"
                max-width="70vw"
        >
            <v-card :loading="!user">
                <template v-if="user">
                    <v-card-title class="headline">Пользователь #{{user.id}}</v-card-title>
                    <v-card-text>
                        <v-container grid-list-xl>
                            <v-layout row>
                                <v-flex md6>
                                    <v-text-field
                                            label="Логин"
                                            v-model="user.username"
                                            outlined
                                    ></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                    <v-text-field
                                            label="email"
                                            v-model="user.email"
                                            outlined
                                    ></v-text-field>
                                </v-flex>

                            </v-layout>

                            <v-layout row>
                                <v-flex md6>
                                    <v-text-field
                                            label='Дата регистрации'
                                            v-model="user.createdAt"
                                            outlined
                                    ></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                    <v-text-field
                                            label="Дата последнего изменения"
                                            v-model="user.updatedAt"
                                            outlined
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>

                            <v-layout row>
                                <v-flex md6>
                                    <v-text-field
                                            label="Имя"
                                            v-model="user.firstname"
                                            outlined
                                    ></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                    <v-text-field
                                            label="Фамилия"
                                            v-model="user.surname"
                                            outlined
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>

                            <v-layout row>
                                <v-flex md6>
                                    <v-text-field
                                            label="Дата рождения"
                                            v-model="user.birthday"
                                            outlined
                                    ></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                    <v-select
                                            v-model="user.country"
                                            :items="countries"
                                            label="Страна"
                                            outlined
                                    ></v-select>
                                </v-flex>
                            </v-layout>

                            <v-layout row>
                                <v-flex md6>
                                    <v-select
                                            v-model="user.sex"
                                            :items="sex"
                                            label="Пол"
                                            outlined
                                    ></v-select>
                                </v-flex>
                                <v-flex md6>
                                    <v-text-field
                                            label="Телефон"
                                            v-model="user.phone"
                                            outlined
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex>
                                    <v-switch style="margin-top: 0" v-model="user.is_admin"
                                              :label="`Права администратора`"></v-switch>
                                </v-flex>
                            </v-layout>
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
                                @click="save(),dialog = false"
                        >
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

    export default {
        name: "UserModal",
        props: ['user_id'],
        data: vm => ({
                dialog: false,
                user: null,
                countries: ['Россия', 'Франция'],
                sex: ['male', 'female'],
                date: new Date().toISOString().substr(0, 10),
                dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
                menu1: false,
                menu2: false,
        }),
        computed: {
            computedDateFormatted () {
                return this.formatDate(this.date)
            },
        },
        watch: {
            dialog: function (val) {
                if (val === true) {
                    this.load();
                }
            },
            date (val) {
                this.dateFormatted = this.formatDate(this.date)
            },
        },
        methods: {
            async load() {
                this.user = await this.$axios.$get(`/api/users/get-user?user_id=${this.$props.user_id}`);
                console.log(this.user);
            },
            async save() {
                await this.$axios.$put(`/api/users/users?user_id=${this.$props.user_id}`, this.user);
                this.$emit('refresh');
            },
            formatDate (date) {
                if (!date) return null;
                const [year, month, day] = date.split('-');
                return `${month}/${day}/${year}`
            },
            parseDate (date) {
                if (!date) return null;
                const [month, day, year] = date.split('/');
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            },
        }
    }
</script>

<style scoped>
    #link {
        display: inline-block;
        cursor: pointer;
    }
</style>
