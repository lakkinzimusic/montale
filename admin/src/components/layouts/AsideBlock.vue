<template>
  <el-aside :width="menuCollapsed?'65px':'200px'">
    <el-menu id="mainmenu"
             :collapse="menuCollapsed"
             default-active="2"
             class="el-menu-vertical-demo"
             :router="true"
    >

      <template v-for="(item, index) in menu">
        <template v-if="item.items">
          <el-submenu :index="index.toString()">
            <template slot="title">
              <i :class="'mi '+item.icon"></i>
              <span>{{item.label}}</span>
            </template>
            <el-menu-item v-for="subitem in item.items" :key="subitem.label" :index="subitem.label"
                          :route="subitem.link">
              <i :class="'mi '+subitem.icon"></i>
              <span>{{subitem.label}}</span>
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :key="item.label" :index="item.label" :route="item.link">
            <i :class="'mi '+item.icon"></i>
            <span>{{item.label}}</span>
          </el-menu-item>
        </template>
      </template>

    </el-menu>
  </el-aside>
</template>

<script>
  export default {
    name: "AsideBlock",
    props: ['menuCollapsed'],
    data() {
      return {
        menu: [
          {'label': "Главная", 'icon': 'mi-dashboard', 'link': '/'},
          {'label': "Товары", 'icon': 'mi-dashboard', 'link': '/products'},
          {'label': "Пользователи", 'icon': 'mi-dashboard', 'link': '/users'},
        ]
      }
    }
  }
</script>

<style scoped>
  /*#mainmenu {*/
    /*min-height: calc(100vh - 60px);*/
  /*}*/

</style>
