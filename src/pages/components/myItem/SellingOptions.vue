<template>
<div>
  <p class="font-weight-bold muted">{{item.owner}}</p>
  <div v-if="sellingBuyNow">
    <p class="font-weight-bold muted">Available to buy..</p>
    <p class="font-weight-bold muted">{{sellingBuyNowPrice}}</p>
  </div>
  <div v-else-if="sellingAuction">
    <p class="font-weight-bold muted">Selling in Auction</p>
    <p class="font-weight-bold muted">{{sellingAuctionPrice}}</p>
    <div v-if="debugMode">
      <router-link :to="manageAuctionUrl" v-if="canManageAuction">manage |</router-link>
      <router-link :to="publicAuctionUrl">go to auction</router-link>
    </div>
  </div>
  <div v-else>
    <p class="font-weight-bold muted">Not Selling</p>
  </div>
</div>
</template>

<script>
import moneyUtils from "@/services/moneyUtils";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SellingOptions",
  props: {
    item: {
      saleData: {}
    }
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {
    sellingBuyNow() {
      let priceSet;
      priceSet = this.item.saleData.amount > 0;
      return priceSet && this.item.saleData.soid === 1;
    },
    sellingBuyNowPrice() {
      let fiatRate = store.getters["conversionStore/getFiatRate"](this.item.saleData.fiatCurrency);
      let symbol = fiatRate["symbol"];
      let currency = this.item.saleData.fiatCurrency;
      let priceFiat, priceBtc, priceEth;
      let saleData = this.item.saleData;
      let ethToBtc = store.getters["conversionStore/getCryptoRate"]("eth_btc");
      priceBtc = moneyUtils.valueInBitcoin(saleData.fiatCurrency, saleData.amount, fiatRate);
      priceFiat = this.item.saleData.amount;
      priceEth = moneyUtils.valueInEther(saleData.fiatCurrency, saleData.amount, fiatRate, ethToBtc);
      return symbol + " " + priceFiat + " " + currency + " / " + priceBtc + " btc";
    },
    sellingAuctionPrice() {
      let fiatRate = store.getters["conversionStore/getFiatRate"](this.item.saleData.fiatCurrency);
      let symbol = fiatRate["symbol"];
      let currency = this.item.saleData.fiatCurrency;
      let priceFiat, priceBtc, priceEth;
      let saleData = this.item.saleData;
      let ethToBtc = store.getters["conversionStore/getCryptoRate"]("eth_btc");
      priceBtc = moneyUtils.valueInBitcoin(saleData.fiatCurrency, saleData.reserve, fiatRate, ethToBtc);
      priceFiat = this.item.saleData.reserve;
      priceEth = moneyUtils.valueInEther(saleData.fiatCurrency, saleData.reserve, fiatRate, ethToBtc);
      return "Reserve:" + symbol + " " + priceFiat + " " + currency + " / " + priceBtc + " btc";
    },
    debugMode() {
      let debugMode = this.$store.state.constants.debugMode;
      return debugMode;
    },
    sellingAuction() {
      return this.item.saleData.soid === 2 && this.item.saleData.reserve > 0 && this.item.saleData.increment > 0;
    },
    canManageAuction() {
      let auction = this.$store.getters["myAuctionsStore/myAuction"](
        this.item.saleData.auctionId
      );
      if (!auction) return false;
      let username = this.$store.getters["myAccountStore/getMyProfile"]
        .username;
      return auction.administrator === username;
    },
    manageAuctionUrl() {
      return `/my-auctions/manage/${this.item.saleData.auctionId}`;
    },
    publicAuctionUrl() {
      return `/online-auction/${this.item.saleData.auctionId}`;
    }
  }
};
</script>
<style scoped>
a {
  color: inherit;
  text-decoration: underline;
}
</style>
