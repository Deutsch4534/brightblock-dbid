<template>
<div class="">
  <confirmation-modal :modal="modal" :title="modalTitle" :content="modalContent" @closeModal="closeModal"/>
  <div class="row my-5">
    <div class="col-12">
      <bitcoin-address :allowDelete="true" @bitcoinAddressUpdate="updateBitcoinAddress"/>
    </div>
  </div>
  <!--
  <div class="row my-5">
    <div class="col-12">
      <trusted-users :trustedIds="myProfile.auxiliaryProfile.trustedIds" @saveTrustedUsers="saveTrustedUsers"/>
    </div>
  </div>
  -->
</div>
</template>

<script>
import ConfirmationModal from "../utils/ConfirmationModal";
import moment from "moment";
import myAccountService from "@/services/myAccountService";
import TrustedUsers from "./TrustedUsers";
import BitcoinAddress from "./BitcoinAddress";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SellerInfo",
  components: {
    BitcoinAddress,
    TrustedUsers,
    ConfirmationModal,
  },
  props: {
  },
  data() {
    return {
      showNav: 0,
      fromPage: this.$route.query.from,
      modal: false,
      modalTitle: "Enter Bitcoin Address",
      modalContent: "<p>Bitcoin address required to complete seller information.</p>",
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
    if (this.fromPage === "upload-item") {
      this.showNav = 3;
      this.modal = true;
    } else {
      this.showNav = 1;
    }
  },
  computed: {
  },
  methods: {
    upload: function() {
      if (!this.myProfile.publicKeyData.bitcoinAddress) {
        this.modal = true;
      } else {
        this.$store.dispatch("myAccountStore/updateAuxiliaryProfile", this.myProfile.auxiliaryProfile)
          .then(auxiliaryProfile => {
            this.$emit("sellerInfoUpdated");
          })
          .catch(() => {
            this.modalTitle = "Seller Information";
            this.modalContent = "Error updating seller information.";
            this.modal = true;
          });
      }
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
      if (this.fromPage === "upload-item" && this.myProfile.publicKeyData.bitcoinAddress) {
        this.$router.push("/my-item/upload");
      }
    },
    updateBitcoinAddress(bitcoinAddress) {
      this.$store.dispatch("myAccountStore/updateBitcoinAddress", bitcoinAddress).then((prof) => {
        if (!bitcoinAddress) {
          this.$notify({type: 'success', title: 'Bitcoin Address', text: 'Address removed from profile.'});
        } else if (prof.username) {
          this.$notify({type: 'success', title: 'Bitcoin Address', text: 'Address successfully updated.'});
        } else {
          this.$notify({type: 'error', title: 'Bitcoin Address', text: 'An error occurred while attempting to update address.'});
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
