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
                  <v-subheader>Товары</v-subheader>
                  <v-list-item-group v-model="chosen_product" color="primary">
                    <v-list-item
                      :disabled="productExists(item.id)"
                      v-for="(item, i) in products_list"
                      :key="i"
                      @click="appendProduct(item)"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          {{item.product_name}}
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
                  <v-subheader>Присвоенные товары</v-subheader>
                  <v-list-item-group color="primary">
                    <v-list-item
                      v-for="(item, i) in products"
                      :key="i"
                      @click="removeProduct(item[obj_name?obj_name:'product'])"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          {{item[obj_name?obj_name:'product'].product_name}}
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
        name: "ProductPickerModal",
        props: ['products', 'target_id', 'from_name', 'to_name', 'obj_name', 'add'],
        data() {
            return {
                dialog: false,
                products_list: [],
                count: 0,
                page: 1,
                chosen_product: null
            }
        },
        methods: {
            async loadPage(page) {
                let data = await this.$axios.$get(`/api/catalog/products?page=${page}`);
                this.count = data.count;
                this.products_list = data.rows;
            },
            appendProduct(product) {
                let obj = {};
                this.$set(obj, this.from_name?this.from_name:'product_id', product.id);
                this.$set(obj, this.to_name?this.to_name:'category_id', this.target_id);
                this.$set(obj, this.obj_name?this.obj_name:'product', product);
                let that = this;
                if(this.add){
                    Object.keys(this.add).forEach(function(key){
                        if(product[that.add[key]]){
                            that.$set(obj, key, product[that.add[key]]);
                        } else {
                            that.$set(obj, key, that.add[key]);
                        }
                    });
                }
                this.products.push(obj);
                this.$emit('added', product);
            },
            removeProduct(product){
                let that = this;
                let index = this.products.findIndex(item => item[that.from_name?that.from_name:'product_id'] === product.id);
                if(index < 0) return true;
                this.products.splice(index, 1);
            },
            productExists(id) {
                let that = this;
                return this.products.some(item => item[that.from_name?that.from_name:'product_id'] === id)
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
