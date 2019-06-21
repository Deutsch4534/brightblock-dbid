<template>
<div>
  <help-topic-modal :modal="helpModal" :topic="'bitcoin-address'" @closeModal="helpModalClose"/>
  <h4 class="text-capitalize"><a href="/" @click.prevent="helpModal = !helpModal">Bitcoin Address - <span class="text-primary">{{bitcoinState.chain}}</span> network</a></h4>
  <p class="text-muted">Payments will be sent to this address.  (<a @click.prevent="showHint = !showHint">hint</a>)</p>
  <p class="text-muted" v-if="showHint">Use this bitcoin test net address for testing - tb1q5d2p3tejxrjfqelcwght3km3ua9wgrd09w05es
  <br/>or see <a href="https://bitcoin.stackexchange.com/questions/76598/how-to-get-electrum-3-1-3-on-bitcoin-testnet" target="_blank"><u>this post</u></a> for helping running the electrum bitcoin wallet on testnet</p>
  <div class="row">
    <div class="col-md-12 text-danger" v-if="message">
      <p>{{message}}</p>
    </div>
    <div class="col-md-12 text-secondary mb-4" v-if="myProfile.publicKeyData.bitcoinAddress && !removedAddress">
      {{myProfile.publicKeyData.bitcoinAddress}}
      <span class="pl-3 pr-3 border-right border-dark text-primary"><a @click.prevent="toggleAddressInput"><i class="fas fa-pencil-alt"></i></a></span>
      <span class="pl-3 text-primary"><a @click.prevent="removeAddress" v-if="allowDelete && myProfile.publicKeyData.bitcoinAddress"><i class="far fa-trash-alt"></i></a></span>
    </div>
    <div class="col-md-12 mb-4" v-if="changeBtcAddress || removedAddress">
      <input type="text" width="50%" class="form-control" required id="vc-bitcoin-address" placeholder="Your bitcoin address" v-on:keyup.13="saveBitcoinAddress($event)" v-model="myProfile.publicKeyData.bitcoinAddress">
    </div>
    <div class="col-md-12">
      <canvas id="qrcode" max-width="150px" style="display:none;"></canvas>
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
    HelpTopicModal
  },
  props: {
    allowDelete: false
  },
  data() {
    return {
      helpModal: false,
      showHint: false,
      changeBtcAddress: false,
      message: null,
      removedAddress: false,
      bitcoinState: {}
    };
  },
  mounted() {
    let blockstackProfile = this.$store.getters["myAccountStore/getMyProfile"];
    if (blockstackProfile.publicKeyData.bitcoinAddress) {
      this.checkBitcoinAddress(blockstackProfile.publicKeyData.bitcoinAddress);
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
  },
  methods: {
    saveBitcoinAddress: function(event) {
      if (event) event.preventDefault();
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      this.checkBitcoinAddress(myProfile.publicKeyData.bitcoinAddress, true)
    },
    helpModalClose: function() {
      this.helpModal = false;
    },
    toggleAddressInput: function() {
      this.changeBtcAddress = !this.changeBtcAddress;
    },
    removeAddress: function() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      myProfile.publicKeyData.bitcoinAddress = undefined;
      this.changeBtcAddress = false;
      document.getElementById("qrcode").style.display = "none";
      this.$store.commit("myAccountStore/myProfile", myProfile);
      this.removedAddress = true;
      this.$emit("bitcoinAddressUpdate", null);
    },
    checkBitcoinAddress(bitcoinAddress, emit) {
      this.$store.dispatch("bitcoinStore/checkAddress", bitcoinAddress).then((result) => {
        if (result) {
          this.removedAddress = false;
          this.addQrCode(bitcoinAddress);
          this.message = null;
          if (emit) {
            this.$emit("bitcoinAddressUpdate", bitcoinAddress);
          }
        } else {
          this.message = "Invalid address - is it the right key for the current bitcoin network?";
        }
      });
    },
    addQrCode(bitcoinAddress) {
      let $qrCode = document.getElementById("qrcode");
      if (bitcoinAddress && $qrCode) {
        $qrCode.style.display = "block";;
        this.changeBtcAddress = false;
        QRCode.toCanvas(
          $qrCode, bitcoinAddress, { errorCorrectionLevel: "H" },
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
<style>

</style>
<style scoped>
</style>
