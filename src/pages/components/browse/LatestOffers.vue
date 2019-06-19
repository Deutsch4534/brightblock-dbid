<template>
<div class="container">
  <facets @doSearch="doSearch($event)" :itemsSize="itemsSize"/>
  <div class="">
    <div class="row">
        <single-item class="col-md-6" v-for="(item, index) of items" :key="index" :item="item" :myProfile="myProfile"/>
    </div>
  </div>
</div>
</template>

<script>
import Facets from "@/pages/components/browse/Facets";
import SingleItem from "@/pages/components/browse/SingleItem";

export default {
  name: 'LatestOffers',
  components: {
    SingleItem, Facets
  },
  props: {
    myProfile: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  data() {
    return {
      latestOffers: null,
    };
  },
  mounted() {
    document.title = "Dbidio - items buying and selling";
    //let content = this.$store.state.contentStore.content["main-content"];
    //this.latestOffers = content["latest-offers"][0].text;
    this.doMount();
  },
  computed: {
    items() {
      return this.$store.getters["itemSearchStore/getSearchResults"];
    },
    itemsSize() {
      return this.$store.getters["itemSearchStore/getSearchResults"].length;
    }
  },
  methods: {
    doMount() {
      this.$store.dispatch("itemSearchStore/fetchItems", {field: "title", query: "*"}).then((items) => {
        this.loading = false;
      });
    },
    doSearch(criteria) {
      if (!criteria.objectType) {
        criteria.objectType = "item";
      }
      if (!criteria.field) {
        criteria.field = "title";
      }
      this.$store.dispatch("itemSearchStore/searchItems", criteria).then((results) => {
        // loading online auctions
      });
    },
  }
}
</script>
<style scoped>
</style>
