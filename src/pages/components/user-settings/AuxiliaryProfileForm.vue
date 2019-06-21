<template>
<mdb-container class="">
  <div class="row">
    <div class="col-md-3 nowrap">
      <confirmation-modal :modal="modal" :title="modalTitle" :content="modalContent" @closeModal="closeModal"/>
      <mdb-navbar class="blue lighten-5 py-4">
        <mdb-navbar-nav nav vertical>
          <mdb-nav-item><h5>Settings</h5></mdb-nav-item>
          <mdb-nav-item href="#" active><a @click.prevent="showNav = 1">Blockstack Profile</a></mdb-nav-item>
          <mdb-nav-item href="#"><a @click.prevent="showNav = 2">Email Address</a></mdb-nav-item>
          <mdb-nav-item href="#"><a @click.prevent="showNav = 3">Bitcoin Info</a></mdb-nav-item>
          <mdb-nav-item href="#"><a @click.prevent="showNav = 4">Shipping Details</a></mdb-nav-item>
          <mdb-nav-item href="#"><a @click.prevent="showNav = 5">Trusted Users</a></mdb-nav-item>
        </mdb-navbar-nav>
      </mdb-navbar>
    </div>
    <div class="col-md-9 py-4" v-if="showNav > 0">

      <h4 class="h4-responsive">{{myProfile.name}}</h4>
      <p class="text-muted small">Note: Your profile data is encrypted and stored in your storage - it is only ever
      decrypted to display to another user to complete a transaction.</p>

      <blockstack-section v-if="showNav === 1" :myProfile="myProfile"/>
      <email-address-entry v-if="showNav === 2" :emailAddress="myProfile.auxiliaryProfile.emailAddress" @saveEmail="saveEmail"/>
      <bitcoin-address-entry v-if="showNav === 3" :allowDelete="true" @bitcoinAddressUpdate="updateBitcoinAddress"/>
      <address-form v-if="showNav === 4" :addressTitle="'Shipping Address'" :addressBlurb="addressBlurb" :address="myProfile.auxiliaryProfile.shippingAddress" @saveAddress="saveAddress"/>
      <trusted-users-section v-if="showNav === 5" :trustedIds="myProfile.auxiliaryProfile.trustedIds" @saveTrustedUsers="saveTrustedUsers"/>

    </div>
  </div>
</mdb-container>
</template>

<script>
import { mdbIcon, mdbPopover, mdbCol, mdbRow, mdbContainer, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import { mdbNavbar, mdbNavbarNav, mdbNavItem } from "mdbvue";
import ConfirmationModal from "../utils/ConfirmationModal";
import moment from "moment";
import myAccountService from "@/services/myAccountService";
import TrustedUsers from "../user-settings/TrustedUsers";
import BlockstackSection from "../utils/BlockstackSection";
import BitcoinAddress from "./BitcoinAddress";
import EmailAddressEntry from "../utils/EmailAddressEntry";
import AddressForm from "@/pages/components/user-settings/AddressForm";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "AuxiliaryProfileForm",
  components: {
    BitcoinAddress,
    TrustedUsers,
    BlockstackSection,
    EmailAddressEntry,
    ConfirmationModal,
    AddressForm,
    mdbContainer,
    mdbIcon,
    mdbPopover,
    mdbCol,
    mdbRow,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn,
    mdbNavbar,
    mdbNavbarNav,
    mdbNavItem
  },
  props: {
  },
  data() {
    return {
      showNav: 0,
      fromPage: this.$route.query.from,
      modal: false,
      modalTitle: "Profile updated",
      modalContent: "<p>Profile updated successfully.</p>",
      modalTitleUpdateArtwork: "Enter Bitcoin Address",
      modalContentUpdateArtwork: "<p>Before you can upload artwork please provide a bitcoin address.</p>",
      modalTitleUpdateArtworkConfirm: "Bitcoin Address Saved",
      modalContentUpdateArtworkConfirm: "<p>Thanks - carry on uploading artwork.</p>",
      modalContent1: "<p>Profile updated successfully: where to next?</p><ul class='m-3'>" +
        "<li class='mb-3'><a href='#/my-artwork/upload'>Upload Artwork</a></li>" +
        "<li><a href='#/gallery'>Gallery</a></li></ul>",
      addressBlurb: "Your shipping address is encrypted and stored in your gaia bucket. It will only ever be decrypted in case where this is necessary - such as when you have bought some artwork and the seller needs your shipping information",
      myProfile: {
        publicKeyData: {},
        auxiliaryProfile: {
          shippingAddress: {}
        }
      }
    };
  },
  mounted() {
    this.myProfile = this.$store.getters["myAccountStore/getMyProfile"];
    if (!this.myProfile.auxiliaryProfile) {
      this.myProfile.auxiliaryProfile = {};
      this.myProfile.auxiliaryProfile.shippingAddress = {};
    }
    if (!this.myProfile.auxiliaryProfile.shippingAddress) {
      this.myProfile.auxiliaryProfile.shippingAddress = {};
    }
    if (this.fromPage === "upload-artwork") {
      this.showNav = 3;
      this.modalTitle = this.modalTitleUpdateArtwork;
      this.modalContent = this.modalContentUpdateArtwork;
      this.modal = true;
    } else {
      this.showNav = 1;
    }
    /**
    this.$store.dispatch("myAccountStore/fetchMyAccount").then((profile) => {
      if (!profile.auxiliaryProfile) {
        profile.auxiliaryProfile = {};
        profile.auxiliaryProfile.shippingAddress = {};
      }
      if (!profile.auxiliaryProfile.shippingAddress) {
        profile.auxiliaryProfile.shippingAddress = {};
      }
      this.myProfile = profile;
    });
    **/
  },
  computed: {
  },
  methods: {
    upload: function() {
      let $self = this;
      this.$store.dispatch("myAccountStore/updateAuxiliaryProfile", this.myProfile.auxiliaryProfile)
        .then(auxiliaryProfile => {
          $self.modal = true;
        })
        .catch(() => {
          $self.modalTitle = "Profile.";
          $self.modalContent = "Error updating profile.";
          $self.modal = true;
        });
    },
    saveEmail: function(email) {
      this.myProfile.auxiliaryProfile.emailAddress = email;
      this.upload();
    },
    saveAddress: function(address) {
      if (!address) {
        address = {};
      }
      this.myProfile.auxiliaryProfile.shippingAddress = address;
      this.upload();
    },
    saveTrustedUsers: function(trustedIds) {
      this.myProfile.auxiliaryProfile.trustedIds = trustedIds;
      this.upload();
    },
    closeModal: function() {
      this.modal = false;
      if (this.fromPage === "upload-artwork" && this.myProfile.publicKeyData.bitcoinAddress) {
        this.$router.push("/my-artwork/upload");
      }
    },
    updateBitcoinAddress(bitcoinAddress) {
      this.$store.dispatch("myAccountStore/updateBitcoinAddress", bitcoinAddress).then(() => {
        if (this.fromPage === "upload-artwork") {
          this.modalTitle = this.modalTitleUpdateArtworkConfirm;
          this.modalContent = this.modalContentUpdateArtworkConfirm;
          this.modal = true;
        }
      });
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
