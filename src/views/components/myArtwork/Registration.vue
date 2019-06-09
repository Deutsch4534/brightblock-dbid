<template>
<mdb-container fluid class="bg-light flex-1 pt-5">
  <confirmation-modal :modal="showModal" :title="modalTitle" :content="modalContent" @closeModal="closeModal"/>
  <mdb-container class="bg-white mt-5 p-3">
    <mdb-row>
      <mdb-col col="8">
        <h1>
          <router-link :to="myArtworkUrl" class="inline-block">
            <mdb-icon far icon="arrow-alt-circle-left" />
          </router-link>
          {{artwork.title}}
        </h1>
        </mdb-col>
      <mdb-col col="4" class="text-right"><small class="teal-text">{{bitcoinTx}}</small></mdb-col>
    </mdb-row>
    <mdb-row>
      <mdb-col col="4">
        <mdb-view hover>
          <img class="inplay-image img-fluid mb-4" width="100%" :src="artwork.image" :alt="artwork.title">
          <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
        </mdb-view>
      </mdb-col>
      <mdb-col col="8">
        <register-bitcoin v-if="!artwork.bitcoinTx" @registerStatusUpdate="updateRegisterStatus"/>
        <create-coa v-if="artwork.bitcoinTx"/>
      </mdb-col>
    </mdb-row>
  </mdb-container>
</mdb-container>
</template>

<script>
import CreateCoa from "./CreateCoa";
import RegisterBitcoin from "./RegisterBitcoin";
import utils from "@/services/utils";
import notify from "@/notify";
import ethereumService from "@/services/ethereumService";
// import OpenTimestamps from "javascript-opentimestamps";
import { mdbPopover, mdbIcon, mdbCol, mdbView, mdbMask, mdbRow, mdbContainer, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import ConfirmationModal from "../utils/ConfirmationModal";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Registration",
  components: {
    CreateCoa,
    ConfirmationModal,
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
    mdbBtn,
    mdbIcon
  },
  data() {
    return {
      message: null,
      artworkId: null,
      from: "/my-artworks",
      showArtworkHash: false,
      showModal: false,
      modalTitle: "Register",
      modalContent: "<p>Transaction sent - confirmation takes ~ 6 blocks which is about an hour..</p>" +
            "<p>Once confirmed you'll be able to generate Certificate of Authenticity.</p>",
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
  methods: {
    closeModal: function() {
      this.showModal = false;
    },
    blockchainInfoUrl() {
      let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](this.artworkId);
      let state = this.$store.getters["assetStore/getBitcoinConfig"];
      if (state.chain === "test") {
        return `https://testnet.smartbit.com.au/tx/${artwork.bitcoinTx}`;
      }
      return `https://www.blockchain.com/btc/tx/${artwork.bitcoinTx}`;
    },
    updateRegisterStatus(result) {
      if (result.error) {
        this.modalContent = result.message;
      }
      this.showModal = true;
    },
  },
  computed: {
    artwork() {
      let a = this.$store.getters["myArtworksStore/myArtworkOrDefault"](this.artworkId);
      if (!a.image) {
        a.image = require("@/assets/img/missing/artwork-missing.jpg");
      }
      return a ? a : {};
    },
    myArtworkUrl() {
      return `/my-artworks/${this.artwork.id}`;
    },
    artworkHash() {
      let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](this.artworkId);
      return utils.buildBitcoinHash(artwork);
    },
    bitcoinTx() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      if (myProfile.publicKeyData) {
        return myProfile.publicKeyData.bitcoinAddress;
      }
    },
    myArtist() {
      let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](this.artworkId);
      return this.$store.getters["userProfilesStore/getProfile"](
        artwork.artist
      );
    }
  }
};
</script>
