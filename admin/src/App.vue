<template>
  <div id="app">
    <div id="app_inner">
      <template>
        <header-block v-on:switch="menuCollapsed = !menuCollapsed"></header-block>
        <el-container>
          <el-container>
            <aside-block :menu-collapsed="menuCollapsed"></aside-block>
            <el-main>
              <transition name="slide">
                <router-view></router-view>
              </transition>
            </el-main>
          </el-container>
        </el-container>

      </template>

      </div>
  </div>
</template>

<script>
    import HeaderBlock from "./components/layouts/HeaderBlock";
    import AsideBlock from "./components/layouts/AsideBlock";
    export default {
        name: 'App',
        components: {AsideBlock, HeaderBlock},
        data(){
            return {
                menuCollapsed: false,
            }
        },
        mounted(){
            // this.$store.commit('auth/init_token');
            // this.axios.defaults.headers.common['Authorization'] = this.$store.state.auth.token;

        }
     }
</script>

<style>
  body {
    margin: 0;
  }

  #app{
    font-family: Arial;
    min-height: 100vh;
  }




  .el-header {
    background-color: #000;
    color: #fff;
  }

  .el-aside {
    color: #000;
  }

  /*.mi_button *{*/
    /*vertical-align: middle;*/
  /*}*/

  /*.mi_button i{*/
    /*font-size: 24px;*/
    /*line-height: 16px;*/
    /*margin-right: 5px;*/
  /*}*/

  /*.smooth-enter-active, .smooth-leave-active {*/
    /*transition: height .5s;*/
    /*overflow: hidden;*/
  /*}*/
  /*.smooth-enter, .smooth-leave-to {*/
    /*height: 0;*/
  /*}*/
</style>
