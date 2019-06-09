<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 ">
        <h1>{{auction.title}} <span>({{artworksSize}} items)</span></h1>
        <p>{{auction.description}}</p>
        <p>{{countdown}}</p>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <hammer-item :item="hammerItem" :auctionId="auctionId"/>
      </div>
      <div class="col-md-6">
        <div class="row" v-if="winning.length > 0">
          <div class="col-md-6">
            <h4>Won items</h4>
            <p v-for="(item, index) of winning" :key="index">
              {{item.itemId}}
            </p>
          </div>
        </div>
        <watchers-stream :auctionId="auctionId"/>
        <video-stream :canPublish="false"/>
        <message-stream :auctionId="auctionId" :admin="false"/>
      </div>
    </div>
    <div class="row" v-if="artworksSize > 0">
      <div class="col-md-12 ">
        <h4>Next Items</h4>
        <ul class="list-unstyled">
          <single-auction-item class="auction-item-container" v-for="(item, index) of sellingItems" :key="index" :item="item" :auctionId="auctionId"/>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import SingleAuctionItem from "./components/auction/SingleAuctionItem";
import HammerItem from "./components/auction/HammerItem";
import MessageStream from "./components/rtc/MessageStream";
import VideoStream from "./components/rtc/VideoStream";
import WatchersStream from "./components/rtc/WatchersStream";
import utils from "@/services/utils";
import peerToPeerService from "@/services/peerToPeerService";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "OnlineAuction",
  bodyClass: "index-page",
  components: {
    WatchersStream,
    SingleAuctionItem,
    HammerItem,
    VideoStream,
    MessageStream
  },
  data() {
    return {
      auctionId: null,
      username: null
    };
  },
  beforeDestroy() {
    peerToPeerService.disconnect();
  },
  mounted() {
    window.addEventListener("beforeunload", this.stopPublishing);
    /**
    let $self = this;
    this.$store
      .dispatch("onlineAuctionsStore/fetchOnlineAuctions")
      .then(onlineAuctions => {
        let auction = {};
        onlineAuctions.forEach(function(a) {
          if (a.auctionType === "sealed") {
            auction = a;
          }
        });
        this.$store
          .dispatch("myAccountStore/fetchMyAccount")
          .then(myProfile => {
            this.username = myProfile.username;
            if (!auction) {
              this.$store
                .dispatch(
                  "onlineAuctionsStore/fetchUserAuctions",
                  this.auctionId
                )
                .then(() => {
                  auction = this.$store.getters[
                    "onlineAuctionsStore/onlineAuction"
                  ]($self.auctionId);
                  $self.auction = auction;
                  this.startPeerConnection(auction);
                });
            } else {
              this.auction = auction;
              this.startPeerConnection(auction);
            }
          });
      });
      **/
  },
  methods: {
    myUsername() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      if (myProfile) {
        return myProfile.username;
      } else {
        return "";
      }
    },
    startPeerConnection(auction) {
      try {
        peerToPeerService.startSession(this.$store, this.username, auction.auctionId);
      } catch (e) {
        console.log(e);
      }
    }
  },
  computed: {
    auction() {
      let auctions = this.$store.getters["onlineAuctionsStore/sealedAuctions"];
      if (auctions && auctions.length > 0) {
        return auctions[0];
      } else {
        return {
          title: "no title"
        };
      }
    },
    administrator() {
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](
        this.auctionId
      );
      if (auction) {
        return auction.administrator;
      } else {
        return {};
      }
    },
    winning() {
      let winning = this.$store.getters["onlineAuctionsStore/getWinning"]({
        auctionId: this.auctionId,
        username: this.username
      });
      return winning;
    },
    sellingItems() {
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](
        this.auctionId
      );
      if (auction && auction.items) {
        let following = auction.items.filter(item => !item.inplay);
        return following;
      } else {
        return [];
      }
    },
    hammerItem() {
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](
        this.auctionId
      );
      if (auction && auction.items) {
        let hammerItems = auction.items.filter(item => item.inplay);
        if (hammerItems && hammerItems.length === 1) {
          return hammerItems[0];
        }
      }
      return {};
    },
    peers() {
      return this.$store.getters["onlineAuctionsStore/getPeers"];
    },
    artworksSize() {
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](
        this.auctionId
      );
      return auction && auction.items ? auction.items.length : 0;
    },
    countdown() {
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](
        this.auctionId
      );
      let serverTime = this.$store.getters["serverTime"];
      return auction ? utils.dt_Offset(serverTime, auction.startDate) : "?";
    }
  }
};
</script>
