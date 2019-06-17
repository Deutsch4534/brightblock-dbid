<template>
<div class="">
  <div v-if="myItem">
    <p class="text-muted">{{sellingBuyNowPrice}}</p>
    <router-link :to="myItemSetPriceUrl" class="btn btn-sm btn-primary">Change Price</router-link>
  </div>
  <div v-else-if="buyNowEnabled">
    <p class="text-muted">{{sellingBuyNowPrice}}</p>
    <router-link v-if="action === 'details'" :to="itemUrl" class="btn btn-sm btn-primary">Buy Now</router-link>
    <a v-if="action === 'buy'" :to="itemUrl" class="btn btn-sm btn-primary" @click.prevent="buyNow">Place Order</a>
  </div>
  <div v-else-if="sellingAuction">
    <p class="text-muted">Selling in Auction</p>
    <p class="text-muted">{{sellingAuctionPrice}}</p>
    <router-link v-if="action === 'details'" :to="itemUrl" class="btn btn-sm btn-primary">Bidding</router-link>
    <router-link v-if="action === 'bid'" :to="itemTransactionUrl" class="btn btn-sm btn-primary">Place Bid</router-link>
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
            this.$notify({type: 'success', title: 'Payment Initiated', text: 'Allow 1 hour (6 blocks) for bitcoin transactions to confirm.'});
            this.$router.push("/item/transaction/" + asset.assetHash);
          } else {
            this.$notify({type: 'error', title: 'Place Order', text: 'Unable to place the order at present.'});
          }
        });
      } else {
        this.showLoginInfoModal = true;
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
