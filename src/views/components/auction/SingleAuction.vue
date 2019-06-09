<template>
  <mdb-col sm="6" md="4" lg="3" class="mb-3 d-flex">
    <mdb-card class="bg-transparent mb-5 w-100">
      <mdb-view hover>
        <mdb-card-image :src="logo" alt="Auction Logo" class="img-square"></mdb-card-image>
        <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
      </mdb-view>
      <mdb-card-body class="px-0 pb-2 mb-0">
        <mdb-card-title class="">{{auction.title}}</mdb-card-title>
        <mdb-card-text>{{auction.description}}</mdb-card-text>
        <!--<mdb-card-text class="text-dark">{{countdown}}</mdb-card-text>-->
      </mdb-card-body>
      <div class="card-buttons d-flex align-items-end justify-content-between flex-wrap">
        <router-link v-if="isAdministrator" :to="manageUrl"><mdb-btn rounded color="white" size="sm" class="mx-0">Manage</mdb-btn></router-link>
        <a v-if="canJoin" @click="gotoAuction"><mdb-btn rounded color="white" size="sm" class="mx-0">Open</mdb-btn></a>
      </div>
    </mdb-card>
  </mdb-col>
</template>

<script>
import utils from "@/services/utils";
import moment from "moment";
import { mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn, mdbCol, mdbView, mdbMask } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SingleAuction",
  components: {
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn,
    mdbCol,
    mdbView,
    mdbMask
  },
  props: {
    auction: {
      type: Object,
      default() {
        return {};
      }
    },
    atype: null,
  },
  methods: {
    convertDate(date) {
      return moment(date).format();
    },
    gotoAuction(date) {
      this.$router.push("/online-auction/" + this.auction.auctionId);
    }
  },
  computed: {
    onlineAuctionUrl() {
      return `/online-auction/${this.auction.auctionId}`;
    },
    logo() {
      if (this.auction.logo && this.auction.logo.dataUrl) {
        return this.auction.logo.dataUrl;
      }
      return require("@/assets/img/missing/artwork-missing.jpg");
    },
    manageUrl() {
      return `/my-auctions/manage/${this.auction.auctionId}`;
    },
    canJoin() {
      return this.atype !== "archive";
    },
    isAdministrator() {
      let userProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return this.auction.administrator === userProfile.username;
    },
    countdown() {
      let serverTime = this.$store.getters["serverTime"];
      return utils.dt_Offset(serverTime, this.auction.startDate);
    }
  }
};
</script>
<style scoped>
</style>
