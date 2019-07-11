<template>
<div class="form-group mb-4">
  <input id="input-keywords" type="text" class="form-control" placeholder="Comma separated list of tags and keywords" v-model="keywordNames" v-on:keydown.13.prevent="hitOne($event)">
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
  props: ["modal", "title"],
  data() {
    return {
      keywords: null,
      keywordNames: null,
      chosen: [],
      loaded: false,
    };
  },
  mounted() {
    this.loaded = true;
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
        this.$emit("keywords", this.chosen);
      }
    },
    hitOne: function(event) {
      if (event) event.preventDefault();
      if (!this.keywordNames) {
        return;
      }
      let keywordNames = this.keywordNames.split(",");
      let $self = this;
      _.forEach(keywordNames, function(keywordName) {
        keywordName = keywordName.trim();
        let indexInChosen = _.findIndex($self.chosen, function(o) {
          return o.name === keywordName;
        });
        if (indexInChosen === -1) {
          let indexInAvailable = _.findIndex($self.chosen, function(o) {
            return o.name === keywordName;
          });
          if (keywordName.length > 2 && indexInAvailable === -1) {
            $self.chosen.push({level: 3, parent: "Other Categories", name: keywordName});
          }
        }
      });
      this.keywordNames = null;
      this.$emit("keywords", this.chosen);
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
