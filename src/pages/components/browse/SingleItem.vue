<template>
<div class="row mb-4">
  <div class="col-lg-6">
    <item-image-list-view :item="item"/>
  </div>
  <div class="col-lg-6">
    <div class="d-flex">
      <h5 class="text-capitalize"><router-link :to="itemUrl">{{item.title}}</router-link></h5>
    </div>
    <description-container :text="item.description"/>
    <!--
    <p class="text-capitalize">{{item.keywords}}</p>
    <div class="d-flex justify-content-between">
      <item-posted :owner="item.owner" :created="item.created" />
    </div>
    -->
    <buyers-information :item="item" action="details" :myProfile="myProfile"/>
  </div>
</div>
</template>

<script>
import moment from "moment";
import DescriptionContainer from "../utils/DescriptionContainer";
import ItemImageListView from "../myItem/ItemImageListView";
import BuyersInformation from "../selling/BuyersInformation";
import ItemPosted from "../myItem/ItemPosted";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SingleItem",
  components: {
    DescriptionContainer, ItemImageListView, BuyersInformation, ItemPosted
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
  },
  data() {
    return {
    };
  },
  mounted() {},
  methods: {
  },
  computed: {
    itemUrl() {
      return `/items/${this.item.id}`;
    },
  }
};
</script>
<style scoped>
</style>
