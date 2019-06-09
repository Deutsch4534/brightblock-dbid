<template>
<mdb-container fluid class="main bg-dark flex-1 py-5">
  <mdb-container fluid class="py-3">
    <div class="row">
      <div class="col-md-3 col-sm-12">
        <h2 class="h2-responsive mb-3 mx-3 text-white">Search {{searchType}}</h2>
        <h4 class="h4-responsive mb-2 mx-3 text-white">{{numberResults}} Results</h4>
        <filters @doSearch="doSearch($event)" class="text-white mx-3"/>
      </div>
      <div class="col-md-9 col-sm-12">
        <div class="row article" v-if="objectType === 'gallery'">
          <!-- <single-result-gallery v-for="(gallery, index) of gallerySearchResults" :key="index" :gallery="gallery" class="result-item"/> -->
          <single-gallery v-for="(gallery, index) of gallerySearchResults" :key="index" :gallery="gallery" :context="'search'"/>
        </div>
        <div class="row article" v-else-if="objectType === 'auction'">
          <single-auction v-for="(auction, index) of auctionSearchResults" :key="index" :auction="auction"/>
        </div>
        <div class="row article" v-else>
          <single-result-artwork v-for="(artwork, index) of artworkSearchResults" :key="index" :artwork="artwork" class="result-item"/>
        </div>
      </div>
    </div>
  </mdb-container>
</mdb-container>
</template>

<script>
import SingleResultArtwork from "./components/search/SingleResultArtwork";
import SingleGallery from "./components/gallery/SingleGallery";
import SingleAuction from "./components/auction/SingleAuction";
import Filters from "./components/search/Filters";
import searchIndexService from "@/services/searchIndexService";
import artworkSearchService from "@/services/artworkSearchService";
import { mdbContainer, mdbRow } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Search",
  bodyClass: "index-page",
  components: {
    SingleResultArtwork, SingleGallery, SingleAuction,
    Filters,
    mdbContainer,
    mdbRow,
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
