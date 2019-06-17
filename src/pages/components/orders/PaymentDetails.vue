<template>
<div class="row text-center">
  <div class="col-md-12 pt-3">
    <a :href="bitcoinUri" class="btn btn-block btn-sm text-white teal lighten-1">OPEN IN WALLET</a>
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
    <input id="payment-address" type="text" :value="bitcoinUri"/>
  </div>
</div>
</template>

<script>
import QRCode from "qrcode";
import { mdbProgress } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "PaymentDetails",
  components: {
    mdbProgress
  },
  props: {
    bitcoinUri: null,
    invoiceClaim: null,
    validFor: ""
  },
  data() {
    return {
      qrImage: require("@/assets/img/missing/artwork-missing.jpg")
    };
  },
  mounted() {
    if (this.bitcoinUri) {
      this.addQrCode("qrcode1", this.bitcoinUri);
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
    addQrCode(qrc, bitcoinUri) {
      let $qrCode = document.getElementById(qrc);
      let $self = this;
      let qrCanvas = QRCode.toCanvas(
        $qrCode, bitcoinUri, { errorCorrectionLevel: "H" },
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
      var copyText = document.getElementById("payment-address");
      copyText.select();
      document.execCommand("copy");
      this.$notify({type: 'success', title: 'Copied Address', text: 'Copied the address to clipboard: ' + copyText.value});
    },
    sentPayment() {
      this.$emit("paymentSent");
    }
  }
};
</script>
