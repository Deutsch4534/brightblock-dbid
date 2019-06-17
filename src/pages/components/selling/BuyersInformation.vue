<template>
<div class="">
  <div v-if="buyNowEnabled">
    <p class="text-muted">{{sellingBuyNowPrice}}</p>
    <router-link v-if="buyNowEnabled" :to="itemUrl" class="btn btn-sm btn-primary">Buy Now</router-link>
  </div>
  <div v-else-if="sellingAuction">
    <p class="text-muted">Selling in Auction</p>
    <p class="text-muted">{{sellingAuctionPrice}}</p>
    <router-link v-if="buyNowEnabled" :to="itemUrl" class="btn btn-sm btn-primary">Place Bid</router-link>
  </div>
  <div v-else>
    <p class="text-muted">Not Selling</p>
  </div>
</div>
</template>

<script>
import moneyUtils from "@/services/moneyUtils";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "BuyersInformation",
  components: {
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
    itemUrl() {
      return `/items/${this.item.id}`;
    },
    buyNowEnabled() {
      let saleData = this.item.saleData;
      return saleData.soid === 1 && saleData.amount > 0;
    },
    sellingBuyNowPrice() {
      let fiatRate = this.$store.getters["conversionStore/getFiatRate"](this.item.saleData.fiatCurrency);
      let symbol = fiatRate["symbol"];
      let currency = this.item.saleData.fiatCurrency;
      let priceFiat, priceBtc, priceEth;
      let saleData = this.item.saleData;
      let ethToBtc = this.$store.getters["conversionStore/getCryptoRate"]("eth_btc");
      priceBtc = moneyUtils.valueInBitcoin(saleData.fiatCurrency, saleData.amount, fiatRate);
      priceFiat = this.item.saleData.amount;
      priceEth = moneyUtils.valueInEther(saleData.fiatCurrency, saleData.amount, fiatRate, ethToBtc);
      return symbol + " " + priceFiat + " " + currency + " / " + priceBtc + " btc";
    },
    sellingAuctionPrice() {
      let fiatRate = this.$store.getters["conversionStore/getFiatRate"](this.item.saleData.fiatCurrency);
      let symbol = fiatRate["symbol"];
      let currency = this.item.saleData.fiatCurrency;
      let priceFiat, priceBtc, priceEth;
      let saleData = this.item.saleData;
      let ethToBtc = this.$store.getters["conversionStore/getCryptoRate"]("eth_btc");
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
</style>
