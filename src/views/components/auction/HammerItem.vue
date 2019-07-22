<template>
<mdb-card dark>
  <mdb-view hover v-if="inplay">
    <img class="inplay-image img-fluid" width="100%" :src="artwork.image" :alt="artwork.title"></img>
    <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
  </mdb-view>
  <mdb-card-body color="elegant" class="white-text">
    <mdb-card-title>{{artwork.title}}</mdb-card-title>
    <hr class="hr-light"/>
    <div v-if="!loggedIn">
      Log in to bid!
    </div>
    <div v-else>
      <div v-if="inplay">
        <p class="font-small mb-3">Current Bid: {{currentBidder}} {{currencySymbol}} {{currentBid}} {{item.fiatCurrency}}</p>
        <!-- <a class="white-text d-flex justify-content-end"><h5>Read more <mdb-icon icon="angle-double-right" class="pl-1" /></h5></a> -->
        <button
              class="btn teal lighten-1" :class="bidStatusClass"
              :disabled="paused || item.paused || item.sellingStatus === 'selling'"
              @click.prevent="bid(nextBid)">Bid {{currencySymbol}} {{nextBid}} {{item.fiatCurrency}}</button>
        <button
              v-if="showSetFinalPriceButton"
              class="btn teal lighten-1"
              v-bind:data-artwork="artwork.id"
              data-toggle="modal"
              data-target="#setFinalBidPriceModal">Sell ({{currentBid}})</button>
        <p v-if="selling && !admin" class="center-block text-center mt-3" v-html="sellingMessage"></p>
        <p v-if="item.sellingStatus === 'selling' && artwork.bcitem">confirming...{{artwork.bcitem.itemIndex}}, {{artwork.bcitem.status}}, {{artwork.bcitem.price}}</p>
        <button class="btn btn-white" v-if="item.sellingStatus === 'selling'" v-on:click="openSetFinalBidPriceDialog">Confirm Price</button>

        <span v-if="admin">
          <button v-if="item.paused" class="btn btn-white" @click.prevent="unpauseBidding">Unpause Bidding</button>
          <button v-else class="btn btn-white" @click.prevent="pauseBidding">Pause Bidding</button>
        </span>
      </div>
    </div>
  </mdb-card-body>
</mdb-card>
</template>

<script>
import peerToPeerService from "@/services/peerToPeerService";
import moneyUtils from "@/services/moneyUtils";
import biddingUtils from "@/services/biddingUtils";
import { mdbCard, mdbView, mdbMask, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "HammerItem",
  components: {
    mdbView,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn,
    mdbMask
  },
  props: {
    auctionId: null,
    admin: false,
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      paused: false
    };
  },
  methods: {
    unpauseBidding() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      let message = "Ready to go again now...";
      let messageData = {
        content: message,
        username: myProfile.username,
        auctionId: this.auctionId
      };
      this.$store.commit("myAuctionStore/messageEvent", messageData);

      let data = {
        username: myProfile.username,
        auctionId: this.auctionId,
        itemId: this.item.itemId
      };
      this.$store.commit("myAuctionStore/unpauseItemEvent", data);
    },
    pauseBidding() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      let message = "Pausing the auction, waiting for bidders...";
      let messageData = {
        content: message,
        username: myProfile.username,
        auctionId: this.auctionId
      };
      this.$store.commit("myAuctionStore/messageEvent", messageData);

      let data = {
        username: myProfile.username,
        auctionId: this.auctionId,
        itemId: this.item.itemId
      };
      this.$store.commit("myAuctionStore/pauseItemEvent", data);
    },
    bid(amount) {
      let $self = this;
      setTimeout(function() {
        $self.paused = false;
        // $self.$forceUpdate()
      }, 2000);
      this.paused = true;
      let serverTime = this.$store.getters["serverTime"];
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      let data = biddingUtils.bidSignal(
        serverTime,
        myProfile,
        amount,
        this.item.itemId,
        this.auctionId
      );
      if (this.admin) {
        this.$store.commit("myAuctionStore/sendBidEvent", data);
      } else {
        data.peer = this.$store.getters["onlineAuctionsStore/getAdministrator"](this.auctionId);
        peerToPeerService.sendPeerSignal({
          type: "wa-bid-send-adm",
          data: data
        });
      }
    }
  },
  computed: {
    loggedIn() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return myProfile.loggedIn;
    },
    artwork() {
      let artwork = this.$store.getters["myArtworksStore/myArtwork"](this.item.itemId);
      if (!artwork) {
        artwork = this.$store.getters["artworkSearchStore/getArtwork"](this.item.itemId);
      }
      return artwork;
    },
    bidStatusClass() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return biddingUtils.bidStatusClass(myProfile, this.item);
    },
    showSetFinalPriceButton() {
      return (
        this.admin && this.item.paused && this.item.sellingStatus !== "selling"
      );
    },
    canSell() {
      return true; // this.$store.getters["myArtworksStore/canSell"](this.artwork.id);
    },
    selling() {
      return this.item.sellingStatus === "selling";
    },
    sellingMessage() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return biddingUtils.sellingMessage(myProfile, this.item);
    },
    inplay() {
      return this.item.itemId;
    },
    currencySymbol() {
      let fiatRate = store.getters["conversionStore/getFiatRate"](this.item.fiatCurrency);
      return fiatRate["symbol"];
    },
    nextBid() {
      return biddingUtils.nextBid(this.item);
    },
    currentBid() {
      return biddingUtils.currentBid(this.item);
    },
    currentBidder() {
      return biddingUtils.currentBidder(this.item);
    }
  }
};
</script>
<style scoped>
.inplay-image  img {
    position: relative;
    display: block;
    width: 100%;
}
</style>
