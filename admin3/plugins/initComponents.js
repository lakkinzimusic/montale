import Vue from 'vue'
import ProductModal from "../components/elements/modals/ProductModal";
import CategoryModal from "../components/elements/modals/CategoryModal";
import VuetifyConfirm from 'vuetify-confirm'

Vue.component('product-modal', ProductModal);
Vue.component('category-modal', CategoryModal);

export default ({ app }) => {
  Vue.use(VuetifyConfirm, {
    vuetify: app.vuetify,
    buttonTrueText: 'ДА',
    buttonFalseText: 'НЕТ',
    icon: false
  })
}


