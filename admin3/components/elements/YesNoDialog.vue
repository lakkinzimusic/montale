<template>
  <div style="display: inline-block">
    <v-btn
      :color="color?color:'primary'"
      dark
      @click.stop="dialog = true"
    >
      <slot>Открыть</slot>
    </v-btn>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">{{title?title:'Вы уверены?'}}</v-card-title>

        <v-card-text>
          {{text?text:'Это действие необратимо'}}
        </v-card-text>

        <v-card-actions>
          <div class="flex-grow-1"></div>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false, $emit('no')"
          >
            {{labelNo?labelNo:'Нет'}}
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false, $emit('yes')"
          >
            {{labelYes?labelYes:'Да'}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

</template>

<script>
    export default {
        name: "YesNoDialog",
        props: ['labelYes', 'labelNo', 'color', 'title', 'text'],
        data(){
            return {
                dialog:false,
            }
        }
    }
</script>

<style scoped>

</style>
