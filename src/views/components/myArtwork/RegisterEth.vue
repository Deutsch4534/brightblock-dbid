<template>
<mdb-container>
  <mdb-row class="mt-5">
    <mdb-col sm="10" class="mx-auto">
    <h1>Artwork Registration</h1>
    <hr/>
    </mdb-col>
    <mdb-col sm="10" class="mx-auto">
      <mdb-card>
        <mdb-card-body style="display: none">
          <mdb-card-text>
            <div class="row">
              <div class="col-md-12 text-center teal lighten-1" style="font-size: 1.5em;>
                <span style="line-height: 5em; text-align: top">Register</span>
                <i class="fas fa-arrow-right fa-1x teal lighten-1 pr-3" aria-hidden="true"></i>
                Certify
                <i class="fas fa-arrow-right fa-1x teal lighten-1 pr-3" aria-hidden="true"></i>
                Sell
              </div>
            </div>
          </mdb-card-text>
        </mdb-card-body>

        <create-coa v-if="artwork.bitcoinTx"/>
        <register-bitcoin v-else/>

        <mdb-card-body v-if="featureEthereum">
          <mdb-card-title>Ethereum Blockchain ({{networkName}} network)</mdb-card-title>
          <mdb-card-text>
          Register on ethereum if you use meta mask or another ethereum wallet.</mdb-card-text>
          <a class="black-text d-flex justify-content-end"><mdb-btn v-if="featureEthereum" class="btn teal lighten-1" size="md" :disabled="registered" @click="registerArtworkEthereum()">Register Ethereum ({{networkName}})</mdb-btn></a>
        </mdb-card-body>
        <mdb-view hover>
          <img class="img-fluid" width="100%" :src="artwork.image" :alt="artwork.title"></img>
          <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
        </mdb-view>
        <mdb-card-body>
          <mdb-card-title>{{artwork.title}}</mdb-card-title>
          <mdb-card-title class="text-right"><small>{{myArtist.name}}</small></mdb-card-title>
          <hr/>
        </mdb-card-body>
      </mdb-card>
    </mdb-col>
  </mdb-row>
</mdb-container>
</template>

<script>
import CreateCoa from "./CreateCoa";
import RegisterBitcoin from "./RegisterBitcoin";
import utils from "@/services/utils";
import notify from "@/notify";
import ethereumService from "@/services/ethereumService";
import bitcoinService from "@/services/bitcoinService";
// import OpenTimestamps from "javascript-opentimestamps";
import { mdbPopover, mdbCol, mdbView, mdbMask, mdbRow, mdbContainer, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Registration",
  components: {
    CreateCoa,
    RegisterBitcoin,
    mdbPopover,
    mdbContainer,
    mdbCol,
    mdbMask,
    mdbView,
    mdbRow,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn
  },
  data() {
    return {
      message: null,
      artworkId: null,
      from: "/my-artworks",
      bitcoinTx: null
    };
  },
  mounted() {
    this.artworkId = Number(this.$route.params.artworkId);
    if (this.$route.query.from && this.$route.query.from === "auctions") {
      this.from = "/my-auctions/manage/" + this.$route.query.auctionId;
    }
    let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
    this.$store.dispatch("assetStore/fetchBalance");
    this.$store.dispatch("assetStore/fetchBitcoinState");
  },
  computed: {
    fiatRates() {
      return this.$store.getters["conversionStore/getFiatRates"];
    },
    networkName() {
      try {
        return this.$store.state.ethStore.clientState.metaMaskNetwork.networkName;
      } catch (err) {
        return "unknown network";
      }
    },
    featureBitcoin() {
      return this.$store.state.constants.featureBitcoin;
    },
    featureEthereum() {
      return this.$store.state.constants.featureEthereum;
    },
    artwork() {
      let a = this.$store.getters["myArtworksStore/myArtworkOrDefault"](
        this.artworkId
      );
      if (!a.image) {
        a.image = require("@/assets/img/logo/logo-black-256x256.png");
      }
      return a ? a : {};
    },
    myArtist() {
      let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](
        this.artworkId
      );
      return this.$store.getters["userProfilesStore/getProfile"](
        artwork.artist
      );
    },
    registered() {
      if (!this.artworkId) {
        return false;
      }
      let bcstatus = this.$store.getters["myArtworksStore/bcstatus"](
        this.artworkId
      );
      return bcstatus.itemId > -1;
    }
  },
  methods: {
    registerArtworkEthereum: function() {
      this.message =
        "Registering your artwork - please allow a few minutes for the transaction to complete...";
      let artwork = this.$store.getters["myArtworksStore/myArtwork"](
        this.artworkId
      );
      if (!artwork || !artwork.id) {
        return;
      }
      let uploader = this.$store.getters["myAccountStore/getMyProfile"]
        .username;
      let regData = {
        title: artwork.title,
        timestamp: utils.buildArtworkHash(artwork.artwork[0].dataUrl),
        uploader: uploader
      };
      let $self = this;
      ethereumService.registerOnChain(
        regData,
        function(result) {
          notify.info({
            title: "Register Artwork.",
            text: "Transaction sent to the blockchain..."
          });
          artwork.bcitem = {
            registerTxId: result.txId,
            status: "pending-register"
          };
          $self.$store.commit("myArtworksStore/addMyArtwork", artwork);
          $self.$store
            .dispatch("myArtworksStore/updateArtwork", {artwork: artwork, updateProvData: false})
            .then(artwork => {
              notify.info({
                title: "Register Artwork.",
                text: "User storage has been updated..."
              });
              $self.$store
                .dispatch("myArtworksStore/syncBlockchainState", artwork)
                .then(() => {});
              $self.$router.push(this.from);
            });
        },
        function(error) {
          console.log(error);
          $self.message =
            "Please check you are logged into your Meta Mask account and on the correct network.";
          notify.error({
            title: "Register Artwork.",
            text:
              "Error registering your item - please check meta mask is running and unlocked. <br>"
          });
        }
      );
    }
  }
};
</script>
