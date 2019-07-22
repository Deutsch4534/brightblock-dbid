<template>
  <mdb-container class="py-3 py-md-4">
    <!-- Supported elements -->
    <confirmation-modal :modal="showModal" :title="modalTitle" :content="modalContent" @closeModal="closeModal"/>
    <keywords-view :modal="showKeywords" :title="'Choose or Enter Tags'" @closeKeywords="closeKeywords"/>
    <h1 class="h1-responsive">{{formTitle}}</h1>
    <form class="needs-validation py-5 form-transparent" novalidate @submit.prevent="checkForm" id="artworkForm">
      <!-- item type -->
      <div class="row">
      <div class="col-md-6 mb-4">
        <!--
        <div class="row ml-1 mb-4">
          <div class="col-12">
            <div class="row">
              <div class="col-6 custom-control custom-radio mb-0">
                <input type="radio" class="custom-control-input teal lighten-1" id="customControlValidation2" name="artwork.itemType" v-model="artwork.itemType" value="digiart" required>
                <label class="custom-control-label" for="customControlValidation2">Digital Artwork</label>
              </div>
              <div class="col-6 custom-control custom-radio mb-0">
                <input type="radio" class="custom-control-input teal lighten-1" id="customControlValidation3" name="artwork.itemType" v-model="artwork.itemType" value="physart" required>
                <label class="custom-control-label" for="customControlValidation3">Physical Artwork</label>
              </div>
            </div>
          </div>
        </div>
        -->
        <div class="form-row">
            <input type="text" class="form-control" id="validationCustom01" :placeholder="'Artwork Title (' + limits.title + ' chars max)'" v-model="artwork.title" required :maxlength="limits.title">
            <div class="invalid-feedback">
              Please enter a title!
            </div>
        </div>
        <div class="form-row">
            <!--<label for="validationCustom02">Description of Artwork</label>-->
            <textarea type="text" class="form-control" id="validationCustom02" :placeholder="'Description of the Artwork (' + limits.description + ' chars max)'" v-model="artwork.description" required :maxlength="limits.description"></textarea>
            <div class="invalid-feedback">
              Please enter a description!
            </div>
        </div>
        <div class="form-row">
          <div class="col-12">
            <a @click.prevent="openKeywords"><u>Set Tags</u></a>&nbsp;&nbsp;&nbsp;
            <span v-for="keyword in getKeywordList" :key="keyword"><mdb-btn :disabled="true" rounded color="white" size="sm" class="mx-0 waves-light">{{keyword}}</mdb-btn></span>
          </div>
        </div>
        <div class="form-row">
          <div class="col-6 form-row">
            <div class="col-4">
              <label for="validationCustom040" class="col-form-label">Edition</label>
            </div>
            <div class="col-8">
              <input class="form-control" id="validationCustom040" type="number" v-model="artwork.edition" required :maxlength="limits.maxEditions">
              <div id="vc-040-error" class="invalid-feedback">
                Please enter number of editions!
            </div>
            </div>
          </div>
          <div class="col-6 form-row">
            <div class="col-4 col-form-label text-center">
              <label for="validationCustom041">of</label>
            </div>
           <div class="col-8">
            <input class="form-control" id="validationCustom041" type="number" v-model="artwork.editions" required :maxlength="limits.maxEditions">
            <div id="vc-041-error" class="invalid-feedback">
              Please enter total number of editions!
            </div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="col-4 mb-5" v-if="!mediumLocked">
            <select id="validationCustom06-1" @change="doMedium" class="text-black browser-default custom-select" v-model="medium" required>
              <option value="" :disabled="true">Medium</option>
              <option v-for="(medium) in media" :key="medium.value" :value="medium.value">{{medium.label}}</option>
            </select>
            <div class="invalid-feedback">
              Please enter the artwork medium!
            </div>
          </div>
          <div class="col-4 mb-5" v-else>
            Digital Video
          </div>
          <div class="col-4">
            <input type="text" class="form-control" id="validationCustom05-1" placeholder="Dimensions" v-model="artwork.dimensions">
            <div class="invalid-feedback">
              Please enter the Dimensions!
            </div>
          </div>
          <div class="col-4">
            <input type="text" class="form-control" id="validationCustom05-2" placeholder="Year created" v-model="artwork.yearCreated" required>
            <div class="invalid-feedback">
              Please enter the year created!
            </div>
          </div>
        </div>
        <div class="form-row" v-if="galleries">
          <select class="browser-default custom-select" v-model="galleryId" id="galleryId" name="galleryId">
            <option value="null">Gallery Listing</option>
            <option v-for="(gallery, index) in galleries" :key="index" :value="gallery.galleryId">{{ gallery.title }}</option>
          </select>
          <div class="col-md-12 text-right" v-if="artwork.galleryId"><small><a @click.prevent="removeGallery"><u>remove</u></a></small></div>
        </div>
        <div class="form-row">
          <div class="col-6">
            <input type="text" class="form-control" id="validationCustom05" placeholder="Owner" v-model="artwork.owner" required>
            <div class="invalid-feedback">
              Please enter the blockstack id of the owner!
            </div>
          </div>
          <div class="col-6">
            <input type="text" class="form-control" id="validationCustom06" placeholder="Artist" v-model="artwork.artist" required>
            <div class="invalid-feedback">
              Please enter the blockstack id of the artist!
            </div>
          </div>
        </div>
        <!-- Submit button row -->
        <div class="row">
          <div class="col-12 mt-3">
            <mdb-btn type="submit" size="sm" class="btn-block teal lighten-1">Submit Changes</mdb-btn>
          </div>
        </div>
      </div>

        <!-- Right column - image drop -->
        <div class="form-row col-md-6" v-if="showMedia">
          <media-files-upload :contentModel="contentModel1" :parentalError="parentalError" :mediaFiles="mediaFiles1" :limit="1" :sizeLimit="10000" :mediaTypes="'image,video'" @updateMedia="setByEventLogo1($event)"/>
          <media-files-upload :contentModel="contentModel2" :mediaFiles="mediaFiles2" :limit="5" :sizeLimit="2500" :mediaTypes="'image,doc'" @updateMedia="setByEventLogo2($event)"/>
          <media-files-upload :contentModel="contentModel3" :mediaFiles="mediaFiles3" :limit="5" :sizeLimit="2500" :mediaTypes="'image'" @updateMedia="setByEventLogo3($event)"/>
        </div>
      </div>
    </form>
  </mdb-container>
