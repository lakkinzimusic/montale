<template>
  <div class="w-100 fill-height">
    <div class="w-100 popout">
      <v-app-bar
        color="orange"
        dark
      >
        <v-toolbar-title>Управление свойствами</v-toolbar-title>

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
              <v-list-item-title>Создать товар</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
    </div>
    <v-container :fill-height="true" d-block align-start fluid class="px-0">
      <v-layout row>
        <v-flex>
          <v-list style="height: 100%">
            <v-subheader>Свойства</v-subheader>
            <v-list-item-group v-model="current_prop" color="primary">
              <v-list-item
                v-for="(item, i) in properties"
                :key="i"
              >
                <v-list-item-icon>
                  <v-icon></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.argument_name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-flex>
        <v-divider vertical></v-divider>
        <v-flex md6>
          <v-list style="height: 100%" v-if="current_prop !== null && properties[current_prop]">
            <v-subheader style="position: relative">
              Значения
              <v-btn
                color="pink"
                dark
                small
                absolute
                bottom
                right
                fab
                @click.stop="dialog = true"
              >
                <v-icon>fas fa-plus</v-icon>
              </v-btn>
            </v-subheader>
            <v-list-item
              v-for="(item, i) in properties[current_prop].aromats_properties_values"
              :key="i"
              @click="current_value = i, item.temp_name = item.value_name"
              :class="current_value === i?'v-list-item--active grey lighten-4':null"
              :ripple="current_value !== i"
            >

              <v-list-item-content>
                <v-expand-transition>
                  <template v-if="current_value === i">
                    <v-container>
                      <v-layout row>
                        <v-flex>
                          <v-alert v-if="item.error"
                                   border="right"
                                   colored-border
                                   type="error"
                                   elevation="2"
                          >
                            {{item.error}}
                          </v-alert>
                          <v-text-field
                            v-model="item.temp_name"
                            placeholder="Значение"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row>
                        <div class="d-flex w-100">
                          <v-spacer/>
                          <v-btn text color="red accent-4" @click.stop="removeValue(item)"><b>Удалить</b></v-btn>
                          <v-btn text color="red" @click.stop="current_value = null">ОТМЕНА</v-btn>
                          <v-btn text color="green" @click.stop="saveValue(item)">СОХРАНИТЬ</v-btn>
                        </div>
                      </v-layout>
                    </v-container>
                  </template>
                </v-expand-transition>

                <v-expand-transition>
                  <template v-if="current_value !== i">
                    <v-list-item-title style="position: absolute" v-text="item.value_name"></v-list-item-title>
                  </template>
                </v-expand-transition>

              </v-list-item-content>
            </v-list-item>

          </v-list>
        </v-flex>
      </v-layout>
    </v-container>

    <v-dialog v-model="dialog" max-width="500px" v-if="properties[current_prop]">
      <v-card>
        <v-card-text>
          <v-alert v-if="newItem.error"
                   border="right"
                   colored-border
                   type="error"
                   elevation="2"
          >
            {{newItem.error}}
          </v-alert>

          <v-text-field label="Значение" v-model="newItem.value_name"></v-text-field>
          <small class="grey--text">* для свойства "{{properties[current_prop].argument_name}}".</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="red" @click="dialog = false">ОТМЕНА</v-btn>
          <v-btn text color="success" @click="insertValue()">СОХРАНИТЬ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
    export default {
        name: "properties",
        data() {
            return {
                properties: [],
                current_prop: null,
                current_value: null,
                dialog: false,
                newItem: {}
            }
        },
        computed: {
            prop_id: function () {
                if (this.current_prop === null) return null;
                return this.properties[this.current_prop].id;
            }
        },
        methods: {
            async load() {
                let data = await this.$axios.$get(`/api/catalog/properties`);
                this.properties = data;
            },
            async saveValue(item) {
                if (!item.temp_name) {
                    this.$set(item, 'error', 'Необходимо ввести значение');
                } else {
                    this.$set(item, 'error', null);
                    let payload = Object.assign({}, item);
                    payload.value_name = payload.temp_name;
                    let savedObject = await this.$axios.$put(`/api/catalog/properties/${this.prop_id}/value/${item.id}`, payload);
                    item.value_name = savedObject.value_name;
                    this.current_value = null;
                }
            },
            async removeValue(item) {
                let res = await this.$confirm('Вы уверены, что хотите удалить значение "'+item.value_name+'"?',
                    {title: ' Подтвердить действие'}
                );
                if (res) {
                    await this.$axios.$delete(`/api/catalog/properties/${this.prop_id}/value/${item.id}`);
                    let index = this.properties[this.current_prop].aromats_properties_values.findIndex(val => val.value_name === item.value_name);
                    if(index >= 0){
                        this.current_value = null;
                        this.properties[this.current_prop].aromats_properties_values.splice(index,1);
                    }
                }
            },
            async insertValue() {
                if (!this.newItem.value_name) {
                    this.$set(this.newItem, 'error', 'Необходимо ввести значение');
                } else {
                    this.newItem.property_id = this.prop_id;
                    let newObject = await this.$axios.$post(`/api/catalog/properties/${this.prop_id}/value`, this.newItem);
                    this.properties[this.current_prop].aromats_properties_values.push(newObject);
                    this.newItem = {};
                    this.dialog = false;
                }
            }
        },

        mounted() {
            this.load();
            this.baseUrl = process.env.apiUrl;
        },
    }
</script>

<style scoped>

</style>
