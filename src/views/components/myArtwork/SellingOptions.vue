<template>
<div>
  <p class="font-weight-bold muted">{{artwork.owner}}</p>
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
    artwork: {
      saleData: {}
    }
  },
  data() {
    return {};
  },
  mounted() {},
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
    sellingBuyNowPrice() {
      let fb = this.$store.state.constants.featureBitcoin;
      let fiatRate = store.getters["conversionStore/getFiatRate"](this.artwork.saleData.fiatCurrency);
      let symbol = fiatRate["symbol"];
      let currency = this.artwork.saleData.fiatCurrency;
      let priceFiat, priceBtc, priceEth;
      let saleData = this.artwork.saleData;
      let ethToBtc = store.getters["conversionStore/getCryptoRate"]("eth_btc");
      if (fb) {
        priceBtc = moneyUtils.valueInBitcoin(saleData.amount, fiatRate);
        priceFiat = this.artwork.saleData.amount;
        priceEth = moneyUtils.valueInEther(saleData.fiatCurrency, saleData.amount, fiatRate, ethToBtc);
      } else {
        priceBtc = moneyUtils.valueInBitcoinFromWei(this.artwork.bcitem.price, fiatRate, ethToBtc);
        priceFiat = this.artwork.saleData.amount;
        priceEth = moneyUtils.valueInEtherFromWei(this.artwork.bcitem.price, fiatRate, ethToBtc);
      }
      return symbol + " " + priceFiat + " " + currency + " / " + priceBtc + " btc";
    },
    sellingAuctionPrice() {
      let fb = this.$store.state.constants.featureBitcoin;
      let fiatRate = store.getters["conversionStore/getFiatRate"](this.artwork.saleData.fiatCurrency);
      let symbol = fiatRate["symbol"];
      let currency = this.artwork.saleData.fiatCurrency;
      let priceFiat, priceBtc, priceEth;
      let saleData = this.artwork.saleData;
      let ethToBtc = store.getters["conversionStore/getCryptoRate"]("eth_btc");
      if (fb) {
        priceBtc = moneyUtils.valueInBitcoin(saleData.reserve, fiatRate, ethToBtc);
        priceFiat = this.artwork.saleData.reserve;
        priceEth = moneyUtils.valueInEther(saleData.fiatCurrency, saleData.reserve, fiatRate, ethToBtc);
      } else {
        priceBtc = moneyUtils.valueInBitcoinFromWei(this.artwork.bcitem.price, fiatRate, ethToBtc);
        priceFiat = this.artwork.saleData.reserve;
        priceEth = moneyUtils.valueInEtherFromWei(this.artwork.bcitem.price, fiatRate, ethToBtc);
      }
      return "Reserve:" + symbol + " " + priceFiat + " " + currency + " / " + priceBtc + " btc";
    },
    debugMode() {
      let debugMode = this.$store.state.constants.debugMode;
      return debugMode;
    },
    sellingAuction() {
      return this.artwork.saleData.soid === 2 && this.artwork.saleData.reserve > 0 && this.artwork.saleData.increment > 0;
    },
    canManageAuction() {
      let auction = this.$store.getters["myAuctionsStore/myAuction"](
        this.artwork.saleData.auctionId
      );
      if (!auction) return false;
      let username = this.$store.getters["myAccountStore/getMyProfile"]
        .username;
      return auction.administrator === username;
    },
    manageAuctionUrl() {
      return `/my-auctions/manage/${this.artwork.saleData.auctionId}`;
    },
    publicAuctionUrl() {
      return `/online-auction/${this.artwork.saleData.auctionId}`;
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
