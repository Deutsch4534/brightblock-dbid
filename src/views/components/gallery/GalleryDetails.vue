<template>
<mdb-container class="mb-5">
  <!-- Supported elements -->

  <form class="needs-validation form-transparent" novalidate @submit.prevent="checkForm" id="uploadForm">
    <!-- Input fields section -->
    <div class="row">
      <!-- Left column -->
      <div class="col-md-6">
        <h3 class="h3-responsive">{{formTitle}}</h3>

        <!-- Errors row
        <div class="row mb-3" :key="errors.length">
          <mdb-alert color="danger" v-if="errors.length" :key="errors.length" class="w-100">
            <h4 class="alert-heading h6">Please correct the following error(s):</h4>
            <hr>
            <ul class="list-unstyled small mb-0">
              <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
            </ul>
          </mdb-alert>
        </div>
        -->
        <div class="form-row">
          <input type="text" class="form-control" id="validationCustom01" placeholder="Name of your gallery" v-model="gallery.title" required>
          <div class="invalid-feedback">
            Whats the name of your gallery?
          </div>
        </div>

        <div class="form-row">
          <textarea type="text" class="form-control" id="description" placeholder="Gallery bio" v-model="gallery.description" required></textarea>
          <div class="invalid-feedback">
            Where are you based and what kind of art do you specialise in?
          </div>
        </div>

        <div class="form-row">
          <textarea type="text" class="form-control" id="keywords" placeholder="Main art interests" v-model="gallery.keywords" required></textarea>
          <!--<p class="muted small mt-1">Enter keywords / tags separated by commas</p>-->
          <div class="invalid-feedback">
            Some keywords to help users find you in a search?
          </div>
        </div>

        <!-- Public / private buttons row -->
        <mdb-btn-group class="form-row d-flex">
          <div class="col-6">
            <mdb-btn type="button" color="white" size="sm" class="btn-rounded btn-block" id="custom-public"
                     value="public" v-model="gallery.privacy" @click.native="gallery.privacy = 'public'" :active="gallery.privacy === 'public'" required>
              Public
            </mdb-btn>
          </div>
          <div class="col-6">
            <mdb-btn type="button" color="white" size="sm" class="btn-rounded btn-block" id="custom-private"
                     value="private" v-model="gallery.privacy" @click.native="gallery.privacy = 'private'" :active="gallery.privacy === 'private'" required>
              Private
            </mdb-btn>
          </div>
        </mdb-btn-group>
        <div class="row">
          <div class="col-md-12">
            <mdb-btn size="sm" type="submit" class="btn-block teal lighten-1">save</mdb-btn>
          </div>
        </div>
      </div>

      <!-- Right column -->
      <div class="form-row col-md-6" v-if="showMedia">
        <media-files-upload :contentModel="contentModel" :parentalError="parentalError" :mediaFiles="mediaFiles" :limit="1" :sizeLimit="500" :mediaTypes="'image'" @updateMedia="setByEventLogo($event)"/>
      </div>
    </div>
    <!-- /Input fields section -->

  </form>
</mdb-container>
</template>

<script>
import moment from "moment";
import { mdbBtn, mdbBtnGroup, mdbContainer, mdbRow, mdbCol, mdbAlert } from 'mdbvue';
import { Datetime } from 'vue-datetime'
import MediaFilesUpload from "../utils/MediaFilesUpload";
import BitcoinAddressEntry from "../utils/BitcoinAddressEntry";
import EmailAddressEntry from "@/pages/components/user-settings/EmailAddressEntry";
import AddressForm from "@/pages/components/user-settings/AddressForm";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "GalleryDetails",
  props: ["formTitle", "mode", "myGallery"],
  components: {
    BitcoinAddressEntry,
    EmailAddressEntry,
    AddressForm,
    mdbContainer,
    mdbBtn,
    mdbBtnGroup,
    mdbRow,
    mdbCol,
    mdbAlert,
    datetime: Datetime,
    MediaFilesUpload
  },
  data () {
    return {
      errors: [],
      showAddresses: false,
      parentalError: null,
      showMedia: false,
      myProfile: null,
      contentModel: {
        title: "Profile Image",
        errorMessage: "Profile image is required.",
        popoverBody: "Promote your galleries brand by uploading a profile image.<br/><br/>A single square(ish) image up to 500Kb.",
      },
      gallery: {
        title: null,
        description: null,
        keywords: null,
        privacy: 'public',
        galleryType: "na",
        coverImage: null,
      },
    }
  },
  mounted() {
    this.gallery = this.myGallery;
    this.showMedia = true;
  },
  computed: {
    username() {
      let profile = this.$store.getters["myAccountStore/getMyProfile"];
      return profile.username;
    },
    mediaFiles() {
      let files = [];
      if (this.gallery.coverImage) {
        files.push(this.gallery.coverImage);
      }
      return files;
    },
    convertToMedia() {
      if (this.gallery && this.gallery.coverImage && this.gallery.coverImage.dataUrl) {
        let stuff = [];
        return stuff.push(this.gallery.coverImage);
      }
      return [];
    }
  },
  methods: {
    upload: function() {
      this.$emit('updateGalleryDetails', this.gallery);
    },
    setByEventLogo (data) {
      this.gallery.coverImage = data.media[0];
    },
    checkForm(event) {
      if (event) {
        event.preventDefault();
        event.target.classList.add('was-validated');
      }
      this.parentalError = null;
      this.errors = [];
      if (!this.gallery.title) {
        this.errors.push("Whats the name of your gallery?");
      }
      if (!this.gallery.description) {
        this.errors.push("Where are you based and what kind of art do you specialise in?");
      }
      if (!this.gallery.coverImage) {
        this.parentalError = "Please attach a cover image to make this gallery stand out.";
        this.errors.push(this.parentalError);
      }
      if (!this.gallery.keywords) {
        this.errors.push("Keywords to help users find you in a search.");
      }
      if (this.errors.length > 0) {
        return false;
      } else {
        this.upload();
      }
    }
  }
};
</script>
<style scoped>
  #uploadForm .form-row {
    margin-bottom: 1rem;
  }
</style>
