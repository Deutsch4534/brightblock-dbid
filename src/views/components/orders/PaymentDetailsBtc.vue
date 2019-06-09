<template>
<div class="row text-center">
  <div class="col-md-12 pt-3">
    <a :href="paymentUri" class="btn btn-block btn-sm text-white teal lighten-1">OPEN IN WALLET</a>
    <mdb-progress :height="20"  :value="validFor" color="blue" />
  </div>
  <div class="col-md-12">
    <img class="img-fluid" :src="qrImage" alt="artwork.title" style="width: 90%;">
    <canvas id="qrcode1"></canvas>
  </div>
  <div class="col-md-12 text-left pl-5 muted">
    Pay with QR code or
    <br/>
    <small><a href="#" @click.prevent="copyAddress">COPY PAYMENT LINK</a></small>
    <input id="payment-address-btc" type="text" :value="paymentUri" style="color: white; border: none;"/>
  </div>
</div>
</template>

<script>
import xhrService from "@/services/xhrService";
import QRCode from "qrcode";
import moneyUtils from "@/services/moneyUtils";
import { mdbContainer, mdbProgress } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "PaymentDetails",
  components: {
    mdbContainer, mdbProgress
  },
  props: {
    paymentUri: null,
    validFor: ""
  },
  data() {
    return {
      qrImage: require("@/assets/img/missing/artwork-missing.jpg")
    };
  },
  mounted() {
    if (this.paymentUri) {
      this.addQrCode("qrcode1", this.paymentUri);
    }
  },
  mounted() {
    if (this.paymentUri) {
      this.addQrCode("qrcode1", this.paymentUri);
    }
  },
  computed: {
    image() {
      let $qrCode = document.getElementById("qrcode1");
      let qrImage = $qrCode.toDataURL();
      qrImage = $self.qrImage.substring(22);
      if (qrImage) {
        return qrImage;
      }
      return image1;
    },
  },
  methods: {
    addQrCode(qrc, paymentUri) {
      let $qrCode = document.getElementById(qrc);
      let $self = this;
      let qrCanvas = QRCode.toCanvas(
        $qrCode, paymentUri, { errorCorrectionLevel: "H" },
        function(error) {
          if (error) console.error(error);
          console.log("success!");
          $self.qrImage = $qrCode.toDataURL();
          $qrCode.style.display = "none";
          //$self.qrImage = $self.qrImage.substring(22);
        }
      );
    },
    copyAddress() {
      var copyText = document.getElementById("payment-address-btc");
      copyText.select();
      document.execCommand("copy");
      this.$notify({type: 'success', title: 'Copied Address', text: 'Copied the address to clipboard: ' + copyText.value});
    },
  }
};
</script>
