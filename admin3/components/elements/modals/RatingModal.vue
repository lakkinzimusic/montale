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
            <v-card :loading="!rating">
                <template v-if="rating">
                    <v-card-text>
                        <div>{{rating.created_at}}</div>
                        <p class="display-1 text--primary">
                            {{rating.user.username}}
                        </p>
                        <v-switch v-model="rating.approved" label="Отобразить комментарий"></v-switch>
                        <v-flex>
                            <v-text-field label="Комментарий" v-model="rating.comment">
                         </v-text-field>
                        </v-flex>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                                color="red darken-1"
                                text
                                @click="dialog = false"
                        >
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
        name: "RatingModal",
        props: ['aromat_id', 'user_id'],
        data() {
            return {
                dialog: false,
                rating: null
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
                this.rating = await this.$axios.$get(`/api/catalog/get-rating?aromat_id=${this.$props.aromat_id}&user_id=${this.$props.user_id}`);
                console.log(this.rating);
            },
            async save() {
                await this.$axios.$put(`/api/catalog/aromats-ratings?aromat_id=${this.$props.aromat_id}&user_id=${this.$props.user_id}`, this.rating);
                this.$emit('refresh');
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
