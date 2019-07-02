<template>
<div class="" v-if="loading">
  <div class="bg-warning text-white">Loading..</div>
</div>
<div class="" v-else-if="problem">
  <div>Problem loading asset - please reload page..</div>
</div>
<div class="" v-else>
  <div class="bg-warning text-white">Valid for: {{validForCalc}}</div>
  <div v-if="biddingEnabled">
    <div class="d-flex align-items-start flex-column text-muted">
      <div v-if="myItem">Your Item</div>
      <div class="bg-light mb-3 p-2" style="font-size: 0.8rem;" :class="(bidding.reserveMet) ? 'text-success' : 'text-danger'" :title="(bidding.reserveMet) ? 'Selling' : 'Not Selling - reserve not met'">
        Current Bid:  {{bidding.fiatSymbol}} {{bidding.currentBid}} <span class="ml-4">(<i class="fab fa-btc"></i>  {{bidding.currentBidBtc}})</span>
      </div>
      <div class="">
        <a class="btn btn-sm btn-primary text-white m-0" @click.prevent="placeBid(bidding.nextBid)">Place Bid  {{bidding.fiatSymbol}} {{bidding.nextBid}} (<i class="fab fa-btc"></i>  {{bidding.nextBidBtc}})</a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import moneyUtils from "@/services/moneyUtils";
import moment from "moment";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "BuyAction",
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
      validFor: null,
      biddingEnded: null,
      loading: true,
      problem: false
    };
  },
  mounted() {
    console.log(this.item);
    this.startCountdown();
    let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
    if (!purchaseCycle || !purchaseCycle.bidding) {
      this.$store.dispatch("assetStore/initialisePayment", {bidding: true, asset: this.asset, item: this.item}).then(asset => {
        if (asset) {
          this.$emit("startPayment", asset);
          this.loading = false;
        } else {
          this.loading = false;
          this.problem = true;
          this.$notify({type: 'error', title: 'Place Order', text: 'Unable to place the order at present.'});
        }
      });
    } else {
      this.loading = false;
    }
  },
  methods: {
    placeBid(bidAmount) {
      if (this.myProfile.loggedIn) {
        if (this.item.owner === this.myProfile.username) {
          this.$notify({type: 'warning', title: 'Bidding Rules', text: 'Not allowed to bid on your own item.'});
          return;
        }
        this.$store.dispatch("assetStore/placeBid", {assetHash: this.asset.assetHash, bidAmount: bidAmount, bidder: this.myProfile.username}).then(asset => {
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
    startCountdown() {
      let $self = this;
      let purchaseCycle = $self.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.asset.assetHash);
      let asset = this.asset;
      if (!purchaseCycle) {
        return;
      }
      let biddingEnds = this.item.saleData.biddingEnds;
      let countdown = setInterval(function() {
        if (asset.status !== 3 || purchaseCycle.buyer.chainData.txid) {
          clearInterval(countdown);
        }
        if (purchaseCycle.buyer.chainData.txid) {
          clearInterval(countdown);
        } else {
          let now = moment({}).valueOf();
          let diff = ((biddingEnds - now) / 1000);
          $self.validFor = diff;
          let expired = $self.validFor < 0;
          if (expired) {
            $self.biddingEnded = true;
            clearInterval(countdown);
          }
        }
      }, 1000);
    }
  },
  computed: {
    itemUrl() {
      return `/items/${this.item.id}`;
    },
    validForCalc() {
      let diff = Math.round(this.validFor);
      let mm = Math.floor(diff / 60);
      if (mm < 10) {
        mm = "0" + mm;
      }
      let ss = diff % 60;
      if (ss < 10) {
        ss = "0" + ss;
      }
      return mm + " m " + ss + " s";
    },
    myItemSetPriceUrl() {
      return `/my-item/set-price/${this.item.id}`;
    },
    myItem() {
      return this.item && this.myProfile.username === this.item.owner;
    },
    biddingEnabled() {
      let saleData = this.item.saleData;
      return saleData.soid === 2 && saleData.reserve > 0;
    },
    bidding() {
      let data = {
        assetHash: this.asset.assetHash,
        saleData: this.item.saleData,
      }
      let bidding = this.$store.getters["assetStore/getCurrentBiddingData"](data);
      return bidding;
    }
  }
};
</script>
<style scoped>
</style>
