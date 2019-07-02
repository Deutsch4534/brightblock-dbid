<template>
<div class="text-dark text-sm">
  <p class="text-muted text-sm">Type and select from list or press add to create a new category</p>
  <vue-bootstrap-typeahead v-model="newKeyword" :data="keywordNames" @hit="hitOne"/>
  <div class="d-flex justify-content-start">
    <!--
    <a class="btn btn-white btn-sm" style="position: relative; top: -7px;" @click="hitNew">add</a>
    -->
  </div>
  <div class="my-2">Selected Categories [{{chosen.length}}]</div>
  <div class="d-flex justify-content-start">
    <span class="badge badge-pill badge-dark mr-3" v-for="(keyword, index) in chosen" :key="index">
      <a @click.prevent="unchoose(keyword)" class="" v-html="keyword"></a>
    </span>
  </div>
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
      if (typeof $self.initKeywords === "string") {
        $self.chosen = $self.initKeywords.split(",");
      } else {
        $self.chosen = $self.initKeywords;
      }
      $self.loaded = true;
    });
  },
  computed: {
  },
  methods: {
    unchoose: function(keywordName) {
      let index = _.findIndex(this.chosen, function(o) {
        return o === keywordName;
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
        return o === keywordName;
      });
      if (indexInChosen > -1) {
        return;
      }
      let indexInAvailable = _.findIndex(this.keywords, function(o) {
        return o.name === keywordName;
      });
      if (indexInAvailable > -1) {
        this.chosen.push(this.keywords[indexInAvailable].name);
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
