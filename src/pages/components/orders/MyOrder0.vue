<template>
<div class="row">
  <div class="col-12">Status: {{assetStatus}}</div>
  <div class="col-12">Gaia TX: {{transferred}} Expired: {{expired}}</div>
  <div class="col-12">Asset Buyer: {{buyer}} </div>
  <div class="col-12">Asset Seller: {{seller}}</div>
  <div class="col-12">Item Owner: {{itemOwner}}</div>
  <div class="col-12">Item Owner in Search index: {{searchItemOwner}}</div>
  <div class="col-12">Item Title: {{itemTitle}}</div>
  <div class="col-12">Item Id: {{itemId}}</div>
</div>
</template>

<script>
import OrderItem from "@/pages/components/orders/OrderItem";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyOrder",
  bodyClass: "index-page",
  components: {
    OrderItem,
  },
  props: {
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
      searchItem: null
    };
  },
  mounted() {
    this.assetConfig = this.$store.getters["assetStore/getAssetConfig"];
    this.itemId = Number(this.asset.assetId.split("_::_")[1]);
    this.$store.dispatch("myItemStore/fetchMyItem", this.itemId).then((item) => {
    });
    this.$store.dispatch("itemSearchStore/fetchItem", this.itemId).then((item) => {
      this.loading = false;
    });
  },
  methods: {
  },
  computed: {
    transferred() {
      let pcs = this.asset.purchaseCycles.length;
      let pc = this.asset.purchaseCycles[pcs - 1];
      return pc.transferred;
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
