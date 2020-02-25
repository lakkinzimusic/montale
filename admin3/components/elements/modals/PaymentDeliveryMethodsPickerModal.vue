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
                  <v-subheader>Все существующие методы доставки</v-subheader>
                  <v-list-item-group v-model="chosen_delivery_method" color="primary">
                    <v-list-item
                            :disabled="deliveryMethodExists(item.id)"
                      v-for="(item, i) in delivery_methods"
                      :key="i"
                            @click="appendDeliveryMethod(item)"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          {{item.label}}
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
                  <v-subheader>Выбранные методы доставки</v-subheader>
                  <v-list-item-group color="primary">
                    <v-list-item
                      v-for="(item, i) in this_payments_delivery"
                      :key="i"
                      @click="removeCategory(item)"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          {{item.label}}
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
        name: "PaymentDeliveryMethodsPickerModal",
        props: ['this_payments_delivery', 'target_id', 'from_name', 'to_name', 'obj_name'],
        data() {
            return {
                dialog: false,
                delivery_methods: [],
                count: 0,
                page: 1,
                chosen_delivery_method: null,
            }
        },
        methods: {
            async loadPage(page) {
                let data = await this.$axios.$get(`/api/shop/delivery-methods?page=${page}`);
                this.count = data.count;
                this.delivery_methods = data.rows;
                console.log(data);
            },
            appendDeliveryMethod(method) {
             this.this_payments_delivery.push(method);
            },
            removeCategory(method){
                let that = this;
                let index = this.this_payments_delivery.findIndex(item => item.id === method.id);
                if(index < 0) return true;
                this.this_payments_delivery.splice(index, 1);
            },
            deliveryMethodExists(id) {
                let that = this;
                return this.this_payments_delivery.some(item => item.id === id)
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
