<template>
  <v-card id="card_offset" class="mx-auto" width="100%" :loading="loading">
    <div id="icon_offset" style="position: absolute;
    left: 15px;
    top: -15px;">
      <v-card width="80px" :color="color" dark="dark" :elevation="5" height="80px" id="icon_card">
        <v-icon>{{icon}}</v-icon>
      </v-card>
    </div>
    <v-card-title style="justify-content: flex-end">
        {{title}}
    </v-card-title>
    <v-card-text id="text" style="text-align: right" v-if="!loading" v-html="text"></v-card-text>
    <v-divider class="mx-4"></v-divider>
    <slot>
      <v-card-actions>
        <v-btn text>Click</v-btn>
      </v-card-actions>
    </slot>
  </v-card>
</template>

<script>
    export default {
        name: "StatsCard",
        props: ['title', 'text', 'icon', 'color', 'dark', 'loading']
    }
</script>

<style scoped>


  #icon_card{
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #icon_card i{
    font-size: 200%;
  }

  #card_offset{
    margin-top: 25px;
  }

  #text{
    font-size: 200%;
  }
</style>
