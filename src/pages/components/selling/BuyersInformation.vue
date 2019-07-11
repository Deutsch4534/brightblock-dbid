<template>
<div class="d-flex justify-content-center" role="status" v-if="loading">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
<div class="" v-else>
  <div v-if="myItem">
    <div class="d-flex align-items-center flex-column text-muted">
      <div class="" style="font-size: 0.8rem;"><span v-html="sellingBuyNowFiat"></span></div>
      <div class="" style="font-size: 0.8rem;"><i class="fab fa-btc"></i> <span v-html="sellingBuyNowBtc"></span></div>
      <div class=""><router-link :to="myItemSetPriceUrl" class="btn btn-sm btn-success text-white m-0">Change Price</router-link></div>
    </div>
  </div>
  <div v-else-if="buyNowEnabled">
    <div class="d-flex align-items-center flex-column text-muted">
      <div class="" style="font-size: 0.8rem;"><span v-html="sellingBuyNowFiat"></span></div>
      <div class="" style="font-size: 0.8rem;"><i class="fab fa-btc"></i> <span v-html="sellingBuyNowBtc"></span></div>
      <div class=""><router-link :to="itemUrl" class="btn btn-sm btn-success text-white m-0">Buy Now</router-link></div>
    </div>
  </div>
  <div v-else-if="sellingAuction">
    <div class="d-flex align-items-center flex-column text-muted">
      <div class="" style="font-size: 0.8rem;"><span v-html="sellingAuctionFiat"></span></div>
      <div class="" style="font-size: 0.8rem;"><i class="fab fa-btc"></i> <span v-html="sellingAuctionBtc"></span></div>
      <div class=""><router-link :to="itemUrl" class="btn btn-sm btn-success text-white m-0">Place Bid</router-link></div>
    </div>
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
    myProfile: {
      type: Object,
      default() {
        return {};
      }
    },
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
  },
  data() {
    return {
      loading: true
    };
  },
  mounted() {
    this.loading = false;
  },
  methods: {
  },
  computed: {
    itemUrl() {
      return `/items/${this.item.id}`;
    },
    myItemSetPriceUrl() {
      return `/my-item/set-price/${this.item.id}`;
    },
    myItem() {
      return this.item && this.myProfile.username === this.item.owner;
    },
    buyNowEnabled() {
      let saleData = this.item.saleData;
      return saleData.soid === 1 && saleData.amount > 0;
    },
    sellingBuyNowFiat() {
      let fiatRate = this.$store.getters["conversionStore/getFiatRate"](this.item.saleData.fiatCurrency);
      let symbol = fiatRate["symbol"];
      let currency = this.item.saleData.fiatCurrency;
      let priceFiat, priceBtc, priceEth;
      let saleData = this.item.saleData;
      let ethToBtc = this.$store.getters["conversionStore/getCryptoRate"]("eth_btc");
      priceBtc = moneyUtils.valueInBitcoin(saleData.amount, fiatRate);
      priceFiat = this.item.saleData.amount;
      priceEth = moneyUtils.valueInEther(saleData.fiatCurrency, saleData.amount, fiatRate, ethToBtc);
      return symbol + " " + priceFiat + " " + currency;
    },
    sellingBuyNowBtc() {
      let fiatRate = this.$store.getters["conversionStore/getFiatRate"](this.item.saleData.fiatCurrency);
      let symbol = fiatRate["symbol"];
      let currency = this.item.saleData.fiatCurrency;
      let priceFiat, priceBtc, priceEth;
      let saleData = this.item.saleData;
      let ethToBtc = this.$store.getters["conversionStore/getCryptoRate"]("eth_btc");
      priceBtc = moneyUtils.valueInBitcoin(saleData.amount, fiatRate);
      priceFiat = this.item.saleData.amount;
      priceEth = moneyUtils.valueInEther(saleData.fiatCurrency, saleData.amount, fiatRate, ethToBtc);
      return priceBtc;
    },
    sellingAuctionFiat() {
      let fiatRate = this.$store.getters["conversionStore/getFiatRate"](this.item.saleData.fiatCurrency);
      let symbol = fiatRate["symbol"];
      let currency = this.item.saleData.fiatCurrency;
      let priceFiat, priceBtc, priceEth;
      let saleData = this.item.saleData;
      let ethToBtc = this.$store.getters["conversionStore/getCryptoRate"]("eth_btc");
      priceBtc = moneyUtils.valueInBitcoin(saleData.reserve, fiatRate);
      priceFiat = this.item.saleData.reserve;
      priceEth = moneyUtils.valueInEther(saleData.fiatCurrency, saleData.reserve, fiatRate, ethToBtc);
      return symbol + " " + priceFiat + " " + currency;
    },
    sellingAuctionBtc() {
      let fiatRate = this.$store.getters["conversionStore/getFiatRate"](this.item.saleData.fiatCurrency);
      let symbol = fiatRate["symbol"];
      let currency = this.item.saleData.fiatCurrency;
      let priceFiat, priceBtc, priceEth;
      let saleData = this.item.saleData;
      let ethToBtc = this.$store.getters["conversionStore/getCryptoRate"]("eth_btc");
      priceBtc = moneyUtils.valueInBitcoin(saleData.reserve, fiatRate);
      priceFiat = this.item.saleData.reserve;
      priceEth = moneyUtils.valueInEther(saleData.fiatCurrency, saleData.reserve, fiatRate, ethToBtc);
      return priceBtc;
    },
    debugMode() {
      let debugMode = this.$store.state.constants.debugMode;
      return debugMode;
    },
    sellingAuction() {
      if (this.item.saleData.soid === 2 && this.item.saleData.reserve > 0 && this.item.saleData.increment > 0) {
        return true;
      }
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
