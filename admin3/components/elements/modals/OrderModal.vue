<template>
  <div>
    <div id="link" @click.stop="dialog = true" style="width: 100%">
      <slot>
        <v-btn>Изменить</v-btn>
      </slot>
    </div>
    <v-dialog
      v-model="dialog"
      max-width="60vw"
    >
      <v-card :loading="!order">
        <v-tabs
          v-model="tab"
          background-color="deep-purple accent-4"
          centered
          dark
          icons-and-text
        >
          <v-tabs-slider></v-tabs-slider>

          <v-tab href="#tab-1">
            Информация
            <v-icon>fas fa-user</v-icon>
          </v-tab>

          <v-tab href="#tab-2">
            Состав заказа
            <v-icon>fas fa-shopping-cart</v-icon>
          </v-tab>

          <v-tab href="#tab-3">
            Действия
            <v-icon>fas fa-comments</v-icon>
          </v-tab>
        </v-tabs>


        <template v-if="order">
          <v-card-title class="headline">Заказ #{{parseInt(order.id).pad(8)}} от {{ $moment(Date.parse(order.created_at)).format("DD.MM.YYYY HH:mm:ss") }}</v-card-title>
          <v-divider/>
          <v-tabs-items v-model="tab">
            <v-tab-item value="tab-1">
              <v-container grid-list-lg>
                <v-layout>
                  <v-flex>
                    <v-text-field
                      v-model="order.email"
                      label="Email покупателя"
                      placeholder="Email"
                      outlined
                    ></v-text-field>

                    <v-text-field
                      v-model="order.user_phone"
                      label="Телефон пользователя"
                      placeholder="Телефон"
                      outlined
                    ></v-text-field>

                    <v-text-field
                      v-model="order.user_fullname"
                      label="Фамилия и имя покупателя"
                      placeholder="Фамилия и имя"
                      outlined
                    ></v-text-field>

                    <v-text-field
                      v-model="order.delivery_city"
                      label="Город доставки"
                      placeholder="Город"
                      outlined
                    ></v-text-field>

                    <v-text-field
                      v-model="order.delivery_address"
                      label="Адрес доставки"
                      placeholder="Адрес"
                      outlined
                    ></v-text-field>

                  </v-flex>
                  <v-divider vertical></v-divider>
                  <v-flex>
                    <v-select
                              :items="delivery_methods"
                              label="Способ доставки"
                              item-text="label"
                              item-value="id"
                              v-model="order.delivery_method_id"
                              outlined
                    ></v-select>

                    <v-select
                              :items="payment_methods"
                              label="Способ оплаты"
                              item-text="label"
                              item-value="id"
                              v-model="order.payment_method_id"
                              outlined
                    ></v-select>

                    <v-select
                              :items="statuses"
                              label="Статус заказа"
                              item-text="status_label"
                              item-value="id"
                              v-model="order.status"
                              outlined
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-container>

            </v-tab-item>
            <v-tab-item value="tab-2">
              <v-simple-table
                :fixed-header="true"
              >
                <thead>
                <tr>
                  <th class="text-left">Товар</th>
                  <th class="text-left">ID</th>
                  <th class="text-left">Цена/шт</th>
                  <th class="text-left">Количество</th>
                  <th class="text-left">Сумма</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in order.order_items" :key="item.id">
                  <td>
                    <product-modal :product_id="item.product.id">
                      <a href="#">{{ item.product.product_name }}</a>
                    </product-modal>
                  </td>
                  <td>{{ item.product.id }}</td>
                  <td>
                    <v-text-field
                      :value="item.price_const"
                      @change="push_action(`Изменил цену <b>${item.product.product_name}</b> с ${item.price_const}₽ на ${$event}₽`, true), $set(item, 'price_const', $event)"
                      suffix="₽"
                      :hint="`Стоимость товара: ${item.product.price} ₽`"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      :value="item.quantity"
                      @change="push_action(`Изменил количество <b>${item.product.product_name}</b> с ${item.quantity} на ${$event}`, true), $set(item, 'quantity', $event)"
                      suffix="шт."
                    ></v-text-field>
                  </td>
                  <td>{{ parseInt(item.price_const) * parseInt(item.quantity) }} ₽</td>
                  <td>
                    <v-btn color="red" @click="push_action(`Удалил <b>${item.product.product_name}</b> (${item.quantity} шт.)`, true), order.order_items.splice(index,1)" dark>Удалить</v-btn>
                  </td>
                </tr>

                <tr>
                  <td colspan="3">

                  </td>
                  <td colspan="3" class="text-right">
                    <product-picker-modal :target_id="order.id" :products="order.order_items"
                                          from_name="product_id"
                                          to_name="order_id"
                                          obj_name="product"
                                          :add="{price_const:'price', quantity:1}"
                                          @added="push_action(`Добавил <b>${$event.product_name}</b>`, true)"
                    >
                      <v-btn color="blue" block dark class="my-2">Выбрать товары</v-btn>
                    </product-picker-modal>
                  </td>
                </tr>
                </tbody>

              </v-simple-table>
            </v-tab-item>
            <v-tab-item value="tab-3">
              <v-container v-if="dialog">
                <order-comments :order="order"/>
              </v-container>
            </v-tab-item>
          </v-tabs-items>
          <v-divider/>
        </template>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange darken-2" text disabled>
            Сумма заказа: <b>{{order_sum}} ₽</b>
          </v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="dialog = false"
          >
            Отмена
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="save()/*,dialog = false*/"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
    import ProductPickerModal from "./ProductPickerModal";
    import OrderComments from "../modules/OrderComments";
    export default {
        name: "OrderModal",
        components: {OrderComments, ProductPickerModal},
        props: ['order_id'],
        data() {
            return {
                tab:null,
                dialog: false,
                order: null,
                delivery_methods: [],
                payment_methods: [],
                statuses: [],
                action_trace: [],
            }
        },
        watch: {
            dialog: function (val) {
                if (val === true) {
                    this.load();
                }
            }
        },
        mounted() {
            this.baseUrl = process.env.apiUrl;
        },
        methods: {
            async load() {
                this.delivery_methods = (await this.$axios.$get(`/api/shop/delivery-methods?page=1`)).rows;
                this.payment_methods = (await this.$axios.$get(`/api/shop/payment-methods?page=1`)).rows;
                this.statuses = (await this.$axios.$get(`/api/shop/statuses`));
                let order = await this.$axios.$get(`/api/order/orders/${this.$props.order_id}`);
                this.order = order;
            },
            push_action(content, is_action){
                this.action_trace.push({
                    content: content,
                    action: is_action?'action':'message'
                });
            },
            async save() {
                this.order.total_price = this.order_sum;
                await this.$axios.$put(`/api/order/orders/${this.$props.order_id}`, {order:this.order, trace: this.action_trace});
                this.$emit('refresh');
            }
        },
        computed: {
            order_sum: function(){
                if(!this.order) return 0;
                let sum = 0;
                this.order.order_items.map(item => sum += (parseInt(item.price_const) * parseInt(item.quantity)));
                return sum;
            }
        }
    }
</script>

<style scoped>

</style>
