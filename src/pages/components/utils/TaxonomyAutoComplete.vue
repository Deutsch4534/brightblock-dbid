<template>
<div class="text-dark text-sm">
  <autocomplete
    :url="url"
    placeholder="Type and select categories"
    anchor="name"
    label="writer"
    :onInput="onInput"
    :on-select="getData"
    :onShouldRenderChild="renderChild"
    v-on:keyup.13.prevent="hitOne"
    :min="2">
  </autocomplete>
  <div class="mt-4 mb-3">Selected Categories [{{chosen.length}}]</div>
  <div class="">
    <a class="badge badge-pill badge-primary mr-3 p-2 mt-1" v-for="(keyword, index) in chosen" :key="index" @click.prevent="unchoose(keyword)">
      <span v-html="keyword.name" class="mr-2"></span> <i class="fas fa-backspace"></i>
    </a>
  </div>
</div>
</template>

<script>
import _ from "lodash";
import { mdbBtn } from "mdbvue";
import Autocomplete from 'vue2-autocomplete-js'

const dev = location.origin.indexOf("localhost") > -1;
const gatewayUrl = (dev) ? "http://localhost:8191" : "https://api.brightblock.org";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "TaxonomyAutoComplete",
  components: {
    mdbBtn, Autocomplete
  },
  props: ["modal", "title", "initCategories"],
  data() {
    return {
      categories: [],
      chosen: [],
      loaded: false,
      url: gatewayUrl + "/trading/taxonomy/fetch"
    };
  },
  mounted() {
    // this.$store.dispatch("contentStore/fetchTaxonomy").then((categories) => {
    //  this.categories = categories;
    // });
    if (this.initCategories && Array.isArray(this.initCategories)) {
      this.chosen = this.initCategories;
    }
    this.loaded = true;
  },
  computed: {
  },
  methods: {
    getData: function(obj) {
      console.log("getData", obj);
      return this.hitOne(obj);
    },
    onInput: function(obj) {
      console.log("onInput", obj);
      //let $input = document.getElementsByClassName("autocomplete-input")[0];
      //$input.value = null;
    },
    renderChild: function(obj) {
      console.log("renderChild", obj);
      return `
        <span>${obj.name}</span>
      `
    },
    onBlur: function(obj) {
      console.log("onBlur", obj);
    },
    unchoose: function(keywordName) {
      let index = _.findIndex(this.chosen, function(o) {
        return o === keywordName;
      });
      if (index > -1) {
        this.chosen.splice(index, 1);
        this.$emit("closeCategories", this.chosen);
      }
    },
    hitOne: function(category) {
      let indexInChosen = _.findIndex(this.chosen, function(o) {
        return o.name === category.name;
      });
      if (indexInChosen > -1) {
        return;
      }
      let indexInAvailable = _.findIndex(this.categories, function(o) {
        return o.name === category.name;
      });
      if (indexInAvailable > -1) {
        this.chosen.push(this.categories[indexInAvailable]);
      } else {
        this.chosen.push(category);
      }
      this.$emit("categories", this.chosen);
      return category;
    }
  }
};
</script>
<style>
.autocomplete-wrapper input {
  background-color: white;
  min-width: 100%;
  padding: 5px;
}
.transition, .autocomplete, .showAll-transition, .autocomplete ul, .autocomplete ul li a{
  transition:all 0.3s ease-out;
  -moz-transition:all 0.3s ease-out;
  -webkit-transition:all 0.3s ease-out;
  -o-transition:all 0.3s ease-out;
  z-index: 5 !important;
}

.autocomplete ul{
  font-family: sans-serif;
  position: absolute;
  list-style: none;
  background: #f8f8f8;
  padding: 10px 0;
  margin: 0;
  display: inline-block;
  min-width: 15%;
  margin-top: 10px;
}

.autocomplete ul:before{
  content: "";
  display: block;
  position: absolute;
  height: 0;
  width: 0;
  border: 10px solid transparent;
  border-bottom: 10px solid #f8f8f8;
  left: 46%;
  top: -20px
}

.autocomplete ul li a{
  text-decoration: none;
  display: block;
  background: #f8f8f8;
  color: #2b2b2b;
  padding: 5px;
  padding-left: 10px;
}

.autocomplete ul li a:hover, .autocomplete ul li.focus-list a{
  color: white;
  background: #2F9AF7;
}

.autocomplete ul li a span, /*backwards compat*/
.autocomplete ul li a .autocomplete-anchor-label{
  display: block;
  margin-top: 3px;
  color: grey;
  font-size: 13px;
}

.autocomplete ul li a:hover .autocomplete-anchor-label,
.autocomplete ul li.focus-list a span, /*backwards compat*/
.autocomplete ul li a:hover .autocomplete-anchor-label,
.autocomplete ul li.focus-list a span{ /*backwards compat*/
  color: white;
}

/*.showAll-transition{
  opacity: 1;
  height: 50px;
  overflow: hidden;
}

.showAll-enter{
  opacity: 0.3;
  height: 0;
}

.showAll-leave{
  display: none;
}*/
</style>
