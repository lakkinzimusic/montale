<template>
  <div>
    <div id="link" @click.stop="dialog = true" style="width: 100%">
      <slot>
        <v-btn>Изменить</v-btn>
      </slot>
    </div>
    <v-dialog
      v-model="dialog"
      max-width="20vw"
    >
      <v-card :loading="!collection">
        <template v-if="collection">
          <v-card-title class="headline">{{collection.collection_name}}</v-card-title>

          <v-card-text>
            <v-divider/>
            <v-text-field v-model="collection.collection_name" label="Наименование"></v-text-field>
            <div>
              <label>Изображение</label>
              <div id="category_picture">
                <template v-if="collection.image_url">
                  <img style="max-width: 100%;max-height: 100%;" :src="`${baseUrl}/${collection.image_url}`"/>
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
            </div>
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
    export default {
        name: "CollectionModal",
        components: {},
        props: ['collection_id'],
        data() {
            return {
                dialog: false,
                collection: null
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
                let collection = await this.$axios.$get(`/api/catalog/collections/${this.$props.collection_id}`);
                this.collection = collection;
            },
            async save() {
                await this.$axios.$put(`/api/catalog/collections/${this.$props.collection_id}`, this.collection);
                this.$emit('refresh');
            },
            async uploadFile() {
                let formData = new FormData();
                formData.append('file', this.$refs.file.files[0]);
                let res = await this.$axios.$post('/api/upload-file', formData);
                this.collection.image_url = res;
            },
        }
    }
</script>

<style scoped>
  #category_picture {
    text-align: center;
    width: 17vw;
    height: 17vw;
    position: relative;
  }

  #category_picture img{
    width: 100%;
    height: 100%;
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
