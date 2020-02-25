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
      <v-card :loading="!product">
        <template v-if="product">
          <v-card-title class="headline">{{product.product_name}}</v-card-title>

          <v-card-text>
            <v-divider/>
            <v-container grid-list-xl>
              <v-layout row>
                <v-flex md6>
                  <v-text-field
                    label="Наименование товара"
                    v-model="product.product_name"
                    hint="Например: Fantastic Oud парфюмерная вода 100мл."
                    outlined
                  ></v-text-field>
                </v-flex>

                <v-flex md3>
                  <v-text-field
                    label="Остаток на складе"
                    type="number"
                    suffix="шт."
                    v-model="product.in_stock"
                    hint="Целое число"
                    outlined
                  ></v-text-field>
                </v-flex>

                <v-flex md3>
                  <v-text-field
                    label="Стоимость"
                    type="number"
                    suffix="₽"
                    v-model="product.price"
                    hint="Число"
                    outlined
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex>
                  <v-text-field
                    label="Подсказка"
                    v-model="product.additional_property"
                    hint="Например: Объём: 100мл."
                    outlined
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex>
                  <v-text-field
                    label="Вид товара"
                    v-model="product.meta_data.hint"
                    hint="Например: Парфюмерная вода-спрей"
                    outlined
                  ></v-text-field>
                </v-flex>

                <v-flex>
                  <v-text-field
                    label="Объем"
                    v-model="product.meta_data.volume"
                    hint="Число"
                    outlined
                  ></v-text-field>
                </v-flex>

                <v-flex>
                  <v-text-field
                    label="Единица измерения объема"
                    v-model="product.meta_data.measure"
                    hint="Например: мл."
                    outlined
                  ></v-text-field>
                </v-flex>
              </v-layout>


            </v-container>
            <v-divider/>
            <h4>Видимость в категориях</h4>
            <v-list>
              <v-list-item-group color="primary">
                <v-list-item
                  v-for="(item, i) in product.products_categories"
                  :key="i"
                >
                  <v-list-item-content>
                    <category-modal :category_id="item.category.id">
                      <v-list-item-title>
                        {{item.category.category_name}}
                      </v-list-item-title>
                    </category-modal>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <category-picker-modal :target_id="product.id"
                                   :categories="product.products_categories">
              <v-btn color="blue" dark class="my-2">Выбрать категории</v-btn>
            </category-picker-modal>
            <v-divider/>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

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
              @click="save(),dialog = false"
            >
              Сохранить
            </v-btn>
          </v-card-actions>
        </template>
        <template v-else>
          <v-card-text>
            Загрузка...
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
    import CategoryPickerModal from "./CategoryPickerModal";

    export default {
        name: "ProductModal",
        components: {CategoryPickerModal},
        props: ['product_id'],
        data() {
            return {
                dialog: false,
                product: null
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
                let product = await this.$axios.$get(`/api/catalog/products/${this.$props.product_id}`);
                if (!product.meta_data) {
                    product.meta_data = {};
                }
                this.product = product;
            },
            async save(){
                await this.$axios.$put(`/api/catalog/products/${this.$props.product_id}`, this.product);
                this.$emit('refresh');
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
