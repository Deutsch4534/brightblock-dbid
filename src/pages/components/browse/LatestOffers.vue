<template>
<div class="container">
  <div class="row">
    <facets-mdb @doSearch="doSearch($event)" :itemsSize="itemsSize"/>
  </div>
  <mdb-masonry horizontal>
    <mdb-masonry-item :itemStyle="{'width': '222px', 'height': 'auto'}" class="p-0" v-for="(item, index) of items" :key="index">
      <single-item-card :item="item" :myProfile="myProfile"/>
    </mdb-masonry-item>
  </mdb-masonry>
  <!--
  <div class="">
    <div class="row">
      <single-item-card class="col-md-4" v-for="(item, index) of items" :key="index" :item="item" :myProfile="myProfile"/>
    </div>
  </div>
  -->
</div>
</template>

<script>
import FacetsMdb from "@/pages/components/browse/FacetsMdb";
import SingleItemCard from "@/pages/components/browse/SingleItemCard";
import { mdbMasonry, mdbMasonryItem } from 'mdbvue';

export default {
  name: 'LatestOffers',
  components: {
    SingleItemCard, FacetsMdb,
    mdbMasonry,
    mdbMasonryItem
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
.masonry-horizontal div {
  display: flex;
  justify-content: left;
  align-items: top;
  color: white;
  width: 100%;
  height: auto;
  margin: 0.5rem;
  font-weight: 900;
  font-size: 2rem;
}
@media (max-width: 800px) {
  .masonry-horizontal div {
    justify-content: center;
  }
}

</style>
