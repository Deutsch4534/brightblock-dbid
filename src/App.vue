<template>
  <div id="app" class="container-fluid m-0 p-0">
    <div id="fb-root"></div>
    <notifications position="top center"/>
    <router-view name="header"/>
    <main class="main pb-5">
      <router-view/>
    </main>
    <router-view name="footer"/>
  </div>
</template>

<script>
  export default {
    components: {},
    bodyClass: "index-page",
    data() {
      return {
        showLeafs: true
      };
    },
    mounted() {
      let routeName = this.$route.name;
      if (routeName === "brightBlock" || routeName === "profile") {
        this.showLeafs = true;
      }
      document.dispatchEvent(new Event('custom-render-trigger'));
    }
  };
</script>
<style scoped>
.main {
  min-height: 100vh;
}
</style>
