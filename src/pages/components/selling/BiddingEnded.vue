<template>
<div class="" v-if="loading">
  <div class="bg-warning text-white">Loading..</div>
</div>
<div class="" v-else>
  <p><small>Bidding on this item has ended!</small></p>
  <div class="d-flex justify-content-between" v-if="!winningBid.reserveMet">
    Bidding ended - no bid met the reserve.
    <div v-if="myItem"><router-link :to="myItemUrl">manage item</router-link></div>
  </div>
  <div class="d-flex justify-content-between" v-else>
    <div v-if="isMeWon" class="">
      <a class="btn btn-sm teal lighten-1 text-white mx-0" @click.prevent="buyNow">Winning Bid - Pay Now!</a>
      <p class="text-muted"><small><strong>Your bid of {{winningBid.currentBid}} {{winningBid.fiatCurrency}} ({{winningBid.currentBidBtc}}  BTC)</strong></small></p>
    </div>
    <a v-else-if="isMeBidding" class="btn btn-sm btn-danger text-white mx-0">Lost! Better Luck Next Time</a>
    <a v-else class="btn btn-sm btn-primary text-white mx-0">Sold!</a>
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
      loading: true,
    };
  },
  mounted() {
    this.loading = false;
  },
  methods: {
    buyNow() {
      if (this.myProfile.loggedIn) {
        this.$router.push("/my-orders/" + this.assetHash);
      } else {
        this.$notify({type: 'warn', title: 'Login Required', text: 'Please login to continue.'});
      }
    },
  },
  computed: {
    itemUrl() {
      return `/items/${this.item.id}`;
    },
    myItemUrl() {
      return `/my-items/${this.item.id}`;
    },
    myItem() {
      return this.item && this.myProfile.username === this.item.owner;
    },
    isMeWon() {
      let isMeWon = this.$store.getters["assetStore/isMeWinningOrWon"]({username: this.myProfile.username, assetHash: this.assetHash});
      return isMeWon;
    },
    isMeBidding() {
      let isMeBidding = this.$store.getters["assetStore/isMeBidding"]({username: this.myProfile.username, assetHash: this.assetHash});
      return isMeBidding;
    },
    winningBid() {
      let bidding = this.$store.getters["assetStore/getCurrentBiddingData"](this.assetHash);
      return (bidding) ? bidding : {};
    }
  }
};
</script>
<style scoped>
</style>
