<template>
<div class="" v-if="loading">
  <div class="bg-warning text-white">Loading..</div>
</div>
<div class="" v-else>
  <a class="btn btn-sm btn-primary text-white m-0">Bidding has ended on this item!</a>
  <div class="d-flex justify-content-between">
    <a v-if="isMeWinning" class="btn btn-sm teal lighten-1 text-white mx-0" @click.prevent="placeBid(bidding.nextBid)">Place Bid  {{bidding.fiatSymbol}} {{bidding.nextBid}} (<i class="fab fa-btc"></i>  {{bidding.nextBidBtc}})</a>
    <a v-else-if="isMeBidding" class="btn btn-sm btn-danger text-white mx-0" @click.prevent="placeBid(bidding.nextBid)">Place Bid  {{bidding.fiatSymbol}} {{bidding.nextBid}} (<i class="fab fa-btc"></i>  {{bidding.nextBidBtc}})</a>
    <a v-else class="btn btn-sm btn-primary text-white mx-0" @click.prevent="placeBid(bidding.nextBid)">Place Bid  {{bidding.fiatSymbol}} {{bidding.nextBid}} (<i class="fab fa-btc"></i>  {{bidding.nextBidBtc}})</a>
    <a class="btn btn-sm btn-warning mx-0" @click.prevent="placeBid(bidding.nextBid)">{{countdown}}</a>
  </div>
  <div v-if="biddingEnabled">
    <div class="d-flex align-items-start flex-column text-muted">
      <div v-if="myItem">Your Item</div>
      <div v-if="bidding.reserveMet" class="bg-light mb-3 py-2 mx-0 text-teal lighten-1" style="font-size: 0.8rem;"  :title="'Selling'">
        Current bid meets the reserve
      </div>
      <div v-else class="bg-light mb-3 py-2 mx-0" style="font-size: 0.8rem;"  :title="'Not Selling - reserve not met'">
        Current bid is under the reserve
      </div>
    </div>
  </div>
</div>
</template>

<script>
import moneyUtils from "@/services/moneyUtils";
import moment from "moment";
import utils from "@/services/utils";
import UnderOffer from "@/pages/components/selling/UnderOffer";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "BiddingEnded",
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
    assetHash: null,
  },
  data() {
    return {
      biddingEnded: null,
    };
  },
  mounted() {
    console.log(this.item);
    let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
    if (!purchaseCycle || !purchaseCycle.bidding) {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      this.$store.dispatch("assetStore/initialisePayment", {bidding: true, asset: asset, item: this.item}).then(asset => {
        if (asset) {
          this.$emit("startPayment", asset);
          this.loading = false;
        } else {
          this.loading = false;
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
          this.$notify({type: 'warn', title: 'Bidding Rules', text: 'Not allowed to bid on your own item.'});
          return;
        }
        let bidData = {
          assetHash: this.assetHash,
          itemId: this.item.id,
          amount: bidAmount,
          bidder: this.myProfile.username,
        };
        this.$store.dispatch("assetStore/placeBid", bidData).then(asset => {
          if (asset) {
            // this.$emit("startPayment", asset);
          } else {
            this.$notify({type: 'error', title: 'Place Order', text: 'Unable to place the order at present.'});
          }
        });
      } else {
        this.$notify({type: 'warn', title: 'Login Required', text: 'Please login to continue.'});
      }
    }
  },
  computed: {
    itemUrl() {
      return `/items/${this.item.id}`;
    },
    countdown() {
      let serverTime = this.$store.getters["serverTime"];
      return utils.dt_Offset(serverTime, this.item.saleData.biddingEnds);
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
    isMeWinning() {
      let isMeWinning = this.$store.getters["assetStore/isMeWinning"]({username: this.myProfile.username, assetHash: this.assetHash});
      return isMeWinning;
    },
    isMeBidding() {
      let isMeBidding = this.$store.getters["assetStore/isMeBidding"]({username: this.myProfile.username, assetHash: this.assetHash});
      return isMeBidding;
    },
    bidding() {
      let data = {
        assetHash: this.assetHash,
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
