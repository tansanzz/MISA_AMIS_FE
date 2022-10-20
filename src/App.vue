<template>
  <div class="layout--main">
    <div class="menu--container">
      <TheMenu />
    </div>
    <div id="content-area" class="content-area">
      <TheTopNavbar />
      <router-view></router-view>
    </div>
  </div>
  <div class="loading" v-show="this.$store.state.isLoading">
    <img src="./assets/loading.svg" alt="" srcset="" />
  </div>
</template>

<script>
import TheMenu from "./components/layout/TheMenu.vue";
import TheTopNavbar from "./components/layout/TheTopNavbar.vue";

export default {
  name: "App",
  components: {
    TheMenu,
    TheTopNavbar,
  },
};
</script>

<style>
@import "./styles/main.css";
@import "./styles/layouts/content.css";
@import "./styles/base/icon.css";
</style>
