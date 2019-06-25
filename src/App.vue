<template>
<div class="d-flex  justify-content-center align-items-center main" v-if="loading">
  <div class="mb-auto">&nbsp;</div>
  <div class="my-auto"><img :src="holding" style="img-fluid"/></div>
</div>
<div id="app" class="container-fluid m-0 p-0" v-else>
  <div id="fb-root"></div>
  <notifications position="bottom left" style="width: 600px;"/>
  <router-view name="header"/>
  <main class="main py-0">
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
        loading: true,
        holding: require("@/assets/img/preloader2.apng.png"),
      };
    },
    mounted() {
      let routeName = this.$route.name;
      document.dispatchEvent(new Event('custom-render-trigger'));
      let $self = this;
      setTimeout(function() {
        $self.loading = false
      }, 4000);
    }
  };
</script>
<style scoped>
.main {
  min-height: 100vh;
}
</style>
