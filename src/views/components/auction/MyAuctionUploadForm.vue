<template>
<mdb-container class="py-5" v-if="loaded">
  <!-- Supported elements -->
  <confirmation-modal :modal="showModal" :title="modalTitle" :content="modalContent" @closeModal="closeModal"/>
  <h1 class="my-2" v-if="gallery">{{gallery.title}} Auction</h1>
  <h1 class="my-2" v-else>Standalone Auction</h1>
  <h4 class="mt-3">Part 1: Auction Meta Data</h4>
  <form class="needs-validation py-5 form-transparent" novalidate @submit.prevent="checkForm" id="auctionForm">

    <!-- Input fields section -->
    <div class="row m-0 justify-content-between">

      <!-- Left column -->
      <div class="col-md-5">

        <!-- Errors row -->
        <div class="form-group mb-3" :key="errors.length">
          <mdb-alert color="danger" v-if="errors.length" :key="errors.length" class="w-100">
            <h4 class="alert-heading h6">Please correct the following error(s):</h4>
            <hr>
            <ul class="list-unstyled small">
              <li v-for="(error) in errors" :key="error" v-bind:error="error">{{ error }}</li>
            </ul>
          </mdb-alert>
        </div>

        <!-- Radio buttons row -->
        <div class="row m-0 mb-3">
          <div class="col-4 custom-control custom-radio">
            <input type="radio" class="custom-control-input" id="customControlValidation2" name="auction.auctionType"
                   v-model="auction.auctionType" value="webcast" required>
            <label class="custom-control-label" for="customControlValidation2">Webcast</label>
          </div>
          <div class="col-4 custom-control custom-radio">
            <input type="radio" class="custom-control-input" id="customControlValidation1" name="auction.auctionType"
                   v-model="auction.auctionType" value="timed" required>
            <label class="custom-control-label" for="customControlValidation1">Timed</label>
          </div>
        </div>

        <div class="form-group mb-3" v-if="auction.auctionType === 'sealed'">
          <input type="text" class="form-control" id="sealedAddress" placeholder="Bitcoin address" v-model="auction.sealedAddress" required>
          <div class="invalid-feedback">
            Please enter bitcoin address!
          </div>
        </div>

        <div class="form-group mb-4">
          <input type="text" class="form-control" id="title" placeholder="Title of the auction" v-model="auction.title" required>
          <div class="invalid-feedback">
            Please enter a title!
          </div>
        </div>

        <div class="form-group mb-4">
          <textarea type="text" class="form-control" id="description" placeholder="Description of your auction" v-model="auction.description" required></textarea>
          <div class="invalid-feedback">
            Please enter a description!
          </div>
        </div>

        <div class="form-group mb-4">
          <textarea type="text" class="form-control" id="keywords" placeholder="Keywords" v-model="auction.keywords" required></textarea>
          <!--<p class="muted small mt-1">Enter keywords / tags separated by commas</p>-->
          <div class="invalid-feedback">
            Enter keywords / tags separated by commas
          </div>
        </div>

        <!-- Auction dates -->
        <div class="form-group">
          <label for="startDate" slot="before">Bidding starts at</label>
          <datetime type="datetime" v-model="startDate" input-id="startDate" input-class="form-control bg-transparent">
            <input id="startDate">
          </datetime>
        </div>
        <div class="form-group mb-5" v-if="auction.auctionType !== 'webcast'">
          <label for="endDate" slot="before">Bidding ends at</label>
          <datetime type="datetime" v-model="endDate" input-id="endDate" input-class="form-control bg-transparent">
            <input id="endDate">
          </datetime>
        </div>

        <!-- Public / private buttons row
        <mdb-btn-group class="form-row d-flex mb-4">
          <div class="col-6">
            <mdb-btn type="button" color="white" size="sm" class="btn-rounded btn-block" id="custom-public"
                     value="public" v-model="auction.privacy" @click.native="auction.privacy = 'public'" :active="auction.privacy === 'public'" required>
              Public
            </mdb-btn>
          </div>
          <div class="col-6">
            <mdb-btn type="button" color="white" size="sm" class="btn-rounded btn-block" id="custom-private"
                     value="private" v-model="auction.privacy" @click.native="auction.privacy = 'private'" :active="auction.privacy === 'private'" required>
              Private
            </mdb-btn>
          </div>
        </mdb-btn-group>
         -->

        <!-- Submit button row -->
        <div class="row">
          <div class="col-12">
            <mdb-btn type="submit" size="sm" class="btn-block teal lighten-1">Save and Continue</mdb-btn>
          </div>
        </div>
      </div>

      <!-- Right column -->
      <div class="col-md-6">
        <div class="row">
          <media-files-upload :contentModel="contentModel" :parentalError="parentalError" :mediaFiles="mediaFiles" :limit="1" :sizeLimit="500" :mediaTypes="'image'" @updateMedia="setByEventLogo($event)"/>
        </div>
      </div>
    </div>
  </form>
</mdb-container>
</template>

