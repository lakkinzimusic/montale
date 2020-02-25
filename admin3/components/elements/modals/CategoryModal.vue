<template>
  <div>
    <div id="link" @click.stop="dialog = true">
      <slot>
        <v-btn>Изменить</v-btn>
      </slot>
    </div>
    <v-dialog
      v-model="dialog"
      max-width="70vw"
    >
      <v-card :loading="!category">
        <v-tabs
          v-model="tab"
          background-color="deep-purple accent-4"
          centered
          dark
          icons-and-text
        >
          <v-tabs-slider></v-tabs-slider>

          <v-tab href="#tab-1">
            Основные
            <v-icon>fas fa-file</v-icon>
          </v-tab>

          <v-tab href="#tab-2">
            Характеристики
            <v-icon>fas fa-list</v-icon>
          </v-tab>

          <v-tab href="#tab-3">
            Сезонность
            <v-icon>fa fa-leaf</v-icon>
          </v-tab>

          <v-tab href="#tab-4">
            Может понравиться
            <v-icon>fa fa-star</v-icon>
          </v-tab>

          <v-tab href="#tab-5">
            Рекомендации
            <v-icon>fa fa-thumbs-up</v-icon>
          </v-tab>

          <v-tab href="#tab-6">
            Похожие
            <v-icon>fa fa-sync</v-icon>
          </v-tab>
          <v-tab href="#tab-7">
            Товары
            <v-icon>fa fa-box</v-icon>
          </v-tab>
        </v-tabs>

        <template v-if="category">
          <v-card-title class="headline">{{category.category_name}}</v-card-title>

          <v-card-text>
            <v-divider/>
            <v-tabs-items v-model="tab">
              <v-tab-item value="tab-1">
                <v-container grid-list-xl>
                  <v-layout row>
                    <v-flex>
                      <v-text-field
                        label="Наименовании аромата"
                        v-model="category.category_name"
                        hint="Например: Poud Velvet"
                        outlined
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex>
                      <v-text-field
                        label="Ссылка"
                        v-model="category.slug"
                        :hint="'http://site.ru/perfumes/'+category.slug"
                        outlined
                      ></v-text-field>
                    </v-flex>
                    <v-flex>
                      <v-select v-if="category.aromats_collection"
                                :items="collections"
                                label="Коллекция"
                                item-text="collection_name"
                                item-value="id"
                                v-model="category.aromats_collection.collection_id"
                                outlined
                      ></v-select>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex>
                      <v-switch style="margin-top: 0" v-model="category.markers.new" :label="`Отображать в новинках`"></v-switch>
                    </v-flex>
                    <v-flex>
                      <v-switch style="margin-top: 0" v-model="category.markers.bestseller" :label="`Отображать в бестселлерах`"></v-switch>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex md4>
                      <label>Изображение</label>
                      <div id="category_picture">
                        <template v-if="category.image_url">
                          <img style="max-width: 100%;max-height: 100%;" :src="`${baseUrl}/${category.image_url}`"/>
                        </template>
                        <template v-else>
                          <img style="max-width: 100%;max-height: 100%;"
                               src="https://www.kilombo.co.il/SVTemplate/img/icon-img-placeholder.svg"/>
                        </template>
                        <div id="upload_overlay" @click="$refs.file.click()">
                          <i class="fas fa-cloud-upload-alt"></i>
                        </div>
                        <input type="file" id="file" ref="file" style="display: none" @change="uploadFile()"/>
                      </div>
                    </v-flex>
                    <v-flex md8>
                      <label>Описание</label>
                      <ckeditor :editor="editor" v-model="category.description" :config="editorConfig"></ckeditor>
                      <div v-for="property in properties" v-if="property.tag === 'sex'">
                        <v-card
                          color="grey lighten-5"
                          max-width="100%"
                          class="my-2"
                        >
                          <v-card-title>
                            {{property.argument_name}} &nbsp;&nbsp;
                            <v-menu offset-y :close-on-content-click="false">
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="cyan"
                                  dark
                                  v-on="on"
                                  x-small
                                >
                                  Выбрать...
                                </v-btn>
                              </template>
                              <v-list style="height: 100%" class="overflow-y-auto">
                                <v-list-item
                                  v-for="(item, index) in property.aromats_properties_values"
                                  v-if="!hasPropertyValue(property.id, item.id)"
                                  :key="index"
                                  @click="appendValue(property, item)"
                                >
                                  <v-list-item-title>{{ item.value_name }}</v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </v-card-title>
                          <v-card-text>
                            <template v-if="getCategoryValuesByProp(property.id).length < 1">
                              -
                            </template>
                            <template v-else>
                              <v-list>
                                <v-list-item v-for="value in getCategoryValuesByProp(property.id)" :key="value.property_id+'-'+value.value_id" v-if="value.aromats_properties_value">
                                  {{value.aromats_properties_value.value_name}}
                                  <v-spacer></v-spacer>
                                  <i class="fas fa-times" style="cursor: pointer"
                                     @click="removeValue(value.property_id, value.value_id)"></i>
                                </v-list-item>
                              </v-list>

                            </template>
                          </v-card-text>
                        </v-card>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-tab-item>
              <v-tab-item value="tab-2">
                <v-container grid-list-xl>
                  <h1>Основные характеристики</h1>
                  <v-layout row>
                    <v-flex v-for="property in properties" v-if="property.tag === 'common'" md12>
                      <v-card
                        color="grey lighten-5"
                        max-width="100%"
                        class="my-2"
                      >
                        <v-card-title>
                          {{property.argument_name}} &nbsp;&nbsp;
                          <v-menu offset-y :close-on-content-click="false">
                            <template v-slot:activator="{ on }">
                              <v-btn
                                color="cyan"
                                dark
                                v-on="on"
                                x-small
                              >
                                Выбрать...
                              </v-btn>
                            </template>
                            <v-list style="height: 100%" class="overflow-y-auto">
                              <v-list-item
                                v-for="(item, index) in property.aromats_properties_values"
                                v-if="!hasPropertyValue(property.id, item.id)"
                                :key="index"
                                @click="appendValue(property, item)"
                              >
                                <v-list-item-title>{{ item.value_name }}</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </v-card-title>
                        <v-card-text>
                          <template v-if="getCategoryValuesByProp(property.id).length < 1">
                            -
                          </template>
                          <template v-else>
                            <v-list>
                              <v-list-item v-for="value in getCategoryValuesByProp(property.id)"  :key="value.property_id+'-'+value.value_id">
                                {{value.aromats_properties_value.value_name}}
                                <v-spacer></v-spacer>
                                <i class="fas fa-times" style="cursor: pointer"
                                   @click="removeValue(value.property_id, value.value_id)"></i>
                              </v-list-item>
                            </v-list>

                          </template>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-tab-item>
              <v-tab-item value="tab-3">
                <v-container grid-list-xl>
                  <h1>Сезонные характеристики</h1>
                  <v-layout row>
                    <v-flex v-for="property in properties" v-if="property.tag === 'seasonal'" md12>
                      <v-card
                        color="grey lighten-5"
                        max-width="100%"
                        class="my-2"
                      >
                        <v-card-title>
                          {{property.argument_name}} &nbsp;&nbsp;
                          <v-menu offset-y :close-on-content-click="false">
                            <template v-slot:activator="{ on }">
                              <v-btn
                                color="cyan"
                                dark
                                v-on="on"
                                x-small
                              >
                                Выбрать...
                              </v-btn>
                            </template>
                            <v-list style="height: 100%" class="overflow-y-auto">
                              <v-list-item
                                v-for="(item, index) in property.aromats_properties_values"
                                v-if="!hasPropertyValue(property.id, item.id)"
                                :key="index"
                                @click="appendValue(property, item)"
                              >
                                <v-list-item-title>{{ item.value_name }}</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </v-card-title>
                        <v-card-text>
                          <template v-if="getCategoryValuesByProp(property.id).length < 1">
                            -
                          </template>
                          <template v-else>
                            <v-list>
                              <v-list-item v-for="value in getCategoryValuesByProp(property.id)" :key="value.property_id + '-' + value.value_id">
                                {{value.aromats_properties_value.value_name}}
                                <v-spacer></v-spacer>
                                <i class="fas fa-times" style="cursor: pointer"
                                   @click="removeValue(value.property_id, value.value_id)"></i>
                              </v-list-item>
                            </v-list>

                          </template>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-tab-item>
              <v-tab-item value="tab-4">
                <v-container grid-list-xl>
                  <h1>Может понравиться</h1>
                  <v-list>
                    <v-list-item-group color="primary">
                      <v-list-item
                        v-for="(item, i) in category.aromats_may_likes"
                        :key="i"
                      >
                        <v-list-item-content>
                          <v-list-item-title>
                            {{item.category.category_name}}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>

                  <category-picker-modal :target_id="category.id"
                                         :categories="category.aromats_may_likes"
                                         from_name="may_like_aromat"
                                         to_name="aromat_id"
                  >
                    <v-btn color="blue" dark class="my-2">Выбрать категории</v-btn>
                  </category-picker-modal>
                </v-container>
              </v-tab-item>
              <v-tab-item value="tab-5">
                <v-container grid-list-xl>
                  <h1>Рекоммендации</h1>
                  <v-list>
                    <v-list-item-group color="primary">
                      <v-list-item
                        v-for="(item, i) in category.aromats_recommendeds"
                        v-if="item.recmmendation"
                        :key="i"
                      >
                        <v-list-item-content>
                          <v-list-item-title>
                            {{item.recommendation.category_name}}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>

                  <category-picker-modal :target_id="category.id"
                                         :categories="category.aromats_recommendeds"
                                         from_name="aromat_recommended_id"
                                         to_name="aromat_id"
                                         obj_name="recommendation"
                  >
                    <v-btn color="blue" dark class="my-2">Выбрать категории</v-btn>
                  </category-picker-modal>
                </v-container>
              </v-tab-item>
              <v-tab-item value="tab-6">
                <v-container grid-list-xl>
                  <h1>Похожие ароматы</h1>
                  <v-list>
                    <v-list-item-group color="primary">
                      <v-list-item
                        v-for="(item, i) in category.aromats_similars"
                        :key="i"
                      >
                        <v-list-item-content>
                          <v-list-item-title>
                            {{item.similar.category_name}}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>

                  <category-picker-modal :target_id="category.id"
                                         :categories="category.aromats_similars"
                                         from_name="aromat_similar_id"
                                         to_name="aromat_id"
                                         obj_name="similar"
                  >
                    <v-btn color="blue" dark class="my-2">Выбрать категории</v-btn>
                  </category-picker-modal>
                </v-container>
              </v-tab-item>
              <v-tab-item value="tab-7">
                <v-container grid-list-xl>
                  <h1>Товары в составе аромата</h1>
                  <v-list>
                    <v-list-item-group color="primary">
                      <v-list-item
                        v-for="(item, i) in category.products_categories"
                        :key="i"
                      >
                        <product-modal :product_id="item.product_id" style="width: 100%">
                          <v-list-item-content>
                            <v-list-item-title>
                              {{item.product_connection.product_name}}
                            </v-list-item-title>
                          </v-list-item-content>
                        </product-modal>

                      </v-list-item>
                    </v-list-item-group>
                  </v-list>

                  <product-picker-modal :target_id="category.id" :products="category.products_categories"
                                        from_name="product_id"
                                        to_name="category_id"
                                        obj_name="product_connection">
                    <v-btn color="blue" dark class="my-2">Выбрать товары</v-btn>
                  </product-picker-modal>


                </v-container>
              </v-tab-item>
            </v-tabs-items>
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
              @click="save()/*,dialog = false*/"
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
    import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
    import Adapter from "../../../scripts/ckeditorUploadAdapter";
    import CategoryPickerModal from "./CategoryPickerModal";
    import ProductPickerModal from "./ProductPickerModal";

    export default {
        name: "CategoryModal",
        components: {ProductPickerModal, CategoryPickerModal},
        props: ['category_id'],
        data() {
            return {
                editor: ClassicEditor,
                editorConfig: {
                    removePlugins: ['Heading'],
                    language: "ru",
                    extraPlugins: [Adapter],
                    /*ckfinder: {
                        uploadUrl: `${process.env.apiUrl}/api/upload-file`
                    }*/
                },

                dialog: false,
                category: null,
                collections: null,
                properties: [],
                tab: 'tab-1',
            }
        },
        mounted() {
            this.baseUrl = process.env.apiUrl;
        },
        watch: {
            dialog: function (val) {
                if (val === true) {
                    this.load();
                }
            }
        },
        methods: {
            async load() {
                let category = await this.$axios.$get(`/api/catalog/perfumes/${this.$props.category_id}`);
                if (!category.aromats_collection) category.aromats_collection = {};
                let props = await this.$axios.$get(`/api/catalog/properties`);
                let collections = await this.$axios.$get(`/api/catalog/collections?nolimit=true`);
                this.category = category;
                this.properties = props;
                this.collections = collections;
            },
            async uploadFile() {
                let formData = new FormData();
                formData.append('file', this.$refs.file.files[0]);
                let res = await this.$axios.$post('/api/upload-file', formData);
                this.category.image_url = res;
            },
            async save() {
                await this.$axios.$put(`/api/catalog/perfumes/${this.$props.category_id}`, this.category);
                this.$emit('refresh');
            },
            getCategoryValuesByProp(id) {
                return this.category.aromats_properties_connects.filter(item => item.property_id === id);
            },
            hasPropertyValue(prop_id, val_id) {
                return this.category.aromats_properties_connects.findIndex(item => (item.property_id === prop_id && item.value_id === val_id)) >= 0;
            },
            appendValue(property, value) {
                let obj = {
                    aromat_id: this.category.id,
                    property_id: property.id,
                    value_id: value.id,
                    aromats_properties_value: value,
                    aromats_property: property
                };
                this.category.aromats_properties_connects.push(obj);
            },
            removeValue(property_id, value_id) {
                let index = this.category.aromats_properties_connects.findIndex(item => item.property_id === property_id && item.value_id === value_id);
                this.category.aromats_properties_connects.splice(index, 1);
            }
        }
    }
</script>

<style scoped>
  #category_picture {
    text-align: center;
    width: 20vw;
    height: 20vw;
    position: relative;
  }

  #category_picture:hover #upload_overlay {
    display: flex;
  }

  div#upload_overlay {
    background: #000000ad;
    color: #fff;
    font-size: 4rem;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: none;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
</style>
