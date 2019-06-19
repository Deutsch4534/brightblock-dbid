<template>
<div class="border-bottom">
  <p class="text-muted text-sm">Type and select from list or press add to create a new category</p>
  <div class="d-flex justify-content-start">
    <vue-bootstrap-typeahead inputClass="validate" v-model="newKeyword" :data="keywordNames" @hit="hitOne"/>
    <a class="btn btn-white btn-sm" style="position: relative; top: -7px;" @click="hitNew">add</a>
  </div>
  <span v-for="keyword in chosen" :key="keyword.name">
    <a @click.prevent="unchoose(keyword.name)"><mdb-btn rounded color="white" size="sm" class="mx-0 waves-light">{{keyword.name}}</mdb-btn></a>
  </span>
</div>
</template>

<script>
import _ from "lodash";
import { mdbBtn } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Taxonomy",
  components: {
    mdbBtn
  },
  props: ["modal", "title", "initKeywords"],
  data() {
    return {
      keywords: [],
      newKeyword: null,
      keywordNames: [],
      chosen: [],
      loaded: false
    };
  },
  mounted() {
    let $self = this;
    this.$store.dispatch("contentStore/fetchTaxonomy").then((keywords) => {
      $self.keywords = keywords;
      $self.keywordNames = keywords.map(keyword => keyword.name);
      if ($self.initKeywords) $self.chosen = $self.initKeywords;
      $self.loaded = true;
    });
  },
  computed: {
  },
  methods: {
    unchoose: function(keywordName) {
      let index = _.findIndex(this.chosen, function(o) {
        return o.name === keywordName;
      });
      if (index > -1) {
        this.chosen.splice(index, 1);
        this.$emit("closeKeywords", this.chosen);
      }
    },
    hitNew: function() {
      let keywordName = this.newKeyword;
      if (!keywordName || keywordName.length < 3) {
        return;
      }
      let category = this.hitOne(keywordName);
      if (category) this.$store.dispatch("contentStore/addCategory", category);
    },
    hitOne: function(keywordName) {
      let indexInChosen = _.findIndex(this.chosen, function(o) {
        return o.name === keywordName;
      });
      if (indexInChosen > -1) {
        return;
      }
      let indexInAvailable = _.findIndex(this.keywords, function(o) {
        return o.name === keywordName;
      });
      if (indexInAvailable > -1) {
        this.chosen.push(this.keywords[indexInAvailable]);
      } else {
        this.chosen.push({name: keywordName});
      }
      // this.newKeyword = null;
      this.$emit("closeKeywords", this.chosen);
      return {name: keywordName};
    }
  }
};
</script>
<style scoped>
.validate {
  text-transform: capitalise;
  width: 550px;
}
.typeahead {
  text-transform: capitalise;
  width: 100%;
}
</style>
