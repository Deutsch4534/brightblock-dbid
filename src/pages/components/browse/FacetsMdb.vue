<template>
<div class="container mb-5">
    <div class="row">
      <div class="col-4 d-none d-sm-none d-md-block">
        <div class="text-lowercase"><mdb-btn color="elegant-color" rounded><a href="#" v-html="latestOffers"></a> [{{resultSize}}]</mdb-btn></div>
      </div>
      <div class="col-8 text-right">
        <div class="d-flex justify-content-end">
        <div class="input-group md-form form-sm form-1 pl-0">
          <div class="input-group-prepend">
            <span class="input-group-text purple lighten-3" id="basic-text1">
              <mdbIcon icon="search"/>
            </span>
          </div>
          <input class="form-control my-0 py-1" type="text"  v-on:keyup.13.prevent="findBySearchTerm" v-model="query" placeholder="Search" aria-label="Search">
          <a class="ml-2 text-light" @click.prevent="showCategories = !showCategories" title="toggle categories" style="position:relative; top:4px"><i class="fas fa-caret-square-down fa-2x"></i></a>
          <a class="ml-2 text-light" @click.prevent="clearSearch" title="clear search" style="position:relative; top:4px"><i class="fas fa-times fa-2x"></i></a>
        </div>
      </div>
    </div>
  </div>
  <div class="" v-if="showCategories">
    <div><vue-bootstrap-typeahead inputClass="validate" :minMatchingChars="0" :data="keywordNames" v-model="searchword" @hit="findByKeyword"/></div>
    <div><p class="text-lowercase mr-2"><a v-for="(category, index) in level1Categories" class="mr-2" :key="index"  @click="findByKeyword(category.name)"><u><span v-html="category.name"></span></u></a></p></div>
  </div>
</div>
</template>

<script>
import _ from "lodash";
import { mdbIcon, mdbFormInline, mdbInput, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Filters',
  components: {
    mdbIcon, mdbFormInline, mdbInput, mdbBtn
  },
  props: ["itemsSize"],
  data () {
    return {
      query: null,
      latestOffers: "Recently Added",
      keywords: [],
      keywordNames: [],
      searchword: null,
      rawKeyword: null,
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
        this.latestOffers = "Recent items";
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
