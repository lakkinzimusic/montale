<template>
  <v-container fluid d-block grid-list-md>
    <v-layout justify-center class="mt-5">
      <v-flex xs6 sm3 md3>
        <stats-card title="Продажи" :text="`${count_orders}`" color="green" icon="fas fa-shopping-cart" :dark="true"  :loading="!count_orders">
          <div class="mx-4 py-2">
            <nuxt-link to="/orders" class="btn-link">
              <v-btn text>Перейти к заказам</v-btn>
            </nuxt-link>
          </div>
        </stats-card>
      </v-flex>

      <v-flex xs6 sm3 md3>
        <stats-card title="Сумма продаж" :text="`${sum_orders} ₽`" color="orange" icon="fas fa-ruble-sign" :loading="!sum_orders"
                    :dark="true">
          <div class="mx-4 py-2">
            <nuxt-link to="/orders" class="btn-link">
              <v-btn text>Перейти к заказам</v-btn>
            </nuxt-link>
          </div>
        </stats-card>
      </v-flex>

      <v-flex xs6 sm3 md3>
        <stats-card title="Товаров в каталоге" :text="`${count_products} шт.`" color="deep-purple" icon="fas fa-box" :loading="!count_products"
                    :dark="true">
          <div class="mx-4 py-2">
            <nuxt-link to="/catalog/products" class="btn-link">
              <v-btn text>Управление товарами</v-btn>
            </nuxt-link>
          </div>
        </stats-card>
      </v-flex>

      <v-flex xs6 sm3 md3>
        <stats-card title="Ароматов в каталоге" :text="`${count_perfumes} шт.`" color="pink" icon="fas fa-spa" :loading="!count_perfumes"
                    :dark="true">
          <div class="mx-4 py-2">
            <nuxt-link to="/catalog/perfumes" class="btn-link">
              <v-btn text>Управление ароматами</v-btn>
            </nuxt-link>
          </div>
        </stats-card>
      </v-flex>
    </v-layout>

    <v-divider class="my-5"/>

    <v-layout justify-center class="mt-5">
      <v-flex xs12 sm5 md5>
        <stats-card title="Состояние системы" :text="`аптайм <b>${os_stats?(os_stats.uptime/60/60).toFixed(2):0}</b> часов.`" :loading="!os_stats" color="blue" icon="fab fa-linux"
                    :dark="true">
          <div class="mx-4 py-2">
            <v-list disabled v-if="os_stats">
              <v-subheader>ПОКАЗАТЕЛИ</v-subheader>
              <v-list-item-group color="primary">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>fas fa-memory</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{os_stats.ram_free.toFixed(0)}}MB / {{os_stats.ram.toFixed(0)}} MB ({{(os_stats.ram_free/os_stats.ram*100).toFixed(0)}}%)
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>fas fa-microchip</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{os_stats.cpu_free.toFixed(2)*100}}% свободно / {{os_stats.cpu_usage.toFixed(2)*100}}% используется (Количество CPU: {{os_stats.cpu_count}})
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </stats-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
    import Logo from '~/components/Logo.vue'
    import VuetifyLogo from '~/components/VuetifyLogo.vue'
    import StatsCard from "../components/elements/forms/StatsCard";

    export default {
        components: {
            StatsCard,
            Logo,
            VuetifyLogo
        },
        data() {
            return {
                count_orders: null,
                sum_orders: null,
                count_products: null,
                count_perfumes: null,
                os_stats: null,
            }
        },
        async mounted() {
            this.count_orders = (await this.$axios.$get('/api/stats/count_orders')).count;
            this.sum_orders = (await this.$axios.$get('/api/stats/sum_orders')).sum;
            this.count_perfumes = (await this.$axios.$get('/api/stats/count_perfumes')).count;
            this.count_products = (await this.$axios.$get('/api/stats/count_products')).count;
            this.os_stats = await this.$axios.$get('/api/stats/os_stats');
        }
    }
</script>

<style scoped>
  .btn-link {
    text-decoration: none;
  }
</style>
