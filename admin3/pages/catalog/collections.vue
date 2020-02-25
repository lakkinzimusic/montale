<template>
  <div class="w-100 fill-height">
    <div class="w-100 popout">
      <v-app-bar
        color="green"
        dark
      >
        <v-toolbar-title>Управление коллекциями</v-toolbar-title>

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
          <th></th>
          <th class="text-left">ID</th>
          <th class="text-left">Наименование</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in collections" :key="item.name">
          <td style="padding: 5px" class="text-center">
            <img style="max-width: 50px" v-if="item.image_url" :src="`${baseUrl}/${item.image_url}`">
          </td>
          <td>{{ item.id }}</td>
          <td>{{ item.collection_name }}</td>
          <td class="text-right">
            <collection-modal :collection_id="item.id" @refresh="loadPage(page)">
              <v-btn color="green" dark>
                Изменить
              </v-btn>
            </collection-modal>
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
    import CollectionModal from "../../components/elements/modals/CollectionModal";
    export default {
        name: "collections",
        components: {CollectionModal},
        data() {
            return {
                collections: [],
                count: 0,
                page: 1,
            }
        },
        methods: {
            async loadPage(page) {
                let data = await this.$axios.$get(`/api/catalog/collections?page=${page}`);
                this.count = data.count;
                this.collections = data.rows;
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
