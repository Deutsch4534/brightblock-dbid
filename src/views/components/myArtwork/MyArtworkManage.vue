<template>
  <mdb-container class="bg-white mt-5 p-3">
    <confirmation-modal :modal="showModal" :title="modalTitle" :content="modalContent" @closeModal="closeModal"/>
    <delete-artwork-modal :modal="showDeleteModal" :title="modalTitle" :content="modalContent" @deleteArtworkConfirmed="deleteArtworkConfirmed"/>
    <mdb-row>
      <mdb-col class="col-md-8 col-sm-12">
        <h1>
          <router-link :to="myArtworksUrl" class="inline-block">
            <mdb-icon far icon="arrow-alt-circle-left" />
          </router-link>
          {{artwork.title}}
        </h1>
      </mdb-col>
      <mdb-col class="col-md-4 col-sm-12 text-right mb-5"><small class="teal-text">{{bitcoinAddress}}</small></mdb-col>
    </mdb-row>
    <mdb-row v-if="!loading">
      <mdb-col col="4">
        <mdb-view hover>
          <img class="inplay-image img-fluid mb-4" width="100%" :src="artwork.image" :alt="artwork.title" v-if="isImage" />
          <mdb-mask flex-center waves overlay="white-slight" v-if="isImage"></mdb-mask>
          <media-container class="inplay-image img-fluid mb-4" :mediaObject="artwork.artwork" :altText="artwork.title" v-else/>
        </mdb-view>
      </mdb-col>
      <mdb-col col="8">
        <mdb-card-text>
          <p><description-overflow :text="artwork.description"/></p>
          <selling-options :artwork="artwork" v-if="sellingStatus === 'unsold'"/>
          <p class="artwork-caption" v-if="debugMode && artwork">{{artwork.bcitem}}</p>
          <p>{{artistProfile.name}}, 11/08/2018</p>
        </mdb-card-text>
        <div class="card-buttons">

          <a @click.prevent="showRegisterOnBitcoin = !showRegisterOnBitcoin" class="inline-block" v-if="canRegister">
            <mdb-btn rounded color="white" size="sm" class="mx-0 waves-light">Register</mdb-btn>
          </a>
          <a class="inline-block" v-else>
            <mdb-btn rounded color="white" :disabled="true" size="sm" class="mx-0 waves-light">Registered</mdb-btn>
          </a>

          <a  @click.prevent="openCoa()" class="inline-block" v-if="artwork.coa">
            <mdb-btn rounded color="white" size="sm" class="mx-0 waves-light">Open CoA</mdb-btn>
          </a>
          <a @click.prevent="removeCoa()" class="inline-block" v-if="artwork.coa">
            <mdb-btn rounded color="white" size="sm" class="mx-0 waves-light">Remove CoA</mdb-btn>
          </a>
          <a class="inline-block" v-if="asset.assetRegistrationTx && !artwork.coa" @click.prevent="showGenerateCoA = !showGenerateCoA">
            <mdb-btn rounded color="white" size="sm" class="mx-0 waves-light">Generate CoA</mdb-btn>
          </a>

          <a to="#" class="inline-block" @click.prevent="showRegisterForSale = !showRegisterForSale">
            <mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light" v-if="canSell" >Sell</mdb-btn>
          </a>
          <router-link :to="editUrl" class="inline-block" v-if="editable">
            <mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light">Edit</mdb-btn>
          </router-link>
          <router-link :to="artworkUrl" class="inline-block">
            <mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light">Open</mdb-btn>
          </router-link>
          <a @click="deleteArtwork" class="inline-block" v-if="deletable">
            <mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light">Delete</mdb-btn>
          </a>
        </div>

        <mdb-row v-if="showRegisterOnBitcoin">
          <register-bitcoin :artwork="artwork" :myProfile="myProfile" @registerBitcoin="registerBitcoin"/>
        </mdb-row>
        <mdb-row v-if="showRegisterForSale">
          <register-for-sale :artwork="artwork" :saleType="'direct'" :allowChange="true" @registerSaleInfo="registerSaleInfo"/>
        </mdb-row>
        <mdb-row v-if="showGenerateCoA">
          <create-coa v-if="asset.assetRegistrationTx" :artwork="artwork" :myProfile="myProfile" @reload="reload"/>
        </mdb-row>
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
import { mdbIcon, mdbPopover, mdbCol, mdbView, mdbMask, mdbRow, mdbContainer, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import ConfirmationModal from "../utils/ConfirmationModal";
import DeleteArtworkModal from "./DeleteArtworkModal";
import RegisterForSale from "./RegisterForSale";
import DescriptionOverflow from "@/views/components/utils/DescriptionOverflow";
import MediaContainer from "@/views/components/utils/MediaContainer";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtworkManage",
  components: {
    MediaContainer, DescriptionOverflow,
    CreateCoa,
    ConfirmationModal,
    DeleteArtworkModal,
    RegisterBitcoin,
    RegisterForSale,
    mdbPopover, mdbIcon,
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
  props: {
    sellingStatus: "sold",
    artwork: {
      type: Object,
      default() {
        return {};
      }
    },
    asset: {
      type: Object,
      default() {
        return {};
      }
    },
    myProfile: {
      type: Object,
      default() {
        return {};
      }
    },
    width: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      showDeleteModal: false,
      loading: true,
      showRegisterForSale: false,
      showRegisterOnBitcoin: false,
      showGenerateCoA: false,
      showModal: false,
      modalTitle: "Register",
      modalContent: "<p>Transaction sent - confirmation takes ~ 6 blocks which is about an hour..</p>" +
            "<p>Once confirmed you'll be able to generate Certificate of Authenticity.</p>",
      modalTitle1: "Updating Info",
      modalContent1: "<p>Please wait - updating information for your artwork.</p>",
      modalTitleDelete: "Please Confirm Delete",
      modalContentDelete: "<p class='text-center'>This can't be undone.</p>",
    };
  },
  mounted() {
    // this.artwork.saleData.fiatCurrency = "GBP";
    this.loading = false;
  },
  methods: {
    deleteArtwork() {
      this.modalTitle = this.modalTitleDelete;
      this.modalContent = this.modalContentDelete;
      this.showDeleteModal = true;
    },
    deleteArtworkConfirmed(data) {
      if (data.proceed) {
        this.$store.dispatch("myArtworksStore/deleteMyArtwork", this.artwork.id).then((artwork) => {
          this.$router.push("/my-artworks");
          this.showDeleteModal = false;
        });
      } else {
        this.showDeleteModal = false;
      }
    },
    reload: function() {
      this.$emit("reload");
      this.showGenerateCoA = false;
    },
    closeModal: function() {
      this.showModal = false;
    },
    registerSaleInfo: function(data) {
      if (data.operation === "start") {
        this.modalTitle = this.modalTitle1;
        this.modalContent = this.modalContent1;
        this.showModal = true;
      } else {
        this.showModal = false;
        this.showRegisterForSale = false;
      }
    },
    registerBitcoin: function(result) {
      if (result.error) {
        this.modalContent = result.message;
      } else {
        this.modalContent = result.message;
      }
      this.showModal = true;
    },
    removeCoa: function() {
      this.artwork.coa = null;
      this.modalTitle = this.modalTitle1;
      this.modalContent = this.modalContent1;
      this.showModal = true;
      this.$store.dispatch("myArtworksStore/updateArtwork", {artwork: this.artwork, updateProvData: true})
        .then((artwork) => {
          this.$emit("reload");
          this.showModal = false;
          this.showGenerateCoA = false;
          notify.info({
            title: "Register Artwork.",
            text: "Your user storage has been updated."
          });
        });
    },
    openCoa: function() {
      let pdfWindow = window.open("", "CertificateAuthenticity");
      pdfWindow.document.write("<html><head></head><body><iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(this.artwork.coa)+"'></iframe></body></html>");
    },
  },
  computed: {
    editable() {
      return this.$store.getters["myArtworksStore/editable"](this.artwork.id);
    },
    isImage: function() {
      try {
        return this.artwork.artwork[0].type.indexOf("image/cover") === -1;
      } catch (e) {
        return true;
      }
    },
    deletable() {
      return this.$store.getters["myArtworksStore/editable"](this.artwork.id);
    },
    bitcoinAddress() {
      if (this.myProfile.publicKeyData) {
        return this.myProfile.publicKeyData.bitcoinAddress;
      }
    },
    created() {
      if (this.artwork.created) {
        return moment(this.artwork.created).format("LLLL");
      }
      return moment(this.artwork.id).format("LLLL");
    },
    debugMode() {
      return this.$store.state.constants.debugMode;
    },
    canSell() {
      return true;
    },
    canRegister() {
      let canRegister = this.$store.getters["myArtworksStore/canRegister"](
        this.artwork.id
      );
      return canRegister && !this.sold;
    },
    artistProfile() {
      let profile = this.$store.getters["userProfilesStore/getProfile"](
        this.artwork.artist
      );
      return profile ? profile : {};
    },
    ownerProfile() {
      return this.$store.getters["userProfilesStore/getProfile"](
        this.artwork.owner
      );
    },
    editUrl() {
      return `/my-artwork/update/${this.artwork.id}`;
    },
    artworkUrl() {
      return `/artworks/${this.artwork.id}`;
    },
    myArtworksUrl() {
      return `/my-artworks`;
    },
    registerUrl() {
      return `/my-artwork/register/${this.artwork.id}`;
    }
  }
};
</script>
