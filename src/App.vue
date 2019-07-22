<template>
<div class="d-flex  justify-content-center align-items-center main" v-if="loading">
  <div class="mb-auto">&nbsp;</div>
  <div class="my-auto"><img :src="holding" style="img-fluid"/></div>
</div>
<div id="app" class="container-fluid m-0 p-0" v-else>
  <div id="fb-root"></div>
  <notifications position="bottom center" width="60%" />
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
    watch: {
      loading: function (val) {
        this.doMount();
      },
    },
    mounted() {
      let routeName = this.$route.name;
      /**
      if (routeName === "index") {
      }
      this.$prismic.client.getSingle("main-content").then(document => {
        this.$store.commit("contentStore/mainContent", document.data);
        this.loading = false;
      });
      **/
      this.loading = true;
      let $self = this;
      setTimeout(function() {
        $self.doMount();
      }, 3000);
      // document.dispatchEvent(new Event('custom-render-trigger'));
    },
    methods: {
      doMount() {
        this.loading = false;
      }
    }
  };
</script>
<style scoped>
.main {
  min-height: 100vh;
}
.my-notes {
  padding: 60px;
  margin: 0 5px 5px;
  font-size: 12px;
  color: #ffffff;
  border-left: 5px solid #187FE7;
}

.my-notes .notification-title {
  background-color: #efebe9;
}

.my-notes .notification-content {
}

.my-notes .warn {
  background: #ffb648;
  border-left-color: #f48a06;
}

.my-notes.error {
  background: #ff7043;
  border-left-color: #f48a06;
}

.my-notes .success {
  background: #ff7043;
  border-left-color: #42A85F;
}

</style>
