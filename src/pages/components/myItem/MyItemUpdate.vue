<template>
<div class="row">
  <div class="col-lg-5 col-xl-4 mb-4">
    <item-image-list-view :item="item"/>
  </div>
  <div class="col-lg-7 col-xl-7 ml-xl-4 mb-4">
    <item-action-links :item="item" :itemAction="'update'" :asset="asset" :buttonMode="false"/>
    <div class="d-flex justify-content-center bg-card">
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
import ItemUploadForm from "../selling/ItemUploadForm";

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
