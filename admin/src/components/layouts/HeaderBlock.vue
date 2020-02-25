<template>
  <el-header>
    <el-row>
      <el-col :span="1"><i class="mi mi-menu"
                           style="height: 34px;display: inline-block;vertical-align: sub;cursor: pointer;"
                           @click="$emit('switch')"></i></el-col>
      <el-col :span="4">Rybalkashop Admin v3</el-col>
      <el-col :span="19" class="text-right">
        <el-button @click="inLog()" type="primary">inLog</el-button>
      </el-col>
    </el-row>
  </el-header>
</template>

<script>
  export default {
    name: "HeaderBlock",
      data() {
          return {
              token: '',
          }
      },
    methods: {
      inLog: function(){

        this.$store.commit('auth/set_token',{token});
      }
    }
  }
</script>

<style scoped>

</style>
