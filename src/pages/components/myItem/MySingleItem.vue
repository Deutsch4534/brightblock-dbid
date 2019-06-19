<template>
<div class="row">
  <div class="col-lg-5 col-xl-4 mb-4">
    <item-image-list-view :item="item"/>
  </div>
  <div class="col-lg-7 col-xl-7 ml-xl-4 mb-4">
    <div class="d-flex">
      <div class="mr-auto"><h3 class="mb-3 font-weight-bold dark-grey-text"><strong>{{item.title}}</strong></h3></div>
      <div><item-action-links :item="item" :itemAction="'manage'" :asset="asset" :buttonMode="false"/></div>
    </div>
    <p><description-container :text="item.description"/></p>
    <item-posted :owner="item.owner" :created="item.created" />
  </div>
</div>
</template>

<script>
import moment from "moment";
import DescriptionContainer from "../utils/DescriptionContainer";
import ItemActionLinks from "./ItemActionLinks";
import ItemImageListView from "./ItemImageListView";
import ItemPosted from "./ItemPosted";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MySingleItem",
  components: {
    ItemActionLinks, DescriptionContainer, ItemImageListView, ItemPosted
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    },
    myProfile: {
      type: Object,
      default() {
        return {};
      }
    },
    asset: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  data() {
    return {
    };
  },
  mounted() {},
  methods: {
  },
  computed: {
  }
};
</script>
<style scoped>
</style>
