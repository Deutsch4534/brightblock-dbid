<template>
<div>
  <help-topic-modal :modal="helpModal" :topic="'lightning-address'" @closeModal="helpModalClose"/>

  <div class="d-flex justify-content-between mb-5">
    <h4 class="text-capitalize"><a href="/" @click.prevent="helpModal = !helpModal">Lightning Address - <span class="text-primary">{{bitcoinState.chain}}</span> network</a></h4>
    <div class="text-muted text-primary text-nowrap">
      <a class="ml-5 " @click.prevent="toggleAddressInput"><i class="fas fa-pencil-alt"></i></a>
      <a class="ml-3 " @click.prevent="removeAddress" v-if="allowDelete && lndaddr"><i class="far fa-trash-alt"></i></a>
      <a class="ml-3 " href="/" @click.prevent="helpModal = !helpModal"><i class="far fa-question-circle"></i></a>
    </div>
  </div>

  <div class="d-flex justify-content-center mb-4" v-if="canMakeLightningPaymentNetwork">
    <div class="text-primary">
      <a @click.prevent="setPaymentNetwork"><u>Make lighting your default payment network.</u></a>
    </div>
  </div>

  <div class="d-flex flex-column align-items-left">
    <div class="text-danger" v-if="message">
      <p>{{message}}</p>
    </div>
    <div class="mb-4">
      <p class="text-muted">Please note: we are awaiting a lightning upgrade
      for making invoice-less payments. Currently lightning requires the recipient to generate an invoice for each
      payment which expire after 24 hours. This means we currently need to fall back to sending you payments
      directly through the bitcoin network - this will change once the upgrade is released.</p>
      <p class="text-muted">In the meantime you can try it out by generating an invoice in your lightning enabled bitcoin wallet and copy the payment request here.</p>
      <input type="text" class="form-control" required id="vc-bitcoin-address" placeholder="Your bitcoin lightning address" v-on:keyup.13="saveLightningAddress($event)" v-model="lightningAddress">
    </div>
    <div class="mb-4" v-if="invoice">
      <p class="text-muted mt-3">Reason: {{invoice.description}}</p>
      <p class="text-muted">Amount: {{invoice.numSatoshis}} Satoshis (-> {{numBitcoin}})</p>
      <p class="text-muted">Expires: {{expiresIn}}</p>
    </div>
    <div class="mb-3">
      <canvas id="lqrcode"></canvas>
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
  name: "LightningAddress",
  components: {
    HelpTopicModal,
  },
  props: {
    activeTab: null,
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
      lightningAddress: null,
      invoice: null
    };
  },
  mounted() {
    let $self = this;
    setTimeout(function() {
      $self.checkLightningAddress();
    }, 1000);
    this.bitcoinState = this.$store.getters["assetStore/getBitcoinConfig"];
  },
  computed: {
    myProfile() {
      let blockstackProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return blockstackProfile;
    },
    expiresIn() {
      if (this.invoice) {
        return this.invoice.expiry;
      }
    },
    numBitcoin() {
      if (this.invoice) {
        return this.invoice.numSatoshis / 100000000;
      }
    },
    canMakeLightningPaymentNetwork: function() {
      let currentNetwork = this.$store.getters["myAccountStore/getPaymentNetwork"];
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      let currentAddress = myProfile.publicKeyData.rxAddressList[1].address;
      return currentNetwork !== "lightning" && currentAddress && currentAddress.length > 15;
    },
    lndaddr() {
      let blockstackProfile = this.$store.getters["myAccountStore/getMyProfile"];
      let lndaddr = blockstackProfile.publicKeyData.rxAddressList[1].address;
      return lndaddr;
    },
  },

  methods: {
    saveLightningAddress: function(event) {
      if (event) event.preventDefault();
      this.checkLightningAddress(true)
    },
    setPaymentNetwork: function() {
      this.$emit("paymentNetworkUpdate", "lightning");
    },
    helpModalClose: function() {
      this.helpModal = false;
    },
    toggleAddressInput: function() {
      this.changeBtcAddress = !this.changeBtcAddress;
    },
    removeAddress: function() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      myProfile.publicKeyData.rxAddressList[1].address = undefined;
      this.changeBtcAddress = false;
      document.getElementById("lqrcode").style.display = "none";
      this.$store.commit("myAccountStore/myProfile", myProfile);
      this.removedAddress = true;
      this.updateLightningAddress(null);
    },
    checkLightningAddress(emit) {
      let blockstackProfile = this.$store.getters["myAccountStore/getMyProfile"];
      let lightningAddress;
      if (emit) {
        lightningAddress = this.lightningAddress;
      } else {
        lightningAddress = blockstackProfile.publicKeyData.rxAddressList[1].address;
        if (!lightningAddress) {
          this.changeBtcAddress = true;
          return;
        }
      }
      if (lightningAddress && lightningAddress.indexOf(" ") > -1) {
        lightningAddress = lightningAddress.trim();
      }
      this.$store.dispatch("lightningStore/fetchDecodedInvoice", lightningAddress).then((result) => {
        if (result && result.paymentHash) {
          this.lightningAddress = lightningAddress;
          this.invoice = result;
          this.removedAddress = false;
          this.message = null;
          if (emit) {
            this.updateLightningAddress(lightningAddress);
          } else {
            this.addQrCode(lightningAddress);
          }
        } else {
          this.message = "Invalid address - is it the right key for the current network?";
          this.$notify({type: 'error', title: 'Lightning Address', text: 'Does not look like a lightning payment request.'});
        }
      });
    },
    updateLightningAddress(lightningAddress) {
      this.$store.dispatch("myAccountStore/updateLightningAddress", lightningAddress).then((prof) => {
        if (lightningAddress) {
          this.addQrCode(lightningAddress);
        }
        if (!lightningAddress) {
          this.$notify({type: 'success', title: 'Lightning Address', text: 'Address removed from profile.'});
        } else if (prof.username) {
          this.$notify({type: 'success', title: 'Lightning Address', text: 'Address successfully updated.'});
        } else {
          this.$notify({type: 'error', title: 'Lightning Address', text: 'An error occurred while attempting to update address.'});
        }
      });
    },
    addQrCode(lightningAddress) {
      let $qrCode = document.getElementById("lqrcode");
      if (lightningAddress && $qrCode) {
        $qrCode.style.display = "block";
        this.changeBtcAddress = false;
        QRCode.toCanvas(
          $qrCode, lightningAddress, { errorCorrectionLevel: "H" },
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
.nav-item {
 list-style-type: none;
}
</style>
