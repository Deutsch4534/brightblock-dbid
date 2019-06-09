<template>
<mdb-modal v-if="modal" @close="closeMe">
  <mdb-modal-header>
    <mdb-modal-title>{{title}}</mdb-modal-title>
  </mdb-modal-header>
  <mdb-modal-body>
    <span v-for="keyword in keywords" :key="keyword"><a @click.prevent="choose(keyword)"><mdb-btn rounded color="white" size="sm" class="mx-0 waves-light">{{keyword}}</mdb-btn></a></span>
  </mdb-modal-body>
  <mdb-modal-body>
    <h6>Keywords</h6>
    <span v-for="keyword in chosen" :key="keyword"><a @click.prevent="unchoose(keyword)"><mdb-btn rounded color="white" size="sm" class="mx-0 waves-light">{{keyword}}</mdb-btn></a></span>
  </mdb-modal-body>
  <mdb-modal-footer>
    <mdb-btn class="btn default" @click.native="closeMe">Done</mdb-btn>
  </mdb-modal-footer>
</mdb-modal>
</template>

<script>
import { mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn } from 'mdbvue';
import _ from "lodash";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "KeywordsView",
  components: {
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbBtn
  },
  props: ["modal", "title"],
  data() {
    return {
      keywords: this.$store.state.constants.taxonomy.keywords,
      chosen: []
    };
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    closeMe: function() {
      this.$emit("closeKeywords", this.chosen);
    },
    unchoose: function(keyword) {
      let index = _.findIndex(this.chosen, function(o) {
        return o === keyword;
      });
      this.chosen.splice(index, 1);
    },
    choose: function(keyword) {
      let index = _.findIndex(this.chosen, function(o) {
        return o === keyword;
      });
      if (index === -1) {
        this.chosen.push(keyword);
      }
    }
  }
};
</script>
<style scoped>
</style>
