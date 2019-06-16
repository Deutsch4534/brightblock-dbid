<template>
<div id="my-app-element" v-if="loaded">
  <div class="container p-2">
    <latest-offers />
  </div>
</div>
</template>

<script>
import LatestOffers from './components/general/LatestOffers';

export default {
  components: {
    LatestOffers,
  },
  name: "index",
  data() {
    return {
      loaded: false,
      content: null,
    };
  },
  mounted() {
    document.querySelector('body').classList.add('index');
    this.$prismic.client.getSingle("main-content").then(document => {
      this.$store.commit("contentStore/mainContent", document.data);
      this.loaded = true;
    });

  },
  beforeDestroy() {
    document.querySelector('body').classList.remove('index');
  },
  computed: {
  }
};
</script>

<style>
</style>
