<template>
<div class="">
  <div class="p-2">
    <div class="d-flex p-2 justify-content-between">
      <mdb-dropdown>
        <mdb-dropdown-toggle slot="toggle" color="primary" size="sm">Payment Options</mdb-dropdown-toggle>
        <mdb-dropdown-menu>
          <mdb-dropdown-item><a @click.prevent="toggleNetwork('bitcoin', $event)">Bitcoin</a></mdb-dropdown-item>
          <mdb-dropdown-item><a @click.prevent="toggleNetwork('lightning', $event)">Lighting</a></mdb-dropdown-item>
          <div class="dropdown-divider"></div>
          <mdb-dropdown-item><a @click.prevent="toggleNetwork('opennode', $event)">Opennode</a></mdb-dropdown-item>
        </mdb-dropdown-menu>
      </mdb-dropdown>
      <div class="bg-warning text-white py-1 px-2">Valid for: {{validForCalc}}</div>
    </div>
    <div class="d-flex justify-content-center">
      <div>
        <span class="">{{network}}</span> -
        <span class="text-danger">{{bitcoinConfig.chain}}</span> net
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <p class="text-muted text-center p-0 m-0">{{amountBtc}}</p>
    </div>
    <div class="d-flex justify-content-center">
      <p class="text-muted text-center p-0 m-0 mb-3">{{amountFiat}}</p>
    </div>
    <div class="d-flex justify-content-center" v-if="network === 'opennode'">
      <p class="text-center p-5"><a @click="toggleNetwork('opennode')" href="https://www.opennode.co/" target="_blank">Opennode <i class="fas fa-external-link-alt"></i></a> is a bitcoin and lightning payment provider - integration with opennode is coming soon.</p>
    </div>

    <div class="col-12" v-if="network === 'lightning'">
      <p class="text-muted text-nowrap" style="width: 0.7rem;"><small>
      For lightning payments please open a channel from your lightning wallet to radpay lightning node:
      <br/>
      <span id="payment-address" class="text-success">{{lightningPeer}}</span><a href="#" @click.prevent="copyPeerAddress"><i class="fas fa-clone ml-4"></i></a>
      </small>
      </p>
    </div>

    <div class="d-flex justify-content-center" v-if="network !== 'opennode'">
      <img class="mx-auto " :src="qrImage" alt="'scan qr code'" width="auto">
    </div>
    <div class="d-flex p-2 text-light justify-content-center" v-if="network !== 'opennode'">
      <a :href="paymentUri" class="btn btn-primary mr-3">Open in wallet <i class="fas fa-external-link-alt"></i></a>
      <a class="btn btn-primary ml-3" @click.prevent="copyAddress">Copy <i class="fas fa-clone ml-4"></i></a>
    </div>


  </div>
  <div class="d-flex p-2 justify-content-center" style="">
    <input class="" id="payment-address-btc" type="text" :value="paymentUri" style="background-color: #EFF1F2; color: #EFF1F2; border: none;"/>
    <canvas id="qrcode1"></canvas>
  </div>
</div>
</template>

<script>
import QRCode from "qrcode";
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import moment from "moment";
import { mdbProgress, mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "PaymentDetails",
  components: {
    mdbProgress,
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle
  },
  props: {
    validFor: "",
    eternal: true,
    assetHash: null
  },
  data() {
    return {
      qrImage: require("@/assets/img/missing/artwork-missing.jpg"),
      network: "bitcoin",
      bitcoinUri: null,
      lightningUri: null,
      paymentUri: null,
    };
  },
  mounted() {
    this.bitcoinUri = bitcoinService.getBitcoinUri(this.asset);
    this.lightningUri = bitcoinService.getLightningUri(this.asset);
    this.paymentUri = this.bitcoinUri;
    this.addQrCode("qrcode1", this.paymentUri);
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
    asset() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      if (asset) {
        return asset;
      }
      return {};
    },
    amountFiat() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let amF = purchaseCycle.buyer.amountFiat + " " + purchaseCycle.currency;
      let fiatRate = this.$store.getters["conversionStore/getFiatRate"](purchaseCycle.currency);
      let symbol = fiatRate["symbol"];
      return symbol + " " + amF;
    },
    amountBtc() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      return purchaseCycle.buyer.amountBitcoin + " BTC";
    },
    lightningConfig() {
      let lightningConfig = this.$store.getters["assetStore/getLightningConfig"];
      return lightningConfig;
    },
    lightningPeer() {
      let lightningConfig = this.$store.getters["assetStore/getLightningConfig"];
      if (lightningConfig) {
        let alice = lightningConfig["alice"];
        return alice.pubkey + "@" + alice.nodeUri;
      }
    },
    bitcoinConfig() {
      let bitcoinConfig = this.$store.getters["assetStore/getBitcoinConfig"];
      if (!bitcoinConfig) {
        bitcoinConfig = {
          chain: "unknown"
        }
      }
      return bitcoinConfig;
    },
    validForCalc() {
      let diff = Math.round(this.validFor);
      let mm = Math.floor(diff / 60);
      if (mm < 10) {
        mm = "0" + mm;
      }
      let ss = diff % 60;
      if (ss < 10) {
        ss = "0" + ss;
      }
      return mm + " m " + ss + " s";
    }
  },
  methods: {
    cancelOrder() {
      this.$emit("cancelOrder", this.assetHash);
    },
    copyPeerAddress() {
      document.execCommand("copy");
      var copyText = document.getElementById("payment-address");
      var textArea = document.createElement("textarea");
      textArea.value = copyText.textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("Copy");
      this.$notify({type: 'success', title: 'Copied Address', text: 'Copied the address to clipboard: ' + textArea.value});
      textArea.remove();
    },
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
    toggleNetwork(network, event) {
      if (network === "lightning") {
        this.paymentUri = this.lightningUri;
        this.addQrCode("qrcode1", this.paymentUri);
      } else if (network === "bitcoin") {
        this.paymentUri = this.bitcoinUri;
        this.addQrCode("qrcode1", this.paymentUri);
      }  else if (network === "opennode") {
        this.paymentUri = null;
      }
      //let gp = event.currentTarget.parentElement.parentElement.classList.remove("show");
      let gp = event.currentTarget.parentElement.parentElement.parentElement;
      gp.classList.add("collapse")
      gp.classList.remove("collapse-item");
      this.network = network;
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
