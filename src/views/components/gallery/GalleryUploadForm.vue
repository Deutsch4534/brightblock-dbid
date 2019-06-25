<template>
<mdb-container class="py-5">
  <div class="row">
    <div class="col-md-3 nowrap">
      <confirmation-modal :modal="modal" :title="modalTitle" :content="modalContent" @closeModal="closeModal"/>
      <mdb-navbar class="blue lighten-5">
        <mdb-navbar-nav nav vertical>
          <mdb-nav-item><h5>RA Gallery</h5></mdb-nav-item>
          <mdb-nav-item href="#" active><a @click.prevent="showNav = 1">Main Info</a></mdb-nav-item>
          <mdb-nav-item href="#"><a @click.prevent="showNav = 2">Email</a></mdb-nav-item>
          <mdb-nav-item href="#"><a @click.prevent="showNav = 3">Bitcoin</a></mdb-nav-item>
          <mdb-nav-item href="#"><a @click.prevent="showNav = 4">Address</a></mdb-nav-item>
          <mdb-nav-item href="#"><a @click.prevent="showNav = 5">Administrators</a></mdb-nav-item>
        </mdb-navbar-nav>
      </mdb-navbar>
    </div>
    <div class="col-md-9" v-if="showNav > 0">

      <h4 class="h4-responsive">{{formTitle}}</h4>
      <p v-if="message" v-html="message"></p>
      <gallery-details v-if="showNav === 1" :myGallery="gallery" @updateGalleryDetails="updateGalleryDetails"/>
      <email-address-entry v-if="showNav === 2" :emailAddress="gallery.emailAddress" @saveEmail="saveEmail"/>
      <bitcoin-address-entry v-if="showNav === 3" @bitcoinAddressUpdate="updateBitcoinAddress" :bitcoinAddress="gallery.bitcoinAddress"/>
      <address-form v-if="showNav === 4" :addressTitle="'Shipping Address'" :addressBlurb="addressBlurb" :address="gallery.shippingAddress" @saveAddress="saveAddress"/>
      <trusted-users-section v-if="showNav === 5" :trustedIds="gallery.trustedIds" @saveTrustedUsers="saveTrustedUsers"/>

    </div>
  </div>
</mdb-container>
</template>

<script>
import { mdbContainer } from "mdbvue";
import { mdbNavbar, mdbNavbarNav, mdbNavItem } from "mdbvue";
import ConfirmationModal from "../utils/ConfirmationModal";
import moment from "moment";
import myAccountService from "@/services/myAccountService";
import TrustedUsersSection from "../utils/TrustedUsersSection";
import BlockstackSection from "../utils/BlockstackSection";
import BitcoinAddressEntry from "../utils/BitcoinAddressEntry";
import EmailAddressEntry from "@/pages/components/user-settings/EmailAddressEntry";
import AddressForm from "@/pages/components/user-settings/AddressForm";
import GalleryDetails from "./GalleryDetails";
import _ from "lodash";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "GalleryUploadForm",
  components: {
    GalleryDetails,
    BitcoinAddressEntry,
    TrustedUsersSection,
    BlockstackSection,
    EmailAddressEntry,
    ConfirmationModal,
    AddressForm,
    mdbContainer,
    mdbNavbar,
    mdbNavbarNav,
    mdbNavItem
  },
  props: ["formTitle", "myProfile", "galleryId"],
  data() {
    return {
      showNav: 0,
      message: null,
      modal: false,
      modalTitle: "Gallery Info",
      modalContent: "<p>Gallery updated successfully.</p>",
      modalContent1: "<p>Gallery updated successfully: where to next?</p><ul class='m-3'>" +
        "<li class='mb-3'><a href='#/my-artwork/upload'>Upload Artwork</a></li>" +
        "<li><a href='#/gallery'>Gallery Floor</a></li></ul>",
      addressBlurb: "Your shipping address is encrypted and stored in your gaia bucket. It will only ever be decrypted in case where this is necessary - such as when you have bought some artwork and the seller needs your shipping information",
      gallery: {
        title: null,
        description: "Brighton based Gallery",
        owner: this.myProfile.username,
        bitcoinAddress: null,
        shippingAddress: {},
        emailAddress: null,
        keywords: "art,modern,old",
        privacy: 'public',
        galleryType: "webcast",
        coverImage: null,
      },
    };
  },
  mounted() {
    if (this.galleryId) {
      this.$store.dispatch("galleryStore/fetchMyGallery", this.galleryId).then((gallery) => {
        if (gallery) {
          this.gallery = gallery;
        }
        this.showNav = 1;
      })
    } else {
      this.showNav = 1;
    }
  },
  computed: {
  },
  methods: {
    upload: function(message) {
      let $self = this;
      this.$store.dispatch("galleryStore/uploadOrUpdateGallery", this.gallery)
        .then(galleryProfile => {
          $self.modalContent = message;
          $self.modal = true;
        })
        .catch(() => {
          $self.modalContent = "Error saving.";
          $self.modal = true;
        });
    },
    updateGalleryDetails: function(galleryDetails) {
      _.merge(this.gallery, galleryDetails);
      this.upload("Details saved.");
    },
    saveEmail: function(email) {
      this.gallery.emailAddress = email;
      this.upload("Email saved.");
    },
    saveAddress: function(address) {
      this.gallery.shippingAddress = address;
      this.upload("Shipping address saved");
    },
    saveTrustedUsers: function(trustedIds) {
      this.gallery.trustedIds = trustedIds;
      this.upload("Saved trusted users");
    },
    closeModal: function() {
      this.modal = false;
    },
    updateBitcoinAddress(bitcoinAddress) {
      this.gallery.bitcoinAddress = bitcoinAddress;
      this.upload("Saved bitcoin address: " + bitcoinAddress);
    }
  }
};
</script>
<style>

</style>
<style scoped>
 #profileForm .form-control,
 #profileForm >>> .form-control,
 #profileForm input,
 #profileForm textarea,
 #profileForm label {
   background-color: transparent;
   color: rgba(0, 0, 0, 0.6);
   font-weight: 300;
   font-size: 0.85rem;
  }

#profileForm input::-webkit-input-placeholder,
#profileForm input::-moz-placeholder,
#profileForm input:-ms-input-placeholder,
#profileForm input:-moz-placeholder {
  color: rgba(0, 0, 0, 0.6);
  font-weight: 300;
  font-size: 0.85rem;
 }

 #profileForm .form-row {
   margin-bottom: 1rem;
 }

 /* Drag and drop boxes */

 .load-profile {
   display: flex;
   height: 150px;
   text-align: center;
   padding: 20px;
   font-size: 1em;
   background-color: white;
   border-radius: 10px;
 }
.drop-area {
 width: 100%;
 border: 1px dashed rgba(0, 0, 0, 0.24);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.drop-label {
  color: rgba(0, 0, 0, 0.2);
  font-size: 0.9rem;
  margin-bottom: 0;
}
</style>
