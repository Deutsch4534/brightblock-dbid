<template>
<div class="">
  <div v-if="purchaseBegun">
    Offer Made
  </div>
  <div v-else-if="sellingBuyNow">
    {{artwork.saleData.amount}} EUR
    <br/>{{btcMessage}} BTC
  <!--  <button class="btn teal lighten-1" @click="routeToBuyNow">Buy Now</button> -->
  </div>
  <div v-else-if="sellingAuction">
  <!--
    <button class="btn teal lighten-1" @click="routeToPublicAuction">Open Auction</button>
    <button class="btn teal lighten-1" @click="routeToManageAuction">Manage Auction</button>
  -->
  </div>
  <div v-else>
    Not Selling
  </div>
</div>
</template>

<script>
import moneyUtils from "@/services/moneyUtils";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SellingOptions",
  props: {
    artwork: {
      saleData: {}
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    routeToManageAuction() {
      let r = `/my-auctions/manage/${this.artwork.saleData.auctionId}`;
      this.$router.push(r);
    },
    routeToPublicAuction() {
      let r = `/online-auction/${this.artwork.saleData.auctionId}`;
      this.$router.push(r);
    },
    routeToBuyNow() {
      let r = `/artworks/${this.artwork.id}`;
      this.$router.push(r);
    }
  },
  computed: {
    sellingBuyNow() {
      let fb = this.$store.state.constants.featureBitcoin;
      let priceSet;
      if (fb) {
        priceSet = this.artwork.saleData.amount > 0;
      } else {
        priceSet = this.artwork.bcitem && this.artwork.bcitem.price > 0;
      }
      return priceSet && this.artwork.saleData.soid === 1;
    },
    btcMessage() {
      try {
        let fiatRate = this.$store.getters["conversionStore/getFiatRate"](this.artwork.saleData.fiatCurrency);
        let value = moneyUtils.valueInBitcoin(this.artwork.saleData.amount, fiatRate);
        return value;
      } catch (e) {
        return "";
      }
    },
    moneySymbol() {
      try {
        let fiatRate = store.getters["conversionStore/getFiatRate"](this.artwork.saleData.fiatCurrency);
        return fiatRate["symbol"];
      } catch (e) {
        return "";
      }
    },
    sellingAuction() {
      return (
        this.artwork.saleData.soid === 2 && this.artwork.saleData.auctionId > 0
      );
    },
    purchaseBegun() {
      return this.artwork.status === this.$store.state.constants.statuses.artwork.PURCHASE_BEGUN;
    },
    sellingAmount() {
      let priceSet = this.artwork.bcitem && this.artwork.bcitem.price > 0;
      if (priceSet) {
        return this.artwork.saleData.amount;
      } else {
        return 0;
      }
    },
    canManageAuction() {
      let auction = this.$store.getters["myAuctionStore/myAuction"](
        this.artwork.saleData.auctionId
      );
      if (!auction) return false;
      let username = this.$store.getters["myAccountStore/getMyProfile"]
        .username;
      return auction.administrator === username;
    }
  }
};
</script>
