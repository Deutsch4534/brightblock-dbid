<template>
<div class="container mb-5">
  <div class="row mb-2">
    <div class="col-4"><p class="text-muted text-lowercase">{{latestOffers}}</p></div>
    <div class="col-8" id="search-form">
      <form class="form-inline justify-content-end">
        <div class="d-flex justify-content-end">
          <a @click.prevent="showCategories = !showCategories" style="position:relative; top:7px" class="mr-4">categories</a> <vue-bootstrap-typeahead inputClass="validate" :minMatchingChars="0" :data="keywordNames" v-model="searchword" @hit="findByKeyword"/>
          <input v-on:keyup.13.prevent="findBySearchTerm" type="text" class="mr-3 query-field m-0 ml-3 p-2 form-control" style="width: 300px;" v-model="query" placeholder="Search"/>
          <div class="text-light" style="position: relative; top: 7px;">
            <a @click.prevent="findBySearchTerm"><i class="fas fa-search fa-2x"></i></a>
            <a class="ml-2" title="clear search" @click.prevent="clearSearch"><i class="fas fa-times fa-2x"></i></a>
          </div>
        </div>
      </form>
    </div>
  </div>
  <div class="row" v-if="showCategories">
    <div class="col-12"><p class="text-lowercase text-primary mr-2"><a v-for="(keyword, index) in keywordNames" class="mr-2" :key="index"  @click="findByKeyword(keyword)"><u>{{keyword}}</u></a></p></div>
  </div>
</div>

</template>

<script>
import _ from "lodash";

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Filters',
  components: { },
  props: ["itemsSize"],
  data () {
    return {
      query: null,
      latestOffers: "Recently Added",
      keywords: [],
      keywordNames: [],
      searchword: null,
      medium: "Any Medium",
      saleType: "Any Sale Type",
      username: null,
      showCategories: false,
    }
  },
  mounted() {
    this.latestOffers = "Recently Added";
    let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
    this.username = myProfile.username;
    let $self = this;
    this.$store.dispatch("contentStore/fetchTaxonomy").then((keywords) => {
      $self.keywordNames = keywords.map(keyword => keyword.name);
    });
  },
  methods: {
    updateSearch (cause) {
      let query = [];
      if (this.query) {
        query.push("(title:" + this.query + " OR description:" + this.query + ")");
      } else if (cause === "findBySearchTerm") {
        //query.push("");
      }
      if (this.searchword && this.searchword.length > 0) {
        query.push("(keywords:" + this.searchword + ")");
      }
      if (this.medium && this.medium !== "Any Medium") {
        query.push("(medium:" + this.medium + ")");
      }
      if (this.saleType && this.saleType !== "Any Sale Type") {
        query.push("(saleType:" + this.saleType + ")");
      }
      let myQuery = (query.length > 0) ? query.join(" OR ") : "";
      if (this.username) {
        // myQuery += " NOT (owner:" + this.username + ")";
      }
      let criteria = {
        field: "facet",
        query: myQuery,
        objectType: "item"
      }

      if (!this.query && !this.searchword) {
        this.latestOffers = "Recent items";
      } else {
        //this.latestOffers = "Found " + this.itemsSize + ": ";
        this.latestOffers = "Found: ";
        if (this.query && this.query.length > 0) {
          this.latestOffers += this.query;
        }
        if (this.searchword && this.searchword.length > 0) {
          this.latestOffers += " " + this.searchword;
        }
      }

      this.$emit("doSearch", criteria);
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
      if (keyword && keyword.length > 1) {
        this.searchword = keyword.trim();
        let regexp = new RegExp(" ", 'g');
        this.searchword = this.searchword.replace(regexp, "\\ ");
        this.keywords.push(this.searchword);
      } else {
        this.searchword = null;
      }
      this.updateSearch();
    },
    clearSearch: function() {
      this.query = null;
      this.searchword = null;
      this.keywords = [];
      this.medium = "Any Medium";
      this.saleType = "Any Sale Type";
      this.updateSearch();
    },
  },
  computed: {
  }
}
</script>
<style>
.keyword {
  text-transform: lowercase;
}
.query-field {
  color: gray;
  font-size: 1.0em;
  border: none;
  border-bottom: 1pt solid #ccc;
}
</style>
