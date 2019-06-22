<template>
<div class="">
  <div v-if="myItem">
    <div class="d-flex align-items-start flex-column text-muted mb-3">
      <div class="mb-2"><router-link :to="myItemSetPriceUrl" class="btn btn-sm btn-primary text-white m-0">Change Price</router-link></div>
      <div class="" style="font-size: 0.8rem;">
        <span class="mr-2" v-html="sellingBuyNowFiat"></span>
        / <span class="ml-2" v-html="sellingBuyNowBtc"></span>
      </div>
    </div>
  </div>
  <div v-else-if="buyNowEnabled">
    <div class="d-flex align-items-start flex-column text-muted">
      <div class="" v-if="action === 'details'"><router-link :to="itemUrl" class="btn btn-sm btn-primary text-white m-0">Buy Now</router-link></div>
      <div class="mb-2" v-if="action === 'buy'"><a :to="itemUrl" class="btn btn-sm btn-primary text-white m-0" @click.prevent="buyNow">Place Order</a></div>
      <div class="" style="font-size: 0.8rem;">
        <span class="mr-2" v-html="sellingBuyNowFiat"></span>
        / <span class="ml-2" v-html="sellingBuyNowBtc"></span>
      </div>
    </div>
  </div>
  <div v-else-if="sellingAuction">
    <div class="" style="font-size: 0.8rem;"><span v-html="sellingAuctionFiat"></span></div>
    <div class="mb-2" style="font-size: 0.8rem;"><span v-html="sellingAuctionBtc"></span></div>
    <router-link v-if="action === 'details'" :to="itemUrl" class="btn btn-sm btn-primary text-white m-0">Open</router-link>
    <router-link v-if="action === 'bid'" :to="itemTransactionUrl" class="btn btn-sm btn-primary text-white m-0">Place Bid</router-link>
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
  name: "BuyersInformationItemDetails",
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
    action: null
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    buyNow() {
      if (this.myProfile.loggedIn) {
        this.showModal = true;
        this.$store.dispatch("assetStore/initialisePayment", {asset: this.asset, item: this.item}).then(asset => {
          if (asset) {
            this.$emit("startPayment", asset);
          } else {
            this.$notify({type: 'error', title: 'Place Order', text: 'Unable to place the order at present.'});
          }
        });
      } else {
        this.$notify({type: 'warning', title: 'Login Required', text: 'Please login to continue.'});
      }
    },
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
      priceBtc = moneyUtils.valueInBitcoin(saleData.fiatCurrency, saleData.amount, fiatRate);
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
      priceBtc = moneyUtils.valueInBitcoin(saleData.fiatCurrency, saleData.amount, fiatRate);
      priceFiat = this.item.saleData.amount;
      priceEth = moneyUtils.valueInEther(saleData.fiatCurrency, saleData.amount, fiatRate, ethToBtc);
      return priceBtc + " BTC";
    },
    sellingAuctionFiat() {
      let fiatRate = this.$store.getters["conversionStore/getFiatRate"](this.item.saleData.fiatCurrency);
      let symbol = fiatRate["symbol"];
      let currency = this.item.saleData.fiatCurrency;
      let priceFiat, priceBtc, priceEth;
      let saleData = this.item.saleData;
      let ethToBtc = this.$store.getters["conversionStore/getCryptoRate"]("eth_btc");
      priceBtc = moneyUtils.valueInBitcoin(saleData.fiatCurrency, saleData.reserve, fiatRate, ethToBtc);
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
      priceBtc = moneyUtils.valueInBitcoin(saleData.fiatCurrency, saleData.reserve, fiatRate, ethToBtc);
      priceFiat = this.item.saleData.reserve;
      priceEth = moneyUtils.valueInEther(saleData.fiatCurrency, saleData.reserve, fiatRate, ethToBtc);
      return priceBtc + " BTC";
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
