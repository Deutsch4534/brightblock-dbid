<template>
<div class="row">
  <div class="col-lg-5 col-xl-4 mb-4">
    <item-image-list-view :item="item"/>
  </div>
  <div class="col-lg-7 col-xl-7 ml-xl-4 mb-4">
    <div class="d-flex">
      <div class="mr-auto"><h3 class="mb-3 font-weight-bold dark-grey-text"><strong>{{item.title}}</strong></h3></div>
    </div>
    <p class="grey-text"><description-overflow :text="item.description"/></p>
    <p>Listed <!--by; <a class="font-weight-bold dark-grey-text">{{ownerProfile.name}}</a> --> on <span class="font-weight-bold dark-grey-text">{{created}}</span></p>
    <buyers-information :item="item"/>
  </div>
</div>
</template>

<script>
import moment from "moment";
import DescriptionOverflow from "../utils/DescriptionOverflow";
import ItemImageListView from "../myItem/ItemImageListView";
import BuyersInformation from "./BuyersInformation";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SingleItem",
  components: {
    DescriptionOverflow, ItemImageListView, BuyersInformation
  },
  props: {
    item: {
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
    created() {
      if (this.item.created) {
        return moment(this.item.created).format("YYYY-MM-DD HH:mm (Z)");
      }
      return;
    },
    ownerProfile() {
      let profile = this.$store.getters["userProfilesStore/getProfile"](this.item.owner);
      return profile ? profile : {};
    }
  }
};
</script>
<style scoped>
</style>
