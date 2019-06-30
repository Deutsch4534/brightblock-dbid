<template>
<div>
  <help-topic-modal :modal="helpModal" :topic="'stacks-address'" @closeModal="helpModalClose"/>

  <div class="d-flex justify-content-between mb-5">
    <h4 class="text-capitalize"><a href="/" @click.prevent="helpModal = !helpModal">Stacks Address</a></h4>
    <div class="text-muted text-primary text-nowrap">
      <a class="ml-5" @click.prevent="toggleAddressInput"><i class="fas fa-pencil-alt"></i></a>
      <a class="ml-3" @click.prevent="removeAddress" v-if="allowDelete && stxaddr"><i class="far fa-trash-alt"></i></a>
      <a class="ml-3" href="/" @click.prevent="helpModal = !helpModal"><i class="far fa-question-circle"></i></a>
    </div>
  </div>

  <div class="d-flex justify-content-center mb-4" v-if="canMakeStacksPaymentNetwork">
    <div class="text-primary">
      <a @click.prevent="setPaymentNetwork"><u>Make stacks your default payment network.</u></a>
    </div>
  </div>

  <div class="mb-4">
    <p class="text-muted">Stacks are Blockstack tokens - they will be available soon and we will be supporting
    payments in Stacks as soon as they are.</p>
  </div>

  <div class="d-flex flex-column align-items-left">
    <div class="text-danger" v-if="message">
      <p>{{message}}</p>
    </div>
    <div class="mb-4" v-if="changeBtcAddress || removedAddress">
      <input type="text" style="max-width: 460px;" class="form-control" required id="vc-stacks-address" placeholder="Your stacks address" v-on:keyup.13="saveStacksAddress($event)" v-model="stacksAddress">
    </div>
    <div class="mb-3">
      <canvas id="sqrcode"></canvas>
    </div>
    <div class="d-flex flex-column align-items-left mb-4" style="" v-if="stxaddr && !removedAddress">
      {{stxaddr.substring(0,15)}}...
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
  name: "StacksAddress",
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
      stacksAddress: null,
    };
  },
  mounted() {
    let blockstackProfile = this.$store.getters["myAccountStore/getMyProfile"];
    let stxaddr = blockstackProfile.publicKeyData.rxAddressList[2].address;
    if (stxaddr) {
      let $self = this;
      setTimeout(function() {
        $self.checkStacksAddress(stxaddr);
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
    canMakeStacksPaymentNetwork: function() {
      let currentNetwork = this.$store.getters["myAccountStore/getPaymentNetwork"];
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      let currentAddress = myProfile.publicKeyData.rxAddressList[2].address;
      return currentNetwork !== "stacks" && currentAddress && currentAddress.length > 15;
    },
    stxaddr() {
      let blockstackProfile = this.$store.getters["myAccountStore/getMyProfile"];
      let stxaddr = blockstackProfile.publicKeyData.rxAddressList[2].address;
      return stxaddr;
    },
  },

  methods: {
    saveStacksAddress: function(event) {
      if (event) event.preventDefault();
      this.checkStacksAddress(this.stacksAddress, true)
    },
    setPaymentNetwork: function() {
      this.$emit("paymentNetworkUpdate", "stacks");
    },
    helpModalClose: function() {
      this.helpModal = false;
    },
    toggleAddressInput: function() {
      this.changeBtcAddress = !this.changeBtcAddress;
    },
    removeAddress: function() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      myProfile.publicKeyData.rxAddressList[2].address = undefined;
      this.changeBtcAddress = false;
      document.getElementById("sqrcode").style.display = "none";
      this.$store.commit("myAccountStore/myProfile", myProfile);
      this.removedAddress = true;
      this.updateStacksAddress(null);
    },
    checkStacksAddress(stacksAddress, emit) {
      if (stacksAddress && stacksAddress.indexOf(" ") > -1) {
        stacksAddress = stacksAddress.trim();
      }
      if (stacksAddress && stacksAddress.length > 20 && (stacksAddress.indexOf("SM") === 0 || stacksAddress.indexOf("SP") === 0)) {
        this.removedAddress = false;
        this.addQrCode(stacksAddress);
        this.message = null;
        if (emit) {
          this.updateStacksAddress(stacksAddress);
        }
      } else {
        this.message = "Invalid address - is it the right key for the current stacks network?";
      }
    },
    updateStacksAddress(stacksAddress) {
      this.$store.dispatch("myAccountStore/updateStacksAddress", stacksAddress).then((prof) => {
        if (stacksAddress) {
          this.addQrCode(stacksAddress);
        }
        if (!stacksAddress) {
          this.$notify({type: 'success', title: 'Stacks Address', text: 'Address removed from profile.'});
        } else if (prof.username) {
          this.$notify({type: 'success', title: 'Stacks Address', text: 'Address successfully updated.'});
        } else {
          this.$notify({type: 'error', title: 'Stacks Address', text: 'An error occurred while attempting to update address.'});
        }
      });
    },
    addQrCode(stacksAddress) {
      let $qrCode = document.getElementById("sqrcode");
      if (stacksAddress && $qrCode) {
        $qrCode.style.display = "block";;
        this.changeBtcAddress = false;
        QRCode.toCanvas(
          $qrCode, stacksAddress, { errorCorrectionLevel: "H" },
          function(error) {
            if (error) console.error(error);
            console.log("success!");
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
