<template>
<mdb-card-body>
  <mdb-card-text>
    <mdb-card-title>Certificate of Authenticity</mdb-card-title>
    <mdb-card-text>
      <p>Your artwork has been <a :href="blockchainInfoUrl()" target="_blank">registered</a> with the Bitcoin blockchain.</p>
    </mdb-card-text>
    <bitcoin-address-entry v-if="showBitcoinAddress && !artwork.coa" @bitcoinAddressUpdate="updateBitcoinAddress"/>
    <div class="rounded-bottom lighten-3 text-right p-3">
      <a v-if="artwork.coa" class="black-text" @click.prevent="openCoa()"><mdb-btn class="btn teal lighten-1" size="md">Open COA</mdb-btn></a>
      <a v-else class="black-text" @click.prevent="generateCoa()"><mdb-btn class="btn teal lighten-1" size="md">Generate COA</mdb-btn></a>
    </div>
  </mdb-card-text>

  </div>
</mdb-card-body>
</template>

<script>
import xhrService from "@/services/xhrService";
import { mdbPopover, mdbIcon, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import BitcoinAddressEntry from "../utils/BitcoinAddressEntry";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Registration",
  components: {
    BitcoinAddressEntry,
    mdbCardBody,
    mdbPopover,
    mdbIcon,
    mdbCardTitle,
    mdbCardText,
    mdbBtn
  },
  props: {
    myProfile: {
      type: Object,
      default() {
        return {};
      }
    },
    artwork: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  data() {
    return {
      result: null,
      downloadLink: null,
      showBitcoinAddress: false,
      validBitcoinAdress: false,
      message: null,
    };
  },
  mounted() {
    this.showBitcoinAddress = true;
  },
  computed: {
    hasBitcoinAddress() {
      return this.myProfile.publicKeyData.bitcoinAddress;
    }
  },
  methods: {
    setByEventCoa (coa) {
      let artwork = this.artwork;
      artwork.coa = coa;
      this.$store.dispatch("myArtworksStore/updateArtwork", {artwork: artwork, updateProvData: true})
        .then((artwork) => {
          this.$emit("reload");
        });
    },
    updateBitcoinAddress(bitcoinAddress) {
      this.validBitcoinAdress = bitcoinAddress;
      this.$store.dispatch("myAccountStore/updateBitcoinAddress", bitcoinAddress);
      this.modal = true;
    },
    blockchainInfoUrl() {
      let artwork = this.artwork;
      let state = this.$store.getters["assetStore/getBitcoinConfig"];
      if (state.chain === "test") {
        // return `https://testnet.blockexplorer.com/tx/${artwork.bitcoinTx}`;
        return `https://testnet.smartbit.com.au/tx/${artwork.bitcoinTx}`;
      }
      return `https://www.blockchain.com/btc/tx/${artwork.bitcoinTx}`;
    },
    generateCoa: function() {
      let canvas, qrCodeDataUrl;
      try {
        canvas = document.getElementById('qrcode');
        qrCodeDataUrl = canvas.toDataURL();
      } catch (err) {
        // no canvas - ie bitcoin address.
      }
      let artwork = this.artwork;
      let $self = this;
      let siteLogo = require("@/assets/img/logo/logo-black-256x256.png");
      let data = {
        artwork: artwork,
        qrCodeDataUrl: qrCodeDataUrl,
        siteName: "Radicle Art",
        siteLogo: siteLogo,
      }
      let endPoint = this.$store.state.constants.ethGatewayUrl + "/api/convert/coa";
      xhrService.makePostCall(endPoint, data).then((response) => {
        $self.downloadLink = $self.getPdfLink(artwork);
        // $self.$emit('updateCoa', response.data);
        $self.setByEventCoa(response.data);
        $self.$emit("reload");
      });
    },
    getPdfLink: function(artwork) {
      let url = this.$store.state.constants.ethGatewayUrl + "/api/getpdf/";
      if (artwork) {
        let title = artwork.title;
        title = title.replace(/\s/g, '_');
        let filename = title + "_" + artwork.id + ".pdf";
        return url + filename;
      }
    },
    openCoa () {
      let pdfWindow = window.open("")
      pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(this.artwork.coa)+"'></iframe>")
    },
  }
};
</script>
