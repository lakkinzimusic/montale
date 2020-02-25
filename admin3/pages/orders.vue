<template>
  <div class="w-100 fill-height">
    <div class="w-100 popout">
      <v-app-bar
        color="light-green"
        dark
      >
        <v-toolbar-title>Заказ покупателей</v-toolbar-title>

        <v-spacer></v-spacer>

      </v-app-bar>
    </div>
    <v-container :fill-height="true" d-block align-start fluid class="px-0">
      <v-simple-table class="w-100 popout mt-1">
        <thead>
        <tr>
          <th class="text-left">Номер заказа</th>
          <th class="text-left">Дата создания</th>
          <th class="text-left">Контрагент</th>
          <th class="text-left">Город</th>
          <th class="text-left">Способ оплаты</th>
          <th class="text-left">Способ доставки</th>
          <th class="text-left">Сумма заказа</th>
          <th class="text-left">Статус</th>
        </tr>
        </thead>
        <tbody>
        <tr class="order_tr" @click.stop="$refs[`model_${item.id}`][0].dialog = true" v-for="item in orders" :key="item.id">
          <td>{{ parseInt(item.id).pad(8) }}</td>
          <td>{{ $moment(Date.parse(item.created_at)).format("DD.MM.YYYY HH:mm:ss") }}</td>
          <td>{{ item.user_fullname }}</td>
          <td>{{ item.delivery_city }}</td>
          <td>{{ item.delivery_method.label }}</td>
          <td>{{ item.payment_method.label }}</td>
          <td>{{ item.total_price }} руб.</td>
          <td>
            <template v-if="item.order_status">
              <b :style="`color: ${item.order_status.color}`">
                {{ item.order_status.status_label }}
              </b>
            </template>
            <div style="display: none">
              <order-modal :order_id="item.id" :ref="`model_${item.id}`" @refresh="loadPage(page)">
                <v-btn dark color="blue">Просмотр</v-btn>
              </order-modal>
            </div>
          </td>
        </tr>
        </tbody>
      </v-simple-table>

      <div class=" mt-3">
        <v-pagination
          v-model="page"
          :length="(Math.ceil(count / 20) * 20) / 20"
          prev-icon="fas fa-caret-left"
          next-icon="fas fa-caret-right"
          color="green"
        ></v-pagination>
      </div>
    </v-container>
  </div>
</template>

<script>
    import OrderModal from "../components/elements/modals/OrderModal";

    export default {
        name: "orders",
        components: {OrderModal},
        data() {
            return {
                orders: [],
                count: 0,
                page: 1,
            }
        },
        methods: {
            async loadPage(page) {
                let data = await this.$axios.$get(`/api/order/orders?page=${page}`);
                this.count = data.count;
                this.orders = data.rows;
                console.log(this.orders);
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
  .order_tr {
    cursor: pointer;
  }
</style>

