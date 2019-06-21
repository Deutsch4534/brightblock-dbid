<template>
<loading-view v-if="loading" :loadingMessage="loadingMessage"/>
<div v-else>
<contact-section :featureMessage="featureMessage" v-if="!enabled"/>
<mdb-container fluid class="" v-else>
  <mdb-container class="py-3 py-md-4">
    <router-view/>
    <mdb-row>
      <mdb-col col="12">
        <h1 class="h1-responsive mb-5">My Auctions <span>({{myAuctionsFutureCount}})</span></h1>
      </mdb-col>
    </mdb-row>
    <mdb-row v-if="myAuctionsFutureCount > 0">
      <single-auction v-for="(auction, index) of myAuctionsFuture" :key="index" :auction="auction" :atype="'webcast'"/>
    </mdb-row>
    <mdb-row>
      <mdb-col col="12">
        <h1 class="h1-responsive mb-5">Past Auctions</h1>
      </mdb-col>
    </mdb-row>
    <mdb-row v-if="myAuctionsPastCount > 0">
      <single-auction v-for="(auction, index) of myAuctionsPast" :key="index" :auction="auction" :atype="'archive'"/>
    </mdb-row>
  </mdb-container>
</mdb-container>
</div>
</template>

<script>
import utils from "@/services/utils";
import SingleAuction from "./components/auction/SingleAuction";
import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';
import ContactSection from "@/pages/components/help/ContactSection";
import LoadingView from "@/views/components/utils/LoadingView";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyAuctions",
  bodyClass: "index-page",
  components: { LoadingView, ContactSection, SingleAuction, mdbContainer, mdbRow, mdbCol },
  data() {
    return {
      loading: true,
      featureMessage: "Please drop us a note about about partnering with us to run your own Radicle Gallery and Auctions.",
      loadingMessage: "Loading Radicle Auctions please wait...",
    };
  },
  created() {
    this.$store.dispatch("myAuctionsStore/fetchMyAuctions");
  },
  mounted() {
    this.$store.dispatch("myAuctionsStore/fetchMyAuctions").then((myAuctions) => {
      this.$store.dispatch("myAccountStore/fetchMyAccount").then((myProfile) => {
        if (myProfile) {
          this.enabled = myProfile.showAdmin;
          this.auctions = myAuctions;
          this.loading = false;
        } else {
          this.loadingMessage = "Please login.";
        }
      });
    });
  },
  methods: {
    startsIn(date) {
      return utils.dt_Offset(date);
    }
  },
  computed: {
    myAuctionsFuture() {
      return this.$store.getters["myAuctionsStore/myAuctionsFuture"];
    },
    myAuctionsPast() {
      return this.$store.getters["myAuctionsStore/myAuctionsPast"];
    },
    myAuctionsFutureCount() {
      return this.$store.getters["myAuctionsStore/myAuctionsFutureCount"];
    },
    myAuctionsPastCount() {
      return this.$store.getters["myAuctionsStore/myAuctionsPastCount"];
    }
  }
};
</script>
