<template>
<mdb-row class="mb-3">
  <confirmation-modal :modal="showModal" :title="modalTitle" :content="modalContent" @closeModal="closeModal"/>
  <mdb-col lg="5" xl="4">
    <mdb-view hover class="rounded z-depth-1-half mb-lg-0 mb-4">
      <img class="img-fluid" :src="artwork.image" :alt="artwork.title" />
      <a><mdb-mask overlay="white-slight" waves/></a>
    </mdb-view>
  </mdb-col>
  <mdb-col lg="7" v-if="sellingItem">
    <h3 class="font-weight-bold mb-3 p-0"><small>{{artwork.title}} <span v-if="item.inplay">live</span></small></h3>
    <a v-if="!item.inplay" href @click.prevent="activateBidding"><mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light">Activate</mdb-btn></a>
    <a v-else href @click.prevent="deactivateBidding"><mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light">Deactivate</mdb-btn></a>
    <a href @click.prevent="removeFromAuction"><mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light">Remove</mdb-btn></a>
  </mdb-col>
  <mdb-col lg="7" v-else>
    <h3 class="font-weight-bold mb-3 p-0">
      <strong>{{artwork.title}}</strong>
    </h3>
    <a to="#" @click.prevent="showRegisterForSale = !showRegisterForSale"><mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light">Add to Auction</mdb-btn></a>
  </mdb-col>
  <mdb-row v-if="showRegisterForSale">
    <register-for-sale :artwork="artwork" :saleType="'auction'" :allowChange="false" @registerSaleInfo="registerSaleInfo"/>
  </mdb-row>
</mdb-row>

</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbCard, mdbCardBody, mdbMask, mdbIcon, mdbView, mdbBtn } from 'mdbvue';
import moment from "moment";
import DescriptionOverflow from "@/views/components/utils/DescriptionOverflow";
import RegisterForSale from "../myArtwork/RegisterForSale";
import ConfirmationModal from "../utils/ConfirmationModal";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MySingleAuctionItem",
  components: {
    ConfirmationModal,
    DescriptionOverflow,
    RegisterForSale,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbCard,
    mdbCardBody,
    mdbMask,
    mdbIcon,
    mdbView,
    mdbBtn
  },
  props: {
    auctionId: null,
    itemId: null,
    sellingItem: false,
    profile: null
  },
  data() {
    return {
      showRegisterForSale: false,
      showModal: false,
      modalTitle: "Updating Info",
      modalContent: "<p>Please wait - updating information for your artwork.</p>",
    };
  },
  mounted() {},
  methods: {
    registerSaleInfo: function(data) {
      if (data.operation === "start") {
        this.showModal = true;
      } else {
        this.showRegisterForSale = false;
        this.addToAuction(this.itemId); // $emit("stateChange", {opcode: "start", auctionId: this.auctionId, itemId: this.itemId})
      }
    },
    removeFromAuction() {
      // this.$emit("stateChange", {opcode: "removeFromAuction", auctionId: this.auctionId, itemId: this.itemId})
      this.modalContent = "Removing artwork from auction...";
      this.$store.dispatch("myArtworksStore/removeFromAuction", {
          auctionId: this.auctionId,
          itemId: this.itemId
        })
        .then(() => {
          $self.showModal = false;
        })
        .catch(e => {
          console.log(e.message);
        });
    },
    activateBidding() {
      this.$emit("stateChange", {opcode: "activate", auctionId: this.auctionId, itemId: this.itemId})
    },
    deactivateBidding() {
      this.$emit("stateChange", {opcode: "deactivate", auctionId: this.auctionId, itemId: this.itemId})
    },
    addToAuction(itemId) {
      this.modalContent = "Adding artwork to auction...";
      let artwork = this.$store.getters["myArtworksStore/myArtwork"](itemId);
      artwork.status = this.$store.state.constants.statuses.artwork.BIDDING_ENABLED;
      let $self = this;
      this.$store.dispatch("myArtworksStore/addToAuction", artwork).then(() => {
          $self.showModal = false;
          $self.showRegisterForSale = false;
        })
        .catch(e => {
          $self.message = e.message;
          $self.showModal = false;
          $self.showRegisterForSale = false;
        });
    },
    closeModal: function() {
      this.showModal = false;
    }
  },
  computed: {
    artwork() {
      let a = this.$store.getters["myArtworksStore/myArtworkOrDefault"](this.itemId);
      return a;
    },
    item() {
      let item = this.$store.getters["myAuctionsStore/myAuctionItem"](this.auctionId, this.itemId);
      return (item) ? item : {};
    }
  }
};
</script>
<style scoped>
</style>
