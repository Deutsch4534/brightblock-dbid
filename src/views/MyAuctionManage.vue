<template>
<div class="container" v-if="loading">
  <div class="row m-5">
    <div class="col-md-12">
      <p>Loading auction - please wait...</p>
    </div>
  </div>
</div>
<div class="container" v-else>
  <confirmation-modal :modal="showModal" :title="modalTitle" :content="modalContent" @closeModal="closeModal"/>
  <div class="row">
    <div class="col-md-12">
      <h1>Auction Management</h1>
    </div>
    <div class="col-md-6">
      <h3>{{auction.title}} <span v-if="auction.items">({{auction.items.length}} items)</span></h3>
      <p>{{auction.description}}</p>
      <p>
        <a v-if="auction.privacy === 'private'" @click.prevent="makePublic()"><mdb-icon icon="lock"/> Draft</a>
        <a v-else @click.prevent="makePrivate()"><mdb-icon icon="unlock"/> Published.</a>
      </p>
      <p>{{countdown}}</p>
    </div>
    <div class="col-md-6">
      <p>
        <router-link :to="updateUrl"><mdb-btn color="white">Edit</mdb-btn></router-link>
        <router-link :to="onlineAuctionUrl"><mdb-btn color="white">View</mdb-btn></router-link>
        <mdb-btn color="danger" @click.prevent="deleteAuction()">Delete</mdb-btn>
      </p>
    </div>
  </div>
  <hr class="my-5">
  <div class="row" v-if="hammerItem">
    <div class="col-md-6">
      <hammer-item :item="hammerItem" :admin="true" :auctionId="auctionId"/>
    </div>
    <div class="col-md-6">
      <div class="row" v-if="winning">
        <div class="col-md-6">
          <h4>Won items</h4>
          <p v-for="(item, index) of winning" :key="index">
            {{item.itemId}}
          </p>
        </div>
      </div>
      <watchers-stream :auctionId="auctionId"/>
      <video-stream :canPublish="true"/>
      <message-stream :auctionId="auctionId" :admin="true"/>
    </div>
  </div>
  <hr class="my-5">
  <div class="row">
    <div class="col-md-6">
      <h4>Available Items</h4>
      <ul class="list-unstyled mt-5">
        <my-single-auction-item class="auction-item-container" v-for="(item, index) of availableItems" :key="index" :itemId="item.itemId" :auctionId="auctionId" :profile="profile" :sellingItem="false"/>
      </ul>
    </div>
    <div class="col-md-6">
      <h4>Items in Auction <a @click.prevent="showItems = !showItems" v-if="sellingItems.length > 0"><u>(<span v-if="showItems">hide</span><span v-else>show</span> {{sellingItemsSize}} items)</u></a></h4>
      <ul class="list-unstyled mt-5" v-if="showItems">
        <my-single-auction-item class="auction-item-container" v-for="(item, index) of sellingItems" :key="index" :itemId="item.itemId" :auctionId="auctionId" :profile="profile" :sellingItem="true" @stateChange="stateChange"/>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
import WatchersStream from "./components/rtc/WatchersStream";
import MessageStream from "./components/rtc/MessageStream";
import VideoStream from "./components/rtc/VideoStream";
import MySingleAuctionItem from "./components/auction/MySingleAuctionItem";
import HammerItem from "./components/auction/HammerItem";
import ConfirmationModal from "./components/utils/ConfirmationModal";
import biddingUtils from "@/services/biddingUtils";
import peerToPeerService from "@/services/peerToPeerService";

