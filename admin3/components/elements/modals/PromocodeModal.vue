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
            <v-card :loading="!promocode">
                <template v-if="promocode">
                    <v-card-title class="headline">Промокод #{{promocode.id}}</v-card-title>
                    <v-card-text>
                        <v-container grid-list-xl>
                            <v-layout row>
                                <v-flex md6>
                                    <v-text-field
                                            label="Код"
                                            v-model="promocode.code"
                                            outlined
                                    ></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                    <v-text-field
                                            label="Процент скидки"
                                            v-model="promocode.discount"
                                            outlined
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>

                        </v-container>
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
        name: "PromocodeModal",
        props: ['promocode_id'],
        data() {
            return {
                dialog: false,
                promocode: null,
            }
        },

        watch: {
            dialog: function (val) {
                if (val === true) {
                    this.load();
                }
            },

        },
        methods: {
            async load() {
                this.promocode = await this.$axios.$get(`/api/shop/get-promocode?promocode_id=${this.$props.promocode_id}`);
                console.log(this.promocode);
            },
            async save() {
                await this.$axios.$put(`/api/shop/promocodes?promocode_id=${this.$props.promocode_id}`, this.promocode);
                this.$emit('refresh');
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
