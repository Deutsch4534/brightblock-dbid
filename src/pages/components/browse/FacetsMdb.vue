<template>
<div class="container mb-5">
    <div class="d-flex justify-content-between">
      <button type="button" class="btn btn-primary btn-sm">
        <span v-html="latestOffers" class="mr-3"></span> <span class="badge badge-light">{{resultSize}}</span>
      </button>
      <div class="col-8 text-right">
        <div class="d-flex justify-content-end">
        <div class="input-group md-form form-sm form-1 pl-0 my-2">
          <div class="input-group-prepend">
            <a class="input-group-text purple lighten-3" id="basic-text1" @click="findBySearchTerm">
              <i class="fas fa-search"></i>
            </a>
          </div>
          <input class="form-control my-0 py-1" type="text"  v-on:keyup.13.prevent="findBySearchTerm" v-model="query" placeholder="Search" aria-label="Search">
          <a class="ml-2 text-light" @click.prevent="showCategories = !showCategories" title="toggle categories" style="position:relative; top:4px"><i class="fas fa-caret-square-down fa-2x"></i></a>
          <a class="ml-2 text-light" @click.prevent="clearSearch" title="clear search" style="position:relative; top:4px"><i class="fas fa-times fa-2x"></i></a>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-3" v-if="showCategories">
    <div class="d-flex justify-content-start">
      <span class="mr-4 text-white d-none d-sm-none d-md-block" style="position:relative; top: 7px;">Advanced Search Options</span>
      <vue-bootstrap-typeahead inputClass="validate" placeholder="Keywords" :minMatchingChars="0" :data="keywordNames" v-model="searchword" @hit="findByKeyword"/>
      <select class="text-black browser-default custom-select custom-select-md mb-3 ml-4" v-model="medium" style="width:150px;" v-on:change="findByMedium">
        <option>Type</option>
        <option v-for="(medium) in filters.media" :key="medium.value" :value="medium.value">{{medium.label}}</option>
      </select>
    </div>
    <div class="d-flex text-lowercase mr-2">
    </div>
    <div class="d-flex text-lowercase mr-2">
      <span class="badge badge-pill badge-dark ml-2" v-for="(category, index) in level1Categories" :key="index"><a v-html="category.name" @click="findByKeyword(category.name)"></a></span>
    </div>
  </div>
</div>
</template>

<script>
import _ from "lodash";
import { mdbBtn, mdbBadge } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Filters',
  components: {
    mdbBtn, mdbBadge
  },
  props: ["itemsSize"],
  data () {
    return {
      query: null,
      latestOffers: "Recent",
      keywords: [],
      keywordNames: [],
      searchword: null,
      rawKeyword: null,
      medium: "Type",
      saleType: "Any Sale Type",
      username: null,
      showCategories: false,
      filters: {
        media: this.$store.state.constants.taxonomy.media,
        saleTypes: this.$store.state.constants.taxonomy.saleTypes,
        price: 0
      },
    }
  },
  mounted() {
    this.latestOffers = "Recent";
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
        query.push("(title:" + encodeURI(this.query) + " OR description:" + encodeURI(this.query) + ")");
      } else if (cause === "findBySearchTerm") {
        //query.push("");
      }
      if (this.searchword && this.searchword.length > 0) {
        query.push("(keywords:" + encodeURI(this.searchword) + ")");
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
        this.latestOffers = "Recent";
      } else {
        //this.latestOffers = "Found " + this.itemsSize + ": ";
        this.latestOffers = "Search: ";
        if (this.query && this.query.length > 0) {
          this.latestOffers += this.query;
        }
        if (this.searchword && this.searchword.length > 0) {
          this.latestOffers += " " + this.rawKeyword;
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
      this.rawKeyword = keyword;
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
      this.showCategories = false;
      this.updateSearch();
    },
  },
  computed: {
    level1Categories() {
      let lev1 = this.$store.getters["contentStore/getLevel1"];
      return lev1;
    },
    resultSize() {
      let results = this.$store.getters["itemSearchStore/getSearchResults"];
      if (results) {
        return results.length;
      }
      return 0;
    }
  }
}
</script>
<style>
.active-cyan-2 input[type=text]:focus:not([readonly]) {
    border-bottom: 1px solid #4dd0e1;
    box-shadow: 0 1px 0 0 #4dd0e1;
}
.active-cyan input[type=text] {
    border-bottom: 1px solid #4dd0e1;
    box-shadow: 0 1px 0 0 #4dd0e1;
}
.active-cyan .fa, .active-cyan-2 .fa {
    color: #4dd0e1;
}
.input-group {
  width: 300px;
}
.input-group.md-form.form-sm.form-1 input{
  border: 1px solid #bdbdbd;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
}
.input-group.md-form.form-sm.form-2 input {
    border: 1px solid #bdbdbd;
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
}
.input-group.md-form.form-sm.form-2 input.red-border  {
    border: 1px solid #ef9a9a;
}
.input-group.md-form.form-sm.form-2 input.lime-border  {
    border: 1px solid #cddc39;
}
.input-group.md-form.form-sm.form-2 input.amber-border  {
    border: 1px solid #ffca28;
}

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
