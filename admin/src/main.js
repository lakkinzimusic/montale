// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App'
import store from './store/index';
import router from './router'
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(ElementUI);



Vue.axios.defaults.baseURL = 'http://138.68.125.45:8080/';

Vue.axios.defaults.path = 'http://138.68.125.45:8080/';

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>',
});
