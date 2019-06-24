<template>
<div id="my-app-element" class="mt-1" v-if="loaded">
  <banner v-if="showBanner" class="mx-0 mt-1 px-0 "/>
  <div class="container main pt-5">
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
      loaded: false,
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
      this.loaded = true;

      this.$prismic.client.getSingle("main-content").then(document => {
        this.$store.commit("contentStore/mainContent", document.data);
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
