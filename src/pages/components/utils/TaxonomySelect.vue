<template>

<div class="">
<div class=" mb-3"><h5>Categories, Keywords and Tags <sup class="text-danger">*</sup></h5></div>
  <div class="mb-3 px-5">Selected: [{{chosen.length}}]</div>
  <div class="mb-3 px-5">
    <a class="badge badge-pill badge-light text-dark mr-3 p-2 mt-1" v-for="(keyword, index) in chosen" :key="index" @click.prevent="unchoose(keyword)">
      <span v-html="keyword.name" class="mr-2"></span> <i class="fas fa-backspace"></i>
    </a>
  </div>
  <div class="">
    <mdb-select class="px-5" v-model="level1Categories" @change="change1($event)"/>
    <mdb-select class="px-5" v-model="level2Categories" v-if="level1" @change="change2($event)"/>
    <mdb-select class="px-5" v-model="level3Categories" v-if="level2 && level3Categories.length > 1" @change="change3($event)"/>
  </div>
  <div class="form-group mb-3 px-5">
    <keywords-entry @keywords="keywords"/>
  </div>
</div>
</template>

<script>
import { mdbBtn } from "mdbvue";
import { mdbSelect, mdbContainer } from 'mdbvue';
import KeywordsEntry from "@/pages/components/utils/KeywordsEntry";
import _ from "lodash";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "TaxonomySelect",
  components: {
    KeywordsEntry,
    mdbBtn, mdbSelect, mdbContainer
  },
  props: ["modal", "title", "initCategories"],
  data() {
    return {
      showCategories: true,
      chosen: [],
      level1: null,
      level2: null,
      level3: null,
    };
  },
  mounted() {
    if (this.initCategories && Array.isArray(this.initCategories)) {
      this.chosen = this.initCategories;
    }
    this.loaded = true;
  },
  methods: {
    unchoose: function(keywordName) {
      let index = _.findIndex(this.chosen, function(o) {
        return o === keywordName;
      });
      if (index > -1) {
        this.chosen.splice(index, 1);
        this.$emit("categories", this.chosen);
      }
    },
    keywords: function(chosen) {
      if (!chosen) {
        return;
      }
      let localChosen = [];
      if (this.level1) localChosen.push(this.level1);
      if (this.level2) localChosen.push(this.level2);
      if (this.level3) localChosen.push(this.level3);
      let $self = this;
      _.forEach(chosen, function(category) {
        if ($self.level2) {
          category.parent = $self.level2.name;
        } else if ($self.level1) {
          category.parent = $self.level1.name;
        }
        localChosen.push(category);
      });
      this.chosen = localChosen;
      this.$emit("categories", this.chosen);
    },
    change1: function(id) {
      if (id && id.length > 0) {
        this.level1 = this.$store.getters["contentStore/getCategory"](id);
        this.chosen = [];
        this.level2 = null;
        this.level3 = null;
        this.chosen.push(this.level1);
        this.$emit("categories", this.chosen);
      }
    },
    change2: function(id) {
      if (id && id.length > 0) {
        this.level2 = this.$store.getters["contentStore/getCategory"](id);
        this.chosen = [];
        this.level3 = null;
        this.chosen.push(this.level1);
        this.chosen.push(this.level2);
        this.$emit("categories", this.chosen);
      }
    },
    change3: function(id) {
      this.level3 = this.$store.getters["contentStore/getCategory"](id);
      this.chosen = [];
      this.chosen.push(this.level1);
      this.chosen.push(this.level2);
      this.chosen.push(this.level3);
      this.$emit("categories", this.chosen);
    }
  },
  computed: {

    level1Categories() {
      let categories = this.$store.getters["contentStore/getLevel1Tree"];
      if (categories[0] && categories[0].value && categories[0].value.length > 0) {
        categories.splice(0, 0, {value: '', text: 'Select Main Category'});
      }
      return categories;
    },
    level2Categories() {
      if (this.level1) {
        let categories = this.$store.getters["contentStore/getLevel2SubTree"](this.level1);
        if (categories[0] && categories[0].value && categories[0].value.length > 0) {
          categories.splice(0, 0, {value: '', text: 'Select Child Category'});
        }
        return categories;
      }
      return [];
    },
    level3Categories() {
      if (this.level2) {
        let categories = this.$store.getters["contentStore/getLevel3SubTree"](this.level2);
        if (categories[0] && categories[0].value && categories[0].value.length > 0) {
          categories.splice(0, 0, {value: '', text: 'Select Sub Category'});
        }
        return categories;
      }
      return [];
    },
  }
};
</script>
<style>
</style>
