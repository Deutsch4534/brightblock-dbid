<template>
<mdb-card-text>
  <mdb-popover trigger="click" :options="{placement: 'top'}">
    <div class="popover">
      <div class="popover-header">
        Public Bitcoin Address
      </div>
      <div class="popover-body">
        We use your bitcoin address for the following;
        <ul>
          <li>For payments to be made to your bitcoin wallet.</li>
          <li>For generating certificates of authenticity for artwork.</li>
        </ul>
      </div>
      <div class="popover-body">
        You'll need a bitcoin wallet to use radicle. We use the
        <a href="https://electrum.org" target="_blank" rel="noreferrer">electrum wallet <mdb-icon icon="external-link-alt" /></a>
        and the <a href="https://bitcoin.org/en/download" target="_blank" rel="noreferrer">bitcoin core <mdb-icon icon="external-link-alt" /></a> wallets to test the site.
      </div>
    </div>
    <a @click.prevent="" slot="reference">
      Public <span class="text-danger">Testnet</span> Bitcoin Address <mdb-icon far icon="question-circle" />
    </a>
  </mdb-popover>
  <p>Your
   will be embedded in your certificate of authenticity to make it easy
  to receive future payments.</p>
  <div class="row text-center">
    <div class="col-md-4 offset-4">
      <canvas id="qrcode" max-width="150px" style="display:none;"></canvas>
    </div>
    <div class="col-md-12" v-if="myProfile.publicKeyData.bitcoinAddress && !removedAddress">
      {{myProfile.publicKeyData.bitcoinAddress}}
       <a @click.prevent="toggleAddressInput"><mdb-icon icon="pen" /></a>
    </div>
    <div class="col-md-12 text-danger" v-if="message">
      <p>{{message}}</p>
    </div>
    <div class="col-md-12" v-if="changeBtcAddress || removedAddress">
      <input type="text" width="50%" class="form-control" required id="vc-bitcoin-address" placeholder="Your bitcoin address" v-on:keyup.13="saveBitcoinAddress($event)" v-model="myProfile.publicKeyData.bitcoinAddress">
    </div>
    <div class="col-md-12" v-if="allowDelete && myProfile.publicKeyData.bitcoinAddress">
      <a class="black-text d-flex justify-content-end" @click.prevent="removeAddress"><mdb-btn class="btn teal lighten-1" size="md">Delete Address</mdb-btn></a>
    </div>
  </div>
</mdb-card-text>
</template>

<script>
import { mdbIcon, mdbPopover, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import QRCode from "qrcode";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "BitcoinAddressEntry",
  components: {
    mdbCardBody,
    mdbPopover,
    mdbIcon,
    mdbCardTitle,
    mdbCardText,
    mdbBtn
  },
  props: {
    allowDelete: false
  },
  data() {
    return {
      changeBtcAddress: false,
      message: null,
      removedAddress: false,
    };
  },
  mounted() {
    let blockstackProfile = this.$store.getters["myAccountStore/getMyProfile"];
    if (blockstackProfile.publicKeyData.bitcoinAddress) {
      this.checkBitcoinAddress(blockstackProfile.publicKeyData.bitcoinAddress);
    } else {
      this.changeBtcAddress = true;
    }
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
      let $self = this;
      bitcoinService.checkAddress({address: bitcoinAddress}).then(result => {
        if (result) {
          $self.removedAddress = false;
          let blockstackProfile = $self.$store.getters["myAccountStore/getMyProfile"];
          blockstackProfile.publicKeyData.bitcoinAddress = bitcoinAddress;
          $self.addQrCode(bitcoinAddress);
          $self.message = null;
          if (emit) {
            $self.$emit("bitcoinAddressUpdate", bitcoinAddress);
          }
        } else {
          $self.message = "Invalid address - is it the right key for the current bitcoin network?";
        }
      })
        .catch(error => {
          $self.message = "Invalid address - is it the right key for the current bitcoin network?";
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
