<template>
<div class="text-dark text-sm">
  <div class="mt-3" v-if="showCategories">
    <div class="text-center text-capitalise mb-2">
      <span class="badge badge-pill badge-primary mb-2 p-2" v-for="(category, index) in getCategory1Population" :key="index"><a style="text-decoration: capitalise;" v-html="category.name" @click.prevent="findByKeyword(category)"></a> <sup class="text-warning">{{category.hits}}</sup></span>
    </div>
    <div class="d-flex text-capitalise mr-2">
      <span class="badge badge-pill badge-warning ml-2 p-2" v-for="(category, index) in level2Categories" :key="index"><a style="text-decoration: capitalise;" v-html="category.name" @click.prevent="findByKeyword(category)"></a> <sup class="text-primary">{{category.hits}}</sup></span>
    </div>
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
  name: "Taxonomy",
  components: {
    mdbBtn, Autocomplete
  },
  props: ["modal", "title", "initCategories"],
  data() {
    return {
      showCategories: true,
    };
  },
  mounted() {
    if (this.initCategories && Array.isArray(this.initCategories)) {
      this.chosen = this.initCategories;
    }
    this.loaded = true;
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
  }
};
</script>
<style>
</style>
