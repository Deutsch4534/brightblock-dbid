<template>
  <mdb-container fluid class="bg-light flex-1 py-5">
    <mdb-container class="py-3 py-md-4">
      <mdb-row>
        <mdb-col col="12">
          <h1 class="h1-responsive mb-5">Auctions</h1>
        </mdb-col>
      </mdb-row>
      <mdb-row v-if="auctionsSize > 0">
        <single-auction v-for="(auction, index) of onlineAuctions" :key="index" :auction="auction"/>
      </mdb-row>
      <mdb-row v-else>
        <mdb-col col="12">
          <p>No upcoming auctions; check back soon - or - <router-link to="/news-signup"><u>sign up for our newsletter</u></router-link></p>
        </mdb-col>
      </mdb-row>
      <mdb-row v-if="auctionsArchiveSize > 0">
        <mdb-col col="12">
          <h1 class="h1-responsive mb-5">Past Auctions</h1>
        </mdb-col>
      </mdb-row>
      <mdb-row>
        <single-auction v-for="(auction, index) of pastAuctions" :key="index" :auction="auction" :atype="'archive'"/>
      </mdb-row>
    </mdb-container>
  </mdb-container>
</template>

<script>
import SingleAuction from "./components/auction/SingleAuction";
import { mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn, mdbCol } from 'mdbvue';
import { mdbContainer, mdbRow } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "OnlineAuctions",
  bodyClass: "index-page",
  components: {
    mdbContainer,
    mdbRow,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn,
    mdbCol,
    SingleAuction
  },
  data() {
    return {};
  },
  created() {
    this.$store.dispatch("onlineAuctionsStore/fetchOnlineAuctions").then(() => {
      // loading online auctions
    });
  },
  methods: {},
  computed: {
    auctionsSize() {
      return this.$store.getters["onlineAuctionsStore/onlineAuctions"].length;
    },
    auctionsArchiveSize() {
      return this.$store.getters["onlineAuctionsStore/pastAuctions"].length;
    },
    onlineAuctions() {
      return this.$store.getters["onlineAuctionsStore/onlineAuctions"];
    },
    pastAuctions() {
      return this.$store.getters["onlineAuctionsStore/pastAuctions"];
    }
  }
};
</script>
