<template>
  <div class="w-100 fill-height">
    <div class="w-100 popout">
      <v-app-bar
        color="light-green"
        dark
      >
        <v-toolbar-title>Управление страницами</v-toolbar-title>

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
              <v-list-item-title>Создать коллекцию</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
    </div>
    <v-container :fill-height="true" d-block align-start fluid class="px-0">
      <v-simple-table class="w-100 popout mt-1">
        <thead>
        <tr>
          <th class="text-left">ID</th>
          <th class="text-left">Наименование</th>
          <th class="text-left">Ссылка</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in pages" :key="item.name">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.slug }}</td>
          <td class="text-right">
            <page-modal :page_id="item.id" @refresh="loadPage(page)">
              <v-btn dark color="light-green">
                Изменить
              </v-btn>
            </page-modal>
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
          color="green"
        ></v-pagination>
      </div>
    </v-container>
  </div>
</template>

<script>
    import PageModal from "../components/elements/modals/PageModal";
    export default {
        name: "pages",
        components: {PageModal},
        data() {
            return {
                pages: [],
                count: 0,
                page: 1,
            }
        },
        methods: {
            async loadPage(page) {
                let data = await this.$axios.$get(`/api/page/pages?page=${page}`);
                this.count = data.count;
                this.pages = data.rows;
            }
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