<script>
import moment from "moment";
import { mdbBtn, mdbBtnGroup, mdbContainer, mdbRow, mdbCol, mdbAlert } from 'mdbvue';
import { Datetime } from 'vue-datetime'
import MediaFilesUpload from "../utils/MediaFilesUpload";
import ConfirmationModal from "../utils/ConfirmationModal";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyAuctionUploadForm",
  props: ["auctionId", "mode"],
  components: {
    mdbContainer,
    mdbBtn,
    mdbBtnGroup,
    mdbRow,
    mdbCol,
    mdbAlert,
    datetime: Datetime,
    MediaFilesUpload,
    ConfirmationModal
  },
  data () {
    return {
      isModalActive: false,
      errors: [],
      parentalError: null,
      loaded: false,
      gallery: null,
      formTitle: "Submit Auction",
      startDate: null,
      endDate: null,
      showModal: false,
      modalTitle: "Saving Auction..",
      modalContent: "<p>Please wait while we save your data.</p>",
      contentModel: {
        title: "Cover image",
        errorMessage: "Cover image is required.",
        popoverBody: "Promote your galleries brand by uploading a logo / cover image.<br/><br/>A single square(ish) image up to 500Kb.",
      },
      auction: {
        title: null,
        description: null,
        keywords: null,
        auctioneer: '',
        privacy: 'private',
        auctionType: "webcast",
        sellingList: [],
        logo: null,
      },
      active1: false,
      active2: false,
    }
  },
  mounted() {
    let galleryId = Number(this.$route.query.galleryId);
    if (galleryId) {
      this.$store.dispatch("galleryStore/fetchMyGallery", galleryId).then((gallery) => {
        this.gallery = gallery;
      });
    }
    if (this.auctionId) {
      this.$store.dispatch("myAuctionStore/fetchMyAuction", this.auctionId).then((auction) => {
        this.auction = auction;
        this.startDate = moment(auction.startDate).format("LLLL");
        this.endDate = moment(auction.endDate).format("LLLL");
        this.loaded = true;
      });
    } else {
      // let daysTillStart = Math.floor(Math.random() * 14) + 7
      let dd = moment({}).add(2, "days");
      dd.hour(10);
      dd.minute(0);
      this.startDate = dd.format();
      this.endDate = dd.add(2, "days").format("LLLL");
      this.loaded = true;
    }
  },
  computed: {
    username() {
      let profile = this.$store.getters["myAccountStore/getMyProfile"];
      return profile.username;
    },
    mediaFiles() {
      let files = [];
      if (this.auction.logo) {
        files.push(this.auction.logo);
      }
      return files;
    },
    convertToMedia() {
      if (this.auction && this.auction.logo && this.auction.logo.dataUrl) {
        let stuff = [];
        return stuff.push(this.auction.logo);
      }
      return [];
    }
  },
  methods: {
    upload: function() {
      let profile = this.$store.getters["myAccountStore/getMyProfile"];
      this.auction.auctioneer = profile.username;
      this.auction.administrator = profile.username;
      this.auction.startDate = moment(this.startDate).valueOf();
      this.auction.endDate = moment(this.endDate).valueOf();
      if (!this.auction.auctionType) {
        this.auction.auctionType = "webcast";
      }
      if (!this.auction.messages) {
        this.auction.messages = [];
      }
      this.showModal = true;
      if (this.mode === "update") {
        this.auction.auctionId = this.auctionId;
        this.$store
          .dispatch("myAuctionStore/updateAuction", this.auction)
          .then(auction => {
            this.auction = auction;
            this.$router.push("/my-auctions/manage/" + auction.auctionId);
          });
      } else {
        this.auction.auctionId = moment({}).valueOf();
        this.$store
          .dispatch("myAuctionStore/uploadAuction", this.auction)
          .then(auction => {
            this.auction = auction;
            this.$router.push("/my-auctions/manage/" + auction.auctionId);
          });
      }
    },
    closeModal: function() {
      this.showModal = false;
    },
    setByEventLogo (data) {
      let mediaObjects = data.media;
      if (!mediaObjects || mediaObjects.length === 0) {
        this.auction.logo = null;
      } else {
        this.auction.logo = mediaObjects[0];
      }
    },
    checkForm(event) {
      if (event) {
        event.preventDefault();
        event.target.classList.add('was-validated');
      }
      this.parentalError = null;
      if (this.auction.auctionType === "sealed") {
        this.showSealedError = true;
      }
      this.errors = [];
      if (!this.auction.title) {
        this.errors.push("title required.");
      }
      if (this.auction.auctionType === "sealed") {
        if (!this.auction.sealedAddress) {
          this.errors.push("bitcoin address required for sealed bid auction.");
        }
      }
      if (moment(this.startDate).isBefore(moment({}))) {
        this.errors.push("Start date before now.");
      }
      if (!this.auction.logo) {
        this.parentalError = "Please attach an auction cover image to make this auction stand out.";
        this.errors.push(this.parentalError);
      }
      if (this.auction.auctionType === "event") {
        if (moment(this.endDate).isBefore(moment({}))) {
          this.errors.push("End date before now.");
        }
        if (moment(this.endDate).isBefore(this.startDate)) {
          this.errors.push("Ends before it starts.");
        }
      }
      if (!this.auction.description) {
        this.errors.push("description required.");
      }
      if (!this.auction.keywords) {
        this.errors.push("keywords required.");
      }
      if (this.errors.length > 0) {
        return false;
      } else {
        this.upload();
      }
    },
    toggleActiveState1() {
      this.active1 = true;
      this.active2 = false;
    },
    toggleActiveState2() {
      this.active1 = false;
      this.active2 = true;
    },
  }
};
</script>
