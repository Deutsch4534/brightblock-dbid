<template>
<div class="container">
  <!--
  <div class="d-flex justify-content-start">
    <a href="https://www.producthunt.com/posts/dbid-2?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-dbid-2" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=159460&theme=light" alt="dBid - Turn unused stuff into Bitcoin | Product Hunt Embed" style="width: 250px; height: 54px;" width="250px" height="54px" /></a>
  </div>

  <div class=""><button class="btn btn-rounded banner-text3"><span class="mr-3 banner-text3a"><a href="/sell">Get Started</a></span> <i class="fas fa-long-arrow-alt-right fa-2x text-light"></i></button></div><div class=" banner-text3b ">Earn your own Bitcoin!</div>
  -->
    <div class="d-flex justify-content-between">
      <div class="mt-3"><span v-html="latestOffers" class="mr-2"></span> <span class="badge badge-dark">{{resultSize}}</span></div>
      <div class="col-8 text-right">
        <div class="d-flex justify-content-end">
        <div class="input-group md-form form-sm form-1 pl-0 my-2">
          <div class="input-group-prepend">
            <a class="input-group-text lighten-3" id="basic-text1" @click="findBySearchTerm">
              <i class="fas fa-search elements"></i>
            </a>
          </div>
          <input class="form-control my-0 py-1 search-input" type="text"  v-on:keyup.13.prevent="findBySearchTerm" v-model="query" placeholder="Search" aria-label="Search">
          <a class="ml-2 text-light elements" @click.prevent="toggleAdvancedSearch()" title="toggle categories" style="position:relative; top:4px"><i class="fas fa-caret-square-down fa-2x elements"></i></a>
          <a class="ml-2 text-light elements" @click.prevent="clearSearch" title="clear search" style="position:relative; top:4px"><i class="fas fa-times fa-2x"></i></a>
        </div>
      </div>
    </div>
  </div>
  <div class="my-4" v-if="showCategories">
    <div class="text-capitalise mr-2 pb-2 border-top border-bottom" style="font-size: 0.9rem;">
      <span v-for="(category, index) in getCategory1Population" :key="index" class="ml-2 mt-2 p-1" :class="(filterCategory && filterCategory.name === category.name) ? 'badge text-dark badge-grey ' : 'badge badge-light'"><a style="text-decoration: capitalise;" v-html="category.name" @click.prevent="findByKeyword(category)"></a> <sup class="text-dark">{{category.hits}}</sup></span>
    </div>
    <div v-if="filterCategory" class="text-capitalise mr-2 pb-2 border-bottom" style="font-size: 0.9rem;">
      <span v-for="(category, index) in level2Categories" :key="index" class="badge badge- text-dark ml-2 mt-2 p-1"><a style="text-decoration: capitalise;" v-html="category.name" @click.prevent="findByKeyword(category)"></a> <sup class="text-primary">{{category.hits}}</sup></span>
    </div>
  </div>
</div>
</template>

<script>
import _ from "lodash";
import { mdbBtn, mdbBadge } from 'mdbvue';
import Taxonomy from "@/pages/components/utils/Taxonomy";

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
      level1: null,
      filterCategory: null,
      latestOffers: "Recent",
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
  },
  methods: {
    toggleAdvancedSearch () {
      this.showCategories = !this.showCategories;
      this.level1 = this.$store.getters["itemSearchStore/getCategory1Population"];
    },
    updateSearch (cause) {
      let query = [];
      if (this.query) {
        query.push("(title:" + encodeURI(this.query) + " OR description:" + encodeURI(this.query) + ")");
      }
      if (this.filterCategory) {
        query.push("(keywords:" + this.filterCategory.id + ")");
      }
      if (this.medium && this.medium === "digital") {
        query.push("(medium:digital)");
      }
      if (this.medium && this.medium === "physical") {
        query.push("(medium:physical)");
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

      if (!this.query && !this.filterCategory) {
        this.latestOffers = "Recent";
      } else {
        //this.latestOffers = "Found " + this.itemsSize + ": ";
        this.latestOffers = "Search: ";
        if (this.query && this.query.length > 0) {
          this.latestOffers += this.query;
        }
        if (this.filterCategory && this.filterCategory.length > 0) {
          this.latestOffers += " " + this.filterCategory.name;
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
    findByKeyword: function(category) {
      this.filterCategory = category;
      this.updateSearch();
    },
    clearSearch: function() {
      this.query = null;
      this.filterCategory = null;
      this.medium = "Any Medium";
      this.saleType = "Any Sale Type";
      this.showCategories = false;
      this.updateSearch();
    },
  },
  computed: {
    getCategory1Population() {
      let lev1 = this.$store.getters["itemSearchStore/getCategory1Population"];
      return lev1;
    },
    level2Categories() {
      if (this.filterCategory) {
        let lev2 = this.$store.getters["contentStore/getLevel2"](this.filterCategory);
        return lev2;
      }
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
.active-purple-2 input[type=text]:focus:not([readonly]) {
    border-bottom: 1px solid #4dd0e1;
    box-shadow: 0 1px 0 0 #4dd0e1;
}
.active-purple input[type=text] {
    border-bottom: 1px solid #4dd0e1;
    box-shadow: 0 1px 0 0 #4dd0e1;
}
.active-purple .fa, .active-purple-2 .fa {
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

.elements {
  color: #78909c;
}
.magglass {
  color: #37474f;
}
.search-input {
  background-color: #eceff1;
  color: #37474f;
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
