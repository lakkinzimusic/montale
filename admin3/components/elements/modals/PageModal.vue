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
      <v-card :loading="!page">
        <template v-if="page">
          <v-card-title class="headline">Страница "{{page.name}}"</v-card-title>
          <v-divider/>
          <v-container>
            <v-layout>
              <v-flex>
                <v-text-field
                  label="Название страницы"
                  v-model="page.name"
                  hint="Будет установлено в h1 страницы"
                  outlined
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout>
              <v-flex>
                <v-text-field
                  label="Заголовок страницы"
                  v-model="page.title"
                  hint="Будет установлено в title страницы"
                  outlined
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout>
              <v-flex>
                <v-text-field
                  label="Ссылка"
                  v-model="page.slug"
                  :hint="'http://site.ru/perfumes/'+page.slug"
                  outlined
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout>
              <v-flex>
                <visual-editor :item="page" :field="'content'"></visual-editor>
              </v-flex>
            </v-layout>
          </v-container>
          <v-divider/>
        </template>
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
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
    import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
    import Adapter from "../../../scripts/ckeditorUploadAdapter";
    import VisualEditor from "../VisualEditor";

    export default {
        name: "PageModal",
        components: {VisualEditor},
        props: ['page_id'],
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
                page: null
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
                let page = await this.$axios.$get(`/api/page/pages/${this.$props.page_id}`);
                this.page = page;
            },
            async save() {
                await this.$axios.$put(`/api/page/pages/${this.$props.page_id}`, this.page);
                this.$emit('refresh');
            }
        }
    }
</script>

<style scoped>

</style>
