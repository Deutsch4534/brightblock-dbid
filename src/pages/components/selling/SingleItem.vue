<template>
<div class="row">
  <div class="col-lg-5 col-xl-4 mb-4">
    <item-image-list-view :item="item"/>
  </div>
  <div class="col-lg-7 col-xl-7 ml-xl-4 mb-4">
    <div class="d-flex">
      <div class="mr-auto"><h3 class="mb-3 font-weight-bold dark-grey-text"><strong>{{item.title}}</strong></h3></div>
    </div>
    <p><description-overflow :text="item.description"/></p>
    <item-posted :owner="item.owner" :created="item.created" />
    <buyers-information :item="item" action="details" :myProfile="myProfile"/>
  </div>
</div>
</template>

<script>
import moment from "moment";
import DescriptionOverflow from "../utils/DescriptionOverflow";
import ItemImageListView from "../myItem/ItemImageListView";
import BuyersInformation from "./BuyersInformation";
import ItemPosted from "../myItem/ItemPosted";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SingleItem",
  components: {
    DescriptionOverflow, ItemImageListView, BuyersInformation, ItemPosted
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
  }
};
</script>
<style scoped>
</style>
