<template>
<div class="d-flex justify-content-center" role="status" v-if="loading">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
<div class="row" v-else>
  <div class="col-lg-5 col-xl-4 mb-4">
    <item-image-list-view :item="searchItem"/>
  </div>
  <div class="col-lg-7 col-xl-7 ml-xl-4 mb-4">
    <div class="row">
      <div class="col-12 mb-3"><h4><router-link :to="itemUrl">{{searchItem.title}}</i></router-link></h4></div>
      <div class="col-12 mb-3 text-danger">{{assetStatus}}</div>
      <div class="col-12 mb-3" v-if="tradeType === 'buying'">Seller: {{seller}}</div>
      <div class="col-12 mb-3" v-if="tradeType === 'selling'">Buyer: {{buyer}}</div>
      <div class="col-12"><button class="btn btn-small p-2 m-0 btn-primary text-capitalize" @click="openPurchase">Open Details</button></div>
      <div v-if="debugMode">
      <div class="col-12">Expired: {{expired}}</div>
      <div class="col-12">Gaia TX: {{transferred}} Expired: {{expired}}</div>
      <div class="col-12">Asset Buyer: {{buyer}} </div>
      <div class="col-12">Item Owner: {{itemOwner}}</div>
      <div class="col-12">Item Owner in Search index: {{searchItemOwner}}</div>
      <div class="col-12">Item Id: {{itemId}}</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import ItemImageListView from "@/pages/components/myItem/ItemImageListView";
import ItemActionLinks from "@/pages/components/myItem/ItemActionLinks";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MySaleItem",
  bodyClass: "index-page",
  components: {
    ItemImageListView, ItemActionLinks
  },
  props: {
    tradeType: null,
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
      assetConfig: null,
      itemId: null,
      searchItem: {},
      loading: true
    };
  },
  mounted() {
    this.assetConfig = this.$store.getters["assetStore/getAssetConfig"];
    this.itemId = Number(this.asset.assetId.split("_::_")[1]);
    this.$store.dispatch("myItemStore/fetchMyItem", this.itemId).then((item) => {
    });
    this.$store.dispatch("itemSearchStore/fetchItem", this.itemId).then((item) => {
      this.searchItem = item;
      this.loading = false;
    });
  },
  methods: {
    openPurchase: function() {
      this.$router.push("/my-orders/" + this.asset.assetHash);
    }
  },
  computed: {
    transferred() {
      let pcs = this.asset.purchaseCycles.length;
      let pc = this.asset.purchaseCycles[pcs - 1];
      return pc.transferred;
    },
    itemUrl() {
      return `/items/${this.itemId}`;
    },
    debugMode() {
      return this.$store.state.constants.debugMode;
    },
    expired() {
      let pcs = this.asset.purchaseCycles.length;
      let pc = this.asset.purchaseCycles[pcs - 1];
      return pc.expired;
    },
    buyer() {
      let pcs = this.asset.purchaseCycles.length;
      let pc = this.asset.purchaseCycles[pcs - 1];
      return pc.buyer.did;
    },
    seller() {
      let pcs = this.asset.purchaseCycles.length;
      let pc = this.asset.purchaseCycles[pcs - 1];
      return pc.seller.did;
    },
    itemTitle() {
      let item = this.$store.getters["myItemStore/myItem"](this.itemId);
      if (item) {
        return item.title;
      }
      return "-";
    },
    itemOwner() {
      let item = this.$store.getters["myItemStore/myItem"](this.itemId);
      if (item) {
        return item.owner;
      }
      return "Not in your gaia storage.";
    },
    searchItemOwner() {
      let item = this.$store.getters["itemSearchStore/getItem"](this.itemId);
      if (item) {
        return item.owner;
      }
      return "?";
    },
    assetStatus() {
      if (!this.assetConfig) {
        return "-";
      }
      let ac = this.assetConfig.statuses.find(status => status.status === this.asset.status);
      return ac.description;
    },
  }
};
</script>
<style>
</style>
