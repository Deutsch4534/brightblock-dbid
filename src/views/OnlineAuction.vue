<template>
<loading-view v-if="loading" :loadingMessage="loadingMessage"/>
<mdb-container fluid class="bg-light flex-1 py-5" v-else>
  <mdb-container class="py-3 py-md-4">
    <auction-finished :auction="auction" :reason="finished" v-if="finished"/>
    <auction-finished :auction="auction" :reason="empty" v-else-if="artworksSize === 0"/>
    <div class="container" v-else>
      <mdb-media tag="div">
        <img v-if="auction.logo" class="img-fluid d-flex mr-3" style="width: 100px; border-radius: 20px;" :src="auction.logo.dataUrl" alt="auction.logo.name" />
        <mdb-media-body>
          <h5 class="mt-0 mb-2 font-weight-bold">{{auction.title}}</h5>
          <p>{{auction.description}}</p>
          <p class="">{{countdown}}</p>
        </mdb-media-body>
      </mdb-media>
      <webcast-region v-if="webcast" :winning="winning" :auctionId="auctionId"/>
      <div class="row" v-if="artworksSize > 0">
        <div class="col-md-12 ">
          <h4>{{sellingItems.length}} Items</h4>
          <ul class="list-unstyled">
            <single-auction-item class="auction-item-container" v-for="(item, index) of sellingItems" :key="index" :item="item" :auctionId="auctionId"/>
          </ul>
        </div>
      </div>
    </div>
  </mdb-container>
</mdb-container>
</div>
</template>

<script>
import WebcastRegion from "./components/auction/WebcastRegion";
import AuctionFinished from "./components/auction/AuctionFinished";
import SingleAuctionItem from "./components/auction/SingleAuctionItem";
import utils from "@/services/utils";
import peerToPeerService from "@/services/peerToPeerService";
import { mdbMedia, mdbMediaBody, mdbMediaImage, mdbContainer } from 'mdbvue';
import LoadingView from "@/views/components/utils/LoadingView";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "OnlineAuction",
  bodyClass: "index-page",
  components: {
    WebcastRegion,
    AuctionFinished,
    LoadingView,
    SingleAuctionItem,
    mdbMedia,
    mdbMediaBody,
    mdbMediaImage,
    mdbContainer
  },
  data() {
    return {
      auctionId: null,
      username: null,
      loadingMessage: "Loading auction please wait...",
      loading: true,
      webcast: true,
      auction: null
    };
  },
  beforeDestroy() {
    peerToPeerService.disconnect();
  },
  mounted() {
    window.addEventListener("beforeunload", this.stopPublishing);
    this.auctionId = Number(this.$route.params.auctionId);
    this.username = this.$route.params.username;
    let $self = this;
    this.$store.dispatch("myAccountStore/fetchMyAccount").then(myProfile => {
      this.$store.dispatch("onlineAuctionsStore/fetchOnlineAuction", this.auctionId).then((auction) => {
        if (!auction) {
          $self.loadingMessage = "This auction is no longer available <a href='/'><u>continue browsing</u></a>";
          return;
        }
        // loading online auctions
        // this.startPeerConnection(myProfile.username, this.auctionId);
        $self.auction = auction;
        $self.webcast = auction.auctionType === "webcast";
        $self.loading = false;
      });
      /**
      if (!auction) {
        this.$store
          .dispatch("onlineAuctionsStore/fetchUserAuctions", this.auctionId)
          .then(() => {
            auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](
              $self.auctionId
            );
            $self.auction = auction;
            this.startPeerConnection(myProfile.username, auction.auctionId);
          });
      } else {
        this.auction = auction;
        this.startPeerConnection(myProfile.username, auction.auctionId);
      }
      **/
    });
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
    startPeerConnection(username, auctionId) {
      try {
        peerToPeerService.startSession(this.$store, username, auctionId);
      } catch (e) {
        console.log(e);
      }
    }
  },
  computed: {
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
      if (!winning || !Array.isArray(winning)) {
        winning = [];
      }
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
    finished() {
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](this.auctionId);
      if (!auction) {
        return true;
      }
      let serverTime = this.$store.getters["serverTime"];
      return serverTime > auction.startDate;

      //let over = true;
      //auction.items.forEach(function(item) {
      //  if (!item.finished) {
      //    over = false;
      //  }
      //});
      //return over;
    },
    countdown() {
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](this.auctionId);
      let serverTime = this.$store.getters["serverTime"];
      return auction ? utils.dt_Offset(serverTime, auction.startDate, this.webcast) : "?";
    }
  }
};
</script>
