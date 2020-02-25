<template>
  <div class="w-100 fill-height">
    <div class="w-100 popout">
      <v-app-bar
        color="blue"
        dark
      >
        <v-toolbar-title>Управление товарами</v-toolbar-title>

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
              <v-list-item-title>Создать товар</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
    </div>
    <v-container :fill-height="true" d-block align-start fluid class="px-0">
      <v-simple-table class="w-100 popout mt-1">
        <thead>
        <tr>
          <th></th>
          <th class="text-left">ID</th>
          <th class="text-left">Наименование</th>
          <th class="text-left">Стоимость</th>
          <th class="text-left">Остаток</th>
          <th>Категории</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in products" :key="item.name">
          <td style="padding: 5px" class="text-center">
            <img style="max-width: 50px" v-if="item.imageURL" :src="`${baseUrl}/${item.imageURL}`">
          </td>
          <td>{{ item.id }}</td>
          <td>{{ item.product_name }}</td>
          <td>{{ item.price }} ₽</td>
          <td>{{ item.in_stock }} шт.</td>
          <td>
            <template v-if="item.products_categories.length > 0">
              <div v-for="category in item.products_categories">{{category.category.category_name}}</div>
            </template>
            <div v-else>
              <v-alert
                dense
                outlined
                type="error"
              >
                Товар не отображается ни в одной из категорий
              </v-alert>
            </div>
          </td>
          <td class="text-right">
            <product-modal :product_id="item.id" @refresh="loadPage(page)">
              <v-btn color="blue" dark>
                Изменить
              </v-btn>
            </product-modal>
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
    import ProductModal from "../../components/elements/modals/ProductModal";
    export default {
        name: "products",
        components: {ProductModal},
        data() {
            return {
                products: [],
                count: 0,
                page: 1,
            }
        },
        methods: {
            async loadPage(page) {
                let data = await this.$axios.$get(`/api/catalog/products?page=${page}`);
                this.count = data.count;
                this.products = data.rows;
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
