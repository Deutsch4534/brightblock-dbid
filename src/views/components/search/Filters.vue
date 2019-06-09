<template>
  <div id="filter-art md-form search-form">
    <div class="row text-right mb-4">
        <div class="col-12"><a @click.prevent="clearSearch">clear search</a></div>
    </div>
    <div class="form-row mb-4">
      <div class="col-sm-12">
        <select @change="updateSearchType" class="text-black browser-default custom-select custom-select-md mb-3" v-model="objectType">
          <option value="" :disabled="true">Search For..</option>
          <option value="artwork">Artwork</option>
          <option value="gallery">Galleries</option>
          <option value="auction">Auctions</option>
        </select>
      </div>
    </div>
    <div v-if="objectType === 'artwork'">
      <div class="form-row mb-4">
        <div class="col-sm-10">
          <input  v-on:keyup.13.prevent="findBySearchTerm" type="text" class="query-field m-0 p-2 form-control" v-model="query" placeholder="Search"/>
        </div>
        <div class="col-sm-2">
          <a @click.prevent="findBySearchTerm"><mdb-icon icon="search" class="teal-text mt-3" style="line-height: 10px;" aria-hidden="true" size="2x"/></a>
        </div>
      </div>
      <div class="form-row mb-5">
        <div class="col-sm-12">
          <select class="text-black browser-default custom-select custom-select-md mb-3" v-model="medium" v-on:change="findByMedium">
            <option>Any Medium</option>
            <option v-for="(medium) in filters.media" :key="medium.value" :value="medium.value">{{medium.label}}</option>
          </select>
        </div>
      </div>
      <div class="form-row mb-5">
        <div class="col-sm-12">
          <select class="text-black browser-default custom-select custom-select-md mb-3" v-model="saleType" v-on:change="findBySaleType">
            <option>Any Sale Type</option>
            <option v-for="(saleType) in filters.saleTypes" :key="saleType.value" :value="saleType.value">{{saleType.label}}</option>
          </select>
        </div>
      </div>
      <div class="form-row mb-2" style="border-bottom: 1pt solid #ccc">
        <div class="col-sm-12">
          <h6>Tags</h6>
        </div>
        <div class="form-row mb-5">
          <div>
            <span v-for="keyword in filters.keywords" :key="keyword" class="px-1"><a @click.prevent="findByKeyword(keyword)"><mdb-btn rounded :color="keywordSelected(keyword)" size="sm" class="mx-0 waves-light"><small>{{keyword}}</small></mdb-btn></a></span>
          </div>
        </div>
      </div>
    </div>
  <!--
    <div class="hr-spacer"></div>
    <div id="priceRange">
      <span class="left">Price</span>
      <span class="right">€ {{ filters.price }}-50.000 </span>
      <br/>
      <input type="range" min="0" max="1000" step="1" class="slider" @change="updateFilter()" v-model="filters.price">
    </div>
    -->
  </div>
</template>

<script>
import { mdbIcon, mdbSelect, mdbBtn } from 'mdbvue';
import _ from "lodash";

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Filters',
  components: { mdbIcon, mdbSelect, mdbBtn },
  props: ["searchType"],
  data () {
    return {
      filters: {
        type: null,
        auction: false,
        keywords: this.$store.state.constants.taxonomy.keywords,
        media: this.$store.state.constants.taxonomy.media,
        saleTypes: this.$store.state.constants.taxonomy.saleTypes,
        price: 0
      },
      query: null,
      keywords: [],
      medium: "Any Medium",
      saleType: "Any Sale Type",
      objectType: "artwork",
      username: null
    }
  },
  mounted() {
    this.objectType = this.searchType;
    let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
    this.username = myProfile.username;
  },
  watch: {
    '$route' (to, from) {
      this.objectType = this.searchType;
    }
  },
  methods: {
    updateSearch (cause) {
      let query = [];
      if (this.query) {
        query.push("(title:" + this.query + " OR description:" + this.query + ")");
      } else if (cause === "findBySearchTerm") {
        //query.push("");
      }
      if (this.keywords.length > 0) {
        query.push("(keywords:" + this.keywords + ")");
      }
      if (this.medium && this.medium !== "Any Medium") {
        query.push("(medium:" + this.medium + ")");
      }
      if (this.saleType && this.saleType !== "Any Sale Type") {
        query.push("(saleType:" + this.saleType + ")");
      }
      let myQuery = (query.length > 0) ? query.join(" AND ") : "";
      if (this.username) {
        myQuery += " NOT (owner:" + this.username + ")";
      }
      let criteria = {
        field: "facet",
        query: myQuery,
        objectType: this.objectType
      }
      this.$emit("doSearch", criteria);
    },
    updateSearchType () {
      if (this.objectType === "gallery") {
        this.$router.push("/online-galleries");
      } else if (this.objectType === "auction") {
        this.$router.push("/online-auctions");
      } else {
        this.$router.push("/search");
      }
    },
    findBySearchTerm () {
      this.updateSearch("findBySearchTerm");
    },
    findByMedium () {
      this.updateSearch();
    },
    findBySaleType () {
      this.updateSearch();
    },
    findByKeyword: function(keyword) {
      let index = _.findIndex(this.keywords, function(o) {
        return o === keyword;
      });
      if (index === -1) {
        this.keywords.push(keyword);
      } else {
        this.keywords.splice(index, 1);
      }
      this.updateSearch();
    },
    clearSearch: function() {
      this.query = null;
      this.keywords = [];
      this.medium = "Any Medium";
      this.saleType = "Any Sale Type";
      this.updateSearch();
    },
    keywordSelected(kw) {
      if (this.keywords.join(" ").indexOf(kw) > -1) {
        return "purple";
      }
      return "white";
    }
  },
  computed: {
  }
}
</script>
<style scoped>
.query-field {
  color: black;
  font-size: 1.3em;
  text-transform: capitalize;
}
</style>
