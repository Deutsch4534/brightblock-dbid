<template>
<div class="container flex-1 py-5">
  <div class="py-3">
    <div class="row">
      <div class="col-md-3 col-sm-12">
        <h2 class="h2-responsive mb-3 mx-3 text-white">Search {{searchType}}</h2>
        <h4 class="h4-responsive mb-2 mx-3 text-white">{{numberResults}} Results</h4>
        <filters @doSearch="doSearch($event)" class="text-white mx-3"/>
      </div>
      <div class="col-md-9 col-sm-12">
        <div class="row article" v-else>
          <single-item v-for="(item, index) of items" :key="index" :item="item" class="result-item"/>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import SingleResult from "@/pages/components/browse/SingleItem";
import Filters from "./components/search/Filters";
import searchIndexService from "@/services/searchIndexService";
import artworkSearchService from "@/services/artworkSearchService";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Search",
  bodyClass: "index-page",
  components: {
    SingleResultArtwork, SingleGallery, SingleAuction,
    Filters,
  },
  data() {
    return {
      results: [],
      objectType: "artwork",
      queryString:
        this.$route && this.$route.params.query
          ? parseInt(this.$route.params.query)
          : undefined
    };
  },
  mounted() {
    this.doMount();
  },
  watch: {
    '$route' (to, from) {
      this.doMount();
    }
  },
  methods: {
    doMount() {
      this.objectType = this.$route.name;
      this.queryString = this.$route.query.query;
      if (!this.queryString) {
        this.queryString = "*";
      }
      if (this.objectType === "auction") {
        this.$store.dispatch("onlineAuctionsStore/fetchOnlineAuctions").then(() => {
          // loading online auctions
        });
      } else if (this.objectType === "gallery") {
        this.$store.dispatch("galleryStore/fetchOnlineGalleries", {field: "title", query: "*"}).then(() => {
          // loading online galleries
        });
      } else {
        artworkSearchService.newQuery(this.$store, {field: "title", query: this.queryString});
      }
    },
    doSearch(criteria) {
      if (!criteria.objectType) {
        criteria.objectType = "artwork";
      }
      //if (!criteria.query) {
      //  criteria.query = "*";
      //}
      if (!criteria.field) {
        criteria.field = "title";
      }
      this.objectType = criteria.objectType;
      if (criteria.objectType === "artwork") {
        artworkSearchService.newQuery(this.$store, {field: criteria.field, query: criteria.query});
      } else if (criteria.objectType === "auction") {
        this.$store.dispatch("onlineAuctionsStore/fetchOnlineAuctions").then(() => {
          // loading online auctions
        });
      } else if (criteria.objectType === "gallery") {
        this.$store.dispatch("galleryStore/fetchOnlineGalleries", {field: criteria.field, query: criteria.query});
      }
      // this.$router.push("/search?query=" + criteria.query);
    },
  },
  computed: {
    searchType() {
      if (this.objectType === "gallery") {
        return "Galleries";
      } else if (this.objectType === "auction") {
        return "Auctions";
      } else {
        return "Artwork";
      }
    },
    numberResults() {
      if (this.objectType === "gallery") {
        return this.$store.getters["galleryStore/getSearchResults"].length;
      } else if (this.objectType === "auction") {
        return this.$store.getters["onlineAuctionsStore/onlineAuctions"].length;
      } else {
        return this.$store.getters["artworkSearchStore/numberSearchResults"];
      }
    },
    artworkSearchResults() {
      return this.$store.getters["artworkSearchStore/getSearchResults"];
    },
    gallerySearchResults() {
      return this.$store.getters["galleryStore/getSearchResults"];
    },
    auctionSearchResults() {
      return this.$store.getters["onlineAuctionsStore/onlineAuctions"];
    }
  }
};
</script>
<style scoped>
.main {
  min-height: 100vh;
}
.article {
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  justify-content: flex-start;
}
@media (max-width: 900px) {
  .article {
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    justify-content: center;
  }
}
.result-item {
  color: white;
}
</style>
