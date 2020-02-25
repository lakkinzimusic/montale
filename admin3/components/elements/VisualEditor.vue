<template>
  <div>
    <div class="text-center">
      <v-switch
        v-model="source"
        label="Исходный код"
      ></v-switch>
    </div>

    <div v-if="!source">
      <ckeditor :editor="editor" v-model="item[field]" :config="editorConfig"></ckeditor>
    </div>
    <div v-else>
      <prism-editor :code="item[field]" language="html" @change="item[field] = $event"></prism-editor>
    </div>
  </div>

</template>

<script>
    import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
    import Adapter from "../../scripts/ckeditorUploadAdapter";
    import "prismjs";
    import "prismjs/themes/prism.css";
    import PrismEditor from 'vue-prism-editor'


    export default {
        name: "VisualEditor",
        props: ["item", "field"],
        components: {
            PrismEditor
        },
        data(){
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

                source: false
            }
        }
    }
</script>

<style scoped>

</style>
