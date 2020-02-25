import colors from 'vuetify/es5/util/colors'
import Vue from 'vue'

Vue.config.productionTip = false;

export default {
    mode: 'spa',
    generate: {
        dir: '/var/www/mntladmin'
    },
    /*
    ** Headers of the page
    */
    head: {
        titleTemplate: '%s - ' + process.env.npm_package_name,
        title: process.env.npm_package_name || '',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: process.env.npm_package_description || ''}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700&display=swap'
            }
        ]
    },
    /*
    ** Customize the progress-bar color
    */
    loading: {color: '#fff'},

    /*
    ** Global CSS
    */
    css: [
        {src: '~/assets/css/custom.scss', lang: 'sass'}
    ],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        '~plugins/ckeditor',
        '~plugins/initComponents',
        '~plugins/number',
        '~plugins/moment',
    ],
    /*
    ** Nuxt.js dev-modules
    */
    devModules: [
        '@nuxtjs/vuetify',
    ],
    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/auth'
    ],
    /*
    ** Axios module configuration
    ** See https://axios.nuxtjs.org/options
    */
    axios: {
        host: '138.68.125.45',
        port: '8081'
    },
    /*
    ** vuetify module configuration
    ** https://github.com/nuxt-community/vuetify-module
    */
    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        optionsPath: './vuetify.options.js',
        defaultAssets: {
            font: false,
            icons: 'fa'
        },
        theme: {
            themes: {
                dark: {
                    primary: colors.blue.darken2,
                    accent: colors.grey.darken3,
                    secondary: colors.amber.darken3,
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent3
                }
            }
        }
    },
    /*
    ** Build configuration
    */
    build: {
        devtools: true,
        buildDir: '../../var/www/mntladmin',
        build: {
            publicPath: '../../var/www/mntladmin'
        },
        /*
        ** You can extend webpack config here
        */
        extend(config, ctx) {
        }
    },
    router: {
        middleware: ['auth']
    },
    auth: {
        strategies: {
            local: {
                endpoints: {
                    login: {url: '/api/auth/login', method: 'post', propertyName: 'token'},
                    logout: {url: '/api/auth/logout', method: 'post'},
                    user: {url: '/api/auth/user', method: 'get', propertyName: 'user'}
                },
            },
        }
    },
    env: {
        apiUrl: 'http://138.68.125.45:8081'
    }
}
