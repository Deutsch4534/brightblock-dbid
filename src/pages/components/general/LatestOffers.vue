<template>
<div class="container">
  <div class="d-flex text-primary border-bottom p-3 mb-4">
    <div>{{latestOffers}}</div>
  </div>
  <div class="container">
    <single-item v-for="(item, index) of items" :key="index" :item="item"/>
  </div>
</div>
</template>

<script>
import SingleItem from "@/pages/components/selling/SingleItem";

export default {
  name: 'LatestOffers',
  data() {
    return {
      latestOffers: null,
    };
  },
  components: {
    SingleItem
  },
  mounted() {
    let content = this.$store.state.contentStore.content["main-content"];
    this.latestOffers = content["latest-offers"][0].text;
    this.doMount();
  },
  computed: {
    items() {
      return this.$store.getters["itemSearchStore/getSearchResults"];
    }
  },
  methods: {
    doMount() {
      this.$store.dispatch("itemSearchStore/fetchItems", {field: "title", query: "*"}).then((items) => {
        document.title = "Dbidio - items buying and selling";
        this.loading = false;
      });
    },
  }
}
</script>
<style scoped>
</style>
