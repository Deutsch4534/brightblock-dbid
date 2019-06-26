<template>
<div id="my-app-element" class="mt-1" v-if="!loading">
  <banner v-if="showBanner" class="container mt-4 px-0 bg-light"/>
  <div class="container main pt-2">
    <latest-offers :myProfile="myProfile"/>
  </div>
</div>
</template>

<script>
import LatestOffers from './components/browse/LatestOffers';
import Banner from './components/help/Banner';

export default {
  components: {
    LatestOffers, Banner
  },
  name: "index",
  data() {
    return {
      loading: true,
      content: null,
      showBanner: false,
    };
  },
  watch: {
    '$route' (to, from) {
      this.setView();
    }
  },
  mounted() {
    document.querySelector('body').classList.add('index');
    this.$store.dispatch("myAccountStore/fetchMyAccount").then((myProfile) => {
      this.myProfile = myProfile;
      this.setView();

      this.$prismic.client.getSingle("main-content").then(document => {
        this.$store.commit("contentStore/mainContent", document.data);
        this.loading = false;
      });
    });
  },
  beforeDestroy() {
    document.querySelector('body').classList.remove('index');
  },
  methods: {
    setView: function() {
      let routeName = this.$route.name;
      if (routeName === "index") {
        this.showBanner = true;
      } else {
        this.showBanner = false;
      }
    }
  },
  computed: {
  }
};
</script>

<style>
</style>
