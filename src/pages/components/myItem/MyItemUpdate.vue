<template>
<div class="row">
  <div class="col-lg-5 col-xl-4 mb-4" v-if="showImage">
    <item-image-list-view :item="item"/>
  </div>
  <div class="col-sm-7 offset-md-1">
    <item-action-links class="" :item="item" :itemAction="'update'" :asset="asset" :buttonMode="false"/>
    <div class="d-flex justify-content-start bg-card">
      <item-upload-form :formTitle="'Update Listing'" :itemId="item.id" :mode="'update'" :myProfile="myProfile"/>
    </div>
  </div>
</div>
</template>

<script>
import utils from "@/services/utils";
import notify from "@/notify";
import moment from "moment";
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import { mdbPopover } from "mdbvue";
import ItemImageListView from "./ItemImageListView";
import ItemActionLinks from "./ItemActionLinks";
import ItemUploadForm from "./ItemUploadForm";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyItemUpdate",
  components: {
    mdbPopover, ItemImageListView, ItemActionLinks, ItemUploadForm
  },
  props: {
    item: {
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
    myProfile: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      showImage: true,
    };
  },
  mounted() {
  },
  computed: {
  },
  methods: {
  }
};
</script>
