<template>
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
</template>

<script>
import peerToPeerService from "@/services/peerToPeerService";
import moneyUtils from "@/services/moneyUtils";
import biddingUtils from "@/services/biddingUtils";
import HammerItem from "@/views/components/auction/HammerItem";
import MessageStream from "@/views/components/rtc/MessageStream";
import VideoStream from "@/views/components/rtc/VideoStream";
import WatchersStream from "@/views/components/rtc/WatchersStream";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "WebcastRegion",
  components: {
    HammerItem,
    VideoStream,
    WatchersStream,
    MessageStream,
  },
  props: ["auctionId", "winning"],
  data() {
    return {
      paused: false
    };
  },
  methods: {
  },
  computed: {
    hammerItem() {
      let hammerItem;
      let auction = this.$store.getters["myAuctionStore/myAuction"](this.auctionId);
      if (!auction) {
        auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](this.auctionId);
      }
      if (auction && auction.items) {
        hammerItem = auction.items.find(item => item.inplay);
      }
      return hammerItem;
    },
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
