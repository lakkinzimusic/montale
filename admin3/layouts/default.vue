<template>
    <v-app>
        <v-navigation-drawer
                fixed
                app
                :mini-variant="drawer"
        >
            <v-list>
                <template v-for="(item, i) in items">
                    <v-list-item v-if="item.to"
                                 :to="item.to"
                                 router
                                 exact :key="'hl/'+item.to"
                    >
                        <v-list-item-avatar dark>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.title"/>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-group v-else
                                  :prepend-icon="item.icon"
                                  :value="routeContains('/'+item.root+'/')"
                                  style="padding: 0 10px;"
                    >
                        <template v-slot:activator>
                            <v-list-item-title>{{item.title}}</v-list-item-title>
                        </template>

                        <v-list-item
                                v-for="itemInner in item.items"
                                v-if="itemInner.to"
                                :to="itemInner.to"
                                router
                                exact :key="'ll/'+itemInner.to"
                                style="padding-left: 40px"
                        >
                            <v-list-item-avatar>
                                <v-icon>{{ itemInner.icon }}</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title v-text="itemInner.title"/>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-group>
                </template>

            </v-list>
        </v-navigation-drawer>
        <v-app-bar
                :clipped-left="false"
                fixed
                app
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
            <v-toolbar-title v-text="title"/>
            <v-spacer/>
            <v-btn
                    @click.stop="rightDrawer = !rightDrawer"
            >
                <i class="fas fa-user"></i>&nbsp;&nbsp;{{$auth.$state.user.username}}
            </v-btn>
        </v-app-bar>
        <v-content>
            <v-container :fill-height="true" align-start fluid id="content">
                <nuxt/>
            </v-container>
        </v-content>
        <v-footer
                :fixed="true"
                app
        >
            <span>&copy; 2019</span>
        </v-footer>
    </v-app>
</template>

<script>
    export default {
        data() {
            let that = this;
            return {
                drawer: false,
                items: [
                    {
                        icon: 'fas fa-chart-bar',
                        title: 'Главная',
                        to: '/'
                    },
                    {
                        icon: 'fas fa-shopping-cart',
                        title: 'Заказы',
                        to: '/orders'
                    },
                    {
                        icon: 'fas fa-file',
                        title: 'Страницы',
                        to: '/pages'
                    },
                    {
                        icon: 'fas fa-box',
                        title: 'Каталог',
                        root: '/catalog/',
                        items: [
                            {
                                icon: 'fas fa-chevron-right',
                                title: 'Ароматы',
                                to: '/catalog/perfumes'
                            },
                            {
                                icon: 'fas fa-chevron-right',
                                title: 'Товары',
                                to: '/catalog/products'
                            },
                            {
                                icon: 'fas fa-chevron-right',
                                title: 'Коллекции',
                                to: '/catalog/collections'
                            },
                            {
                                icon: 'fas fa-chevron-right',
                                title: 'Свойства',
                                to: '/catalog/properties'
                            },
                            {
                                icon: 'fas fa-chevron-right',
                                title: 'Отзывы',
                                to: '/catalog/aromats-ratings'
                            },
                        ]
                    },
                    {
                        icon: 'fas fa-store',
                        title: 'Магазин',
                        root: '/shop/',
                        items: [
                            {
                                icon: 'fas fa-chevron-right',
                                title: 'Промокоды',
                                to: '/shop/promocodes'
                            },
                            {
                                icon: 'fas fa-chevron-right',
                                title: 'Способы оплаты',
                                to: '/shop/payment'
                            },
                            {
                                icon: 'fas fa-chevron-right',
                                title: 'Способы доставки',
                                to: '/shop/delivery'
                            },
                                       ]
                    },
                    {
                        icon: 'fas fa-users',
                        title: 'Пользователи',
                        root: '/users/',
                        items: [
                            {
                                icon: 'fas fa-chevron-right',
                                title: 'Пользователи',
                                to: '/users/users'
                            },
                            {
                                icon: 'fas fa-chevron-right',
                                title: 'Менеджеры',
                                to: '/users/managers'
                            },
                        ]

                    },

                ],

                title: 'Montale admin'
            }

        },
        methods: {
            routeContains(str) {
                let path = this.$route.path;
                return path.includes(str);
            }
        }
    }


</script>

<style scoped>
    #content {
        background: #f1f1f1;
    }
</style>