</template>
<!--
<div class="form-row col-md-6" v-if="showMedia">
  <media-files-upload :contentModel="contentModel" :mediaFiles="mediaFiles" :limit="1" :sizeLimit="500" :mediaTypes="'image'" @updateMedia="setByEventLogo($event)"/>
</div>
-->
<script>
import MediaFilesUpload from "../utils/MediaFilesUpload";
import { mdbIcon, mdbPopover, mdbCol, mdbRow, mdbContainer, mdbBtn } from "mdbvue";
import moment from "moment";
import notify from "@/notify";
import ConfirmationModal from "../utils/ConfirmationModal";
import KeywordsView from "@/views/components/utils/KeywordsView";

  // noinspection JSUnusedGlobalSymbols
  export default {
    name: "MyArtworkUploadForm",
    components: {
      ConfirmationModal,
      KeywordsView,
      MediaFilesUpload,
      mdbContainer,
      mdbIcon,
      mdbPopover,
      mdbCol,
      mdbRow,
      mdbBtn
    },
    props: ["artworkId", "mode", "formTitle"],
    data() {
      return {
        errors: [],
        showMedia: false,
        galleries: null,
        galleryId: null,
        showModal: false,
        showKeywords: false,
        modalTitle: "Saving Artwork",
        modalContent: "<p>Please wait while we update your data.</p>",
        media: this.$store.state.constants.taxonomy.media,
        medium: "",
        mediumLocked: false,
        limits: {
          title: 50,
          description: 1000,
          maxEditions: 10,
          keywords: 100
        },
        contentModel1: {
          title: "Artwork Image",
          errorMessage: "Artwork image is required.",
          popoverBody: "Your original digital image or a high res image of your artwork.<br/><br/>A single hi-res image up to 2M.",
        },
        contentModel2: {
          title: "Provenance Files",
          errorMessage: "",
          popoverBody: "E.g. bills of sale, reciepts, images of signatures, short video clips of the artists at work etc.<br/><br/>Up to 5 images / documents.",
        },
        contentModel3: {
          title: "Gallery Images",
          errorMessage: "",
          popoverBody: "Images for potential buyers to see your artwork from different angles.<br/><br/>Up to 5 (100kb or less) images.",
        },
        parentalError: null,
        showAttachDocs: false,
        showAlert: false,
        alertMessage: null,
        dateError: false,
        created: null,
        artwork: {
          artistry: {},
          itemType: "digiart",
          keywords: "",
          artist: null,
          owner: null,
          editions: 1,
          edition: 1,
          created: null,
          images: [],
          supportingDocuments: [],
          artwork: [],
          medium: "image",
          btcAddress: null
        },
      };
    },
    mounted() {
      this.$store.dispatch("galleryStore/fetchMyGalleries").then((galleries) => {
        this.galleries = galleries;
        if (this.artworkId) {
          this.$store.dispatch("myArtworksStore/fetchMyArtwork", this.artworkId).then((artwork) => {
            this.artwork = artwork;
            this.medium = artwork.medium;
            if (this.artwork) {
              this.created = moment(this.artwork.created).format("LLLL");
              if (artwork.galleryId) {
                this.galleryId = artwork.galleryId;
              }
              if (!this.artwork.medium) {
                this.artwork.medium = "painting";
              }
            }
            this.showMedia = true;
          })
        } else {
          this.artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](this.artworkId);
          this.showMedia = true;
        }
      });
    },
    computed: {
      mediaFiles1() {
        let files = [];
        if (this.artwork.artwork && this.artwork.artwork.length  > 0) {
          files = this.artwork.artwork;
        }
        return files;
      },
      getKeywordList() {
        if (this.artwork && this.artwork.keywords) {
          return this.artwork.keywords.split(',');
        }
        return [];
      },
      mediaFiles2() {
        let files = [];
        if (this.artwork.supportingDocuments && this.artwork.supportingDocuments.length  > 0) {
          files = this.artwork.supportingDocuments;
        }
        return files;
      },
      mediaFiles3() {
        let files = [];
        if (this.artwork.images && this.artwork.images.length  > 0) {
          files = this.artwork.images;
        }
        return files;
      }
    },
    methods: {
      setByEventLogo1 (data) {
        let mediaObjects = data.media;
        if (mediaObjects && mediaObjects.length > 0 && mediaObjects[0].type.indexOf("video") > -1) {
          this.medium = "video";
          this.artwork.medium = "video";
          this.mediumLocked = true;
          this.artwork.artwork = new Array(data.coverImage);
          this.artwork.artwork.push(mediaObjects[0]);
        } else {
          this.mediumLocked = false;
          this.artwork.artwork = mediaObjects;
        }
      },
      doMedium () {
        this.artwork.medium = this.medium;
      },
      closeModal: function() {
        this.showModal = false;
      },
      closeKeywords: function(chosen) {
        this.showKeywords = false;
        this.artwork.keywords = chosen.join(",");
      },
      openKeywords: function() {
        this.showKeywords = true;
      },
      info() {
        this.$notify({type: 'success', title: 'Notification 2!', text: 'Hi! I am info message.'});
      },
      removeGallery() {
        this.galleryId = null;
        this.artwork.galleryId = null;
        this.artwork.gallerist = null;
        this.$notify({type: 'info', title: 'Gallery Removed', text: 'Artwork changed back to simple listing - press save!'});
      },
      setByEventLogo2 (data) {
        this.artwork.supportingDocuments = data.media;
      },
      setByEventLogo3 (mediaObjects) {
        this.artwork.images = data.media;
      },
      upload: function () {
        this.showModal = true;
        if (!this.artwork.status) {
          this.artwork.status = this.$store.state.constants.statuses.artwork.NOT_REGISTERED;
        }
        this.alertMessage =
          "Please wait while we upload your artwork to your storage..";
        this.showAlert = true;
        if (this.galleryId) {
          let gallery = this.$store.getters["galleryStore/getMyGallery"](this.galleryId);
          this.artwork.gallerist = gallery.owner;
          this.artwork.galleryId = gallery.galleryId;
        }
        if (this.mode === "update") {
          this.$store
            .dispatch("myArtworksStore/updateArtwork", {artwork: this.artwork, updateProvData: true})
            .then(artwork => {
              if (artwork) {
                this.artwork = artwork;
                this.showAlert = false;
                this.showModal = false;
                this.$router.push("/my-artworks/" + artwork.id);
              } else {
                this.modalContent = "File has not been updated.";
              }
          });
        } else {
          this.$store
            .dispatch("myArtworksStore/uploadArtwork", this.artwork)
            .then(artwork => {
              if (artwork) {
                this.artwork = artwork;
                this.showAlert = false;
                this.showModal = false;
                this.$router.push("/my-artworks/" + artwork.id);
              } else {
                this.modalContent = "File has not been uploaded.";
              }
            });
        }
      },
      checkForm(event) {
        if (event) {
          event.preventDefault();
          event.target.classList.add('was-validated');
        }
        this.parentalError = null;
        this.showAttachDocs = false;
        document.getElementById("vc-040-error").style.display = "none";
        document.getElementById("vc-041-error").style.display = "none";
        this.errors = [];
        if (!this.artwork.title) {
          this.errors.push("title required.");
        }
        if (!this.artwork.description) {
          this.errors.push("description required.");
        }
        if (!this.artwork.itemType) {
          this.errors.push("item type required.");
        }
        if (!this.artwork.keywords) {
          this.errors.push("keywords required.");
        }
        if (this.artwork.edition < 1 || this.artwork.edition > this.limits.maxEditions) {
          this.errors.push("Edition between 1 and " + this.limits.maxEditions);
          document.getElementById("vc-040-error").style.display = "block";
          document.getElementById("vc-040-error").innerHTML = "Editions between 1 and " + this.limits.maxEditions;
        }
        if (this.artwork.editions < 1 || this.artwork.editions > this.limits.maxEditions) {
          this.errors.push("Editions between 1 and " + this.limits.maxEditions);
          document.getElementById("vc-041-error").style.display = "block";
          document.getElementById("vc-041-error").innerHTML = "Editions between 1 and " + this.limits.maxEditions;
        }
        if (!this.artwork.yearCreated) {
          this.errors.push("Year created needed.");
        }
        if (!this.artwork.dimensions) {
          // this.errors.push("dimensions needed.");
        }
        if (!this.artwork.artist || this.artwork.artist.indexOf(".id") === -1) {
          this.errors.push("Blockstack id of the artist is missing.");
        }
        if (!this.artwork.owner || this.artwork.owner.indexOf(".id") === -1) {
          this.errors.push("Blockstack id of the owner is missing.");
        }
        if (!this.artwork.medium) {
          this.errors.push("Medium is missing.");
        }
        let artMedium = this.artwork.medium;
        let index = _.findIndex(this.media, function(o) {
          return o.value === artMedium;
        });
        if (index < 0) {
          this.errors.push("Medium is incorrect.");
        }
        if (this.created) {
          this.artwork.created = moment(this.created).valueOf();
        }
        this.dateError = false;
        // if (moment(this.created).isAfter(moment({}))) {
        //  this.dateError = true;
        //  this.errors.push("Created date is after now?");
        // }
        if (this.artwork.artwork && this.artwork.artwork.length === 0) {
          this.parentalError = "Please attach your digital artwork or an image of your physical artwork.";
          this.errors.push(this.parentalError);
        }
        if (
          this.artwork.itemType === "physart" &&
          this.artwork.supportingDocuments &&
          this.artwork.supportingDocuments.length === 0
        ) {
          this.showAttachDocs = true;
          this.errors.push("Please attach an artwork.");
        }
        if (this.errors.length > 0) {
          return false;
        } else {
          this.upload();
        }
      },
    }
  };
</script>

<style scoped>
  #artworkForm .form-row {
    margin-bottom: 1rem;
  }
</style>
