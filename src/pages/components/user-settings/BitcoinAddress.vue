<template>
<div>
  <help-topic-modal class="text-left" :modal="helpModal" :topic="'bitcoin-address'" @closeModal="helpModalClose"/>

  <div class="d-flex justify-content-between mb-5">
    <h4 class="text-capitalize"><a href="/" @click.prevent="helpModal = !helpModal">Bitcoin Address</a></h4>
    <div class="text-muted text-primary text-nowrap">
      <a class="ml-5 " @click.prevent="toggleAddressInput"><i class="fas fa-pencil-alt"></i></a>
      <a class="ml-3 " @click.prevent="removeAddress" v-if="allowDelete && btcaddr"><i class="far fa-trash-alt"></i></a>
      <a class="ml-3 " href="/" @click.prevent="helpModal = !helpModal"><i class="far fa-question-circle"></i></a>
    </div>
  </div>
  <div class="col-md-12">
    <p class="text-muted">Public bitcoin address is needed to send you payments for goods!</p>
    <p>Currently using bitcoin <span class="text-primary">{{bitcoinState.chain}}</span> network</p>
  </div>

  <div class="d-flex justify-content-center mb-4" v-if="canMakeBitcoinPaymentNetwork">
    <div class="text-primary">
      <a @click.prevent="setPaymentNetwork"><u>Make bitcoin your default payment network.</u></a>
    </div>
  </div>

  <div class="d-flex flex-column align-items-left">
    <div class="text-danger" v-if="message">
      <p>{{message}}</p>
    </div>
    <div class="mb-4" v-if="changeBtcAddress || removedAddress">
      <input type="text" class="form-control" required id="vc-bitcoin-address" placeholder="Your bitcoin address" v-on:keyup.13="saveBitcoinAddress($event)" v-model="bitcoinAddress">
    </div>
    <div class="mb-3">
      <canvas id="qrcode"></canvas>
    </div>
    <div class="d-flex flex-column align-items-left mb-4" style="" v-if="btcaddr && !removedAddress">
      {{btcaddr.substring(0,15)}}...
    </div>
  </div>
</div>
</template>

<script>
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import QRCode from "qrcode";
import HelpTopicModal from "../utils/HelpTopicModal";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "BitcoinAddress",
  components: {
    HelpTopicModal,
  },
  data() {
    return {
      helpModal: false,
      allowDelete: false,
      showHint: false,
      changeBtcAddress: false,
      message: null,
      removedAddress: false,
      bitcoinState: {},
      bitcoinAddress: null,
    };
  },
  mounted() {
    let blockstackProfile = this.$store.getters["myAccountStore/getMyProfile"];
    let btcaddr = blockstackProfile.publicKeyData.rxAddressList[0].address;
    if (btcaddr) {
      let $self = this;
      setTimeout(function() {
        $self.checkBitcoinAddress(btcaddr);
      }, 1000);
    } else {
      this.changeBtcAddress = true;
    }
    this.bitcoinState = this.$store.getters["assetStore/getBitcoinConfig"];
  },
  computed: {
    myProfile() {
      let blockstackProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return blockstackProfile;
    },
    canMakeBitcoinPaymentNetwork: function() {
      let currentNetwork = this.$store.getters["myAccountStore/getPaymentNetwork"];
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      let currentAddress = myProfile.publicKeyData.rxAddressList[0].address;
      return currentNetwork !== "bitcoin" && currentAddress && currentAddress.length > 15;
    },
    btcaddr() {
      let blockstackProfile = this.$store.getters["myAccountStore/getMyProfile"];
      let btcaddr = blockstackProfile.publicKeyData.rxAddressList[0].address;
      return btcaddr;
    },
  },

  methods: {
    saveBitcoinAddress: function(event) {
      if (event) event.preventDefault();
      this.checkBitcoinAddress(this.bitcoinAddress, true)
    },
    setPaymentNetwork: function() {
      this.$emit("paymentNetworkUpdate", "bitcoin");
    },
    helpModalClose: function() {
      this.helpModal = false;
    },
    toggleAddressInput: function() {
      this.changeBtcAddress = !this.changeBtcAddress;
    },
    removeAddress: function() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      myProfile.publicKeyData.rxAddressList[0].address = undefined;
      this.changeBtcAddress = false;
      document.getElementById("qrcode").style.display = "none";
      this.$store.commit("myAccountStore/myProfile", myProfile);
      this.removedAddress = true;
      this.updateBitcoinAddress(null);
    },
    checkBitcoinAddress(bitcoinAddress, emit) {
      this.$store.dispatch("bitcoinStore/checkAddress", bitcoinAddress).then((result) => {
        if (result) {
          this.removedAddress = false;
          this.addQrCode(bitcoinAddress);
          this.message = null;
          if (emit) {
            this.updateBitcoinAddress(bitcoinAddress);
          }
        } else {
          this.message = "Invalid address - is it the right key for the current bitcoin network?";
        }
      });
    },
    updateBitcoinAddress(bitcoinAddress) {
      this.$store.dispatch("myAccountStore/updateBitcoinAddress", bitcoinAddress).then((prof) => {
        if (bitcoinAddress) {
          this.addQrCode(bitcoinAddress);
        }
        if (!bitcoinAddress) {
          this.$notify({type: 'success', title: 'Bitcoin Address', text: 'Address removed from profile.'});
        } else if (prof.username) {
          this.$notify({type: 'success', title: 'Bitcoin Address', text: 'Address successfully updated.'});
        } else {
          this.$notify({type: 'error', title: 'Bitcoin Address', text: 'An error occurred while attempting to update address.'});
        }
      });
    },
    addQrCode(bitcoinAddress) {
      let $qrCode = document.getElementById("qrcode");
      if (bitcoinAddress && $qrCode) {
        $qrCode.style.display = "block";
        this.changeBtcAddress = false;
        QRCode.toCanvas(
          $qrCode, bitcoinAddress, { errorCorrectionLevel: "H" },
          function(error) {
            if (error) {
              console.error(error);
            } else {
              console.log("success!");
            }
          }
        );
      } else {
        // $qrCode.style.display = "none";
      }
    },
  }
};
</script>
<style scoped>
.tab-content {
  padding-top: 0px;
}
</style>