import utils from "@/services/utils";
import notify from "@/notify";
import eventBus from "@/services/collaborationService";
import { mdbBtn, mdbIcon } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyAuctionManage",
  bodyClass: "index-page",
  components: {
    ConfirmationModal,
    mdbBtn,
    mdbIcon,
    WatchersStream,
    HammerItem,
    MySingleAuctionItem,
    VideoStream,
    MessageStream
  },
  data() {
    return {
      auctionId: null,
      profile: null,
      loading: true,
      showItems: true,
      showModal: false,
      modalTitle: "Updating Info",
      modalContent: "<p>Please wait - updating information...</p>",
    };
  },
  beforeDestroy() {
    peerToPeerService.disconnect();
    eventBus.$off("signal-in-message");
  },
  mounted() {
    this.auctionId = Number(this.$route.params.auctionId);
    this.$store.dispatch("myArtworksStore/fetchMyArtworks");
    this.$store.dispatch("myAuctionsStore/fetchMyAuction", this.auctionId).then(auction => {
      this.$store.dispatch("myAccountStore/fetchMyAccount").then(myProfile => {
        this.profile = myProfile;
        try {
          this.$store.commit("onlineAuctionsStore/onlineAuction", auction);
          peerToPeerService.startSession(this.$store, myProfile.username, this.auctionId);
          this.loading = false;
        } catch (e) {
          console.log(e);
        }
      });
    });
  },
  methods: {
    startsIn(date) {
      return utils.dt_Offset(date);
    },
    deleteAuction() {
      this.$store.dispatch("myAuctionsStore/deleteMyAuction", this.auctionId);
      this.$router.push("/my-artworks");
    },
    makePublic() {
      let auction = this.$store.getters["myAuctionsStore/myAuction"](this.auctionId);
      if (!auction.items || auction.items.length < 1) {
        this.$notify({type: 'warn', title: 'Manage Auction', text: auction.title + " can't be published until it includes some sale items."});
        return;
      }
      auction.privacy = "public";
      this.$store.dispatch("myAuctionsStore/makePublic", auction);
      this.$notify({type: 'info', title: 'Manage Auction', text: auction.title + " has been published."});
    },
    makePrivate() {
      let auction = this.$store.getters["myAuctionsStore/myAuction"](this.auctionId);
      auction.privacy = "private";
      this.$store.dispatch("myAuctionsStore/makePrivate", auction);
      this.$notify({type: 'info', title: 'Manage Auction', text: auction.title + " is now private and cannot be found in searches etc."});
    },
    closeModal: function() {
      this.showModal = false;
    },
    stateChange(data) {
      this.showModal = true;
      if (data.opcode === "activate") {
        this.activateBidding(data.itemId);
      } else if (data.opcode === "deactivate") {
        this.deactivateBidding(data.itemId);
      } else if (data.opcode === "removeFromAuction") {
        this.removeFromAuction(data.itemId);
      } else if (data.opcode === "addToAuction") {
        this.addToAuction(data.itemId);
      }
    },
    deactivateBidding() {
      this.modalContent = "Removing item from ring...";
      let auction = this.$store.getters["myAuctionsStore/myAuction"](this.auctionId);
      biddingUtils.makeItemActive(auction, null);
      this.$store.dispatch("myAuctionsStore/updateAuction", auction).then(() => {
        let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
        peerToPeerService.sendPeerSignal({
          type: "wa-item-activate",
          data: {
            username: myProfile.username,
            itemId: null,
            peer: this.$store.getters["onlineAuctionsStore/getAdministrator"](this.auctionId)
          }
        });
        this.showModal = false;
      });
    },
    activateBidding(itemId) {
      this.modalContent = "Putting this item into the ring...";
      let auction = this.$store.getters["myAuctionsStore/myAuction"](this.auctionId);
      biddingUtils.makeItemActive(auction, itemId);
      this.$store.dispatch("myAuctionsStore/updateAuction", auction).then(() => {
        let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
        peerToPeerService.sendPeerSignal({
          type: "wa-item-activate",
          data: {
            username: myProfile.username,
            itemId: itemId,
            data: this.$store.getters["onlineAuctionsStore/getAdministrator"](auction.auctionId)
          }
        });
        this.showModal = false;
      });
    },
  },
  computed: {
    sellingItemsSize() {
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](this.auctionId);
      return auction.items.length;
    },
    sellingItems() {
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](this.auctionId);
      if (auction && auction.items) {
        let following = auction.items; // .filter(item => !item.inplay);
        return following;
      } else {
        return [];
      }
    },
    availableItems() {
      let available = this.$store.getters["myArtworksStore/unsold"]; // (this.auctionId);
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](this.auctionId);
      if (available && available.length > 0) {
        let items = [];
        for (let key in available) {
          let artworkId = available[key].id;
          let index = _.findIndex(auction.items, function(o) {
            return o.itemId === artworkId;
          });
          if (index === -1) {
            items.push({itemId: available[key].id});
          }
        }
        return items;
      } else {
        return [];
      }
    },
    winning() {
      let winning = this.$store.getters["onlineAuctionsStore/getWinning"]({
        auctionId: this.auctionId,
        username: this.username
      });
      return winning;
    },
    countdown() {
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](this.auctionId);
      let serverTime = this.$store.getters["serverTime"];
      return auction ? utils.dt_Offset(serverTime, auction.startDate) : "?";
    },
    auction() {
      let auction = this.$store.getters["myAuctionsStore/myAuction"](this.auctionId);
      if (!auction || !auction.auctionId) {
        auction = {
          items: []
        };
      }
      return auction;
    },
    debugMode() {
      return this.$store.state.constants.debugMode;
    },
    updateUrl() {
      return `/my-auctions/update/${this.auctionId}`;
    },
    hammerItem() {
      let hammerItem;
      let auction = this.$store.getters["myAuctionsStore/myAuction"](this.auctionId);
      if (auction && auction.items) {
        hammerItem = auction.items.find(item => item.inplay);
      }
      if (hammerItem) {
        return hammerItem;
      }
    },
    onlineAuctionUrl() {
      let auction = this.$store.getters["myAuctionsStore/myAuction"](
        this.auctionId
      );
      if (auction) {
        return `/online-auction/${this.auctionId}`;
      } else {
        return "/";
      }
    }
  }
};
</script>
