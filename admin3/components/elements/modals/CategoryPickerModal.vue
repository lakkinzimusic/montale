<template>
  <div>
    <div id="link" @click.stop="dialog = true">
      <slot>
        <v-btn>Выбрать</v-btn>
      </slot>
    </div>
    <v-dialog
      v-model="dialog"
      max-width="40vw"
    >
      <v-card>
        <v-card-text>
          <v-container fluid>
            <v-layout row>
              <v-flex>
                <v-list>
                  <v-subheader>Категории</v-subheader>
                  <v-list-item-group v-model="chosen_perfume" color="primary">
                    <v-list-item
                      :disabled="categoryExists(item.id)"
                      v-for="(item, i) in perfumes"
                      :key="i"
                      @click="appendCategory(item)"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          {{item.category_name}}
                          <i class="fas fa-caret-right"></i>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
                <div class=" mt-3">
                  <v-pagination
                    v-model="page"
                    :length="parseInt((count / 20).toFixed(0))"
                    prev-icon="fas fa-caret-left"
                    next-icon="fas fa-caret-right"
                    color="green"
                  ></v-pagination>
                </div>
              </v-flex>
              <v-divider vertical></v-divider>
              <v-flex md4>
                <v-list>
                  <v-subheader>Присвоенные категории</v-subheader>
                  <v-list-item-group color="primary">
                    <v-list-item
                      v-for="(item, i) in categories"
                      :key="i"
                      @click="removeCategory(item[obj_name?obj_name:'category'])"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          {{item[obj_name?obj_name:'category'].category_name}}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
    export default {
        name: "CategoryPickerModal",
        props: ['categories', 'target_id', 'from_name', 'to_name', 'obj_name'],
        data() {
            return {
                dialog: false,
                perfumes: [],
                count: 0,
                page: 1,
                chosen_perfume: null,
            }
        },
        methods: {
            async loadPage(page) {
                let data = await this.$axios.$get(`/api/catalog/perfumes?page=${page}`);
                this.count = data.count;
                this.perfumes = data.rows;
            },
            appendCategory(cat) {
                let product_id = this.target_id;
                let obj = {};
                obj[this.from_name?this.from_name:'category_id'] = cat.id;
                obj[this.to_name?this.to_name:'product_id'] = this.target_id;
                obj[this.obj_name?this.obj_name:'category'] = cat;
                this.categories.push(obj);
            },
            removeCategory(cat){
                let that = this;
                let index = this.categories.findIndex(item => item[that.from_name?that.from_name:'category_id'] === cat.id);
                if(index < 0) return true;
                this.categories.splice(index, 1);
            },
            categoryExists(id) {
                let that = this;
                return this.categories.some(item => item[that.from_name?that.from_name:'category_id'] === id)
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
  #link {
    display: inline-block;
    cursor: pointer;
  }
</style>
