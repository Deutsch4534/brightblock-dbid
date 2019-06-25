<template>
<div class="bg-light p-5">
  <div class="d-flex p-2 justify-content-center">
    <div class="d-flex justify-content-center">
      {{network}}&nbsp;<span class="text-danger">{{bitcoinConfig.chain}}</span>&nbsp;network
    </div>
  </div>
  <div class="d-flex justify-content-center">
    <p class="text-muted text-center p-0 m-0">{{amountBtc}}</p>
  </div>
  <div class="d-flex justify-content-center">
    <p class="text-muted text-center p-0 m-0 mb-3">{{amountFiat}}</p>
  </div>

  <!--
  <div class="mb-4">
    <div class="row">
      <div class="col-3">Network</div>
      <div class="col-6">{{bitcoinConfig.chain}}</div>
    </div>
    <div class="row">
      <div class="col-3">Transactions</div>
      <div class="col-6"><a :href="registerBlockchainUrl()" target="_blank">Provenance</a></div>
    </div>
    <div class="row" v-if="purchaseCycle.buyer.chainData.txid">
      <div class="col-3"></div>
      <div class="col-6"><a :href="buyerBlockchainUrl()" target="_blank">Payment</a></div>
    </div>
    <div class="row" v-if="purchaseCycle.seller.chainData.txid">
      <div class="col-3"></div>
      <div class="col-6"><a :href="sellerBlockchainUrl()" target="_blank">Settlement</a></div>
    </div>
  </div>
  -->
  <div>Created: {{timeReceived}}</div>
  <div v-if="unpaid">Payment not yet received</div>
  <div v-else-if="confirmingBtc"><a :href="buyerBlockchainUrl()" target="_blank">Payment received</a><br/>(confirming - {{buyerConfirmations}} / 6)</div>
  <div v-else-if="confirmingLnd"><a href="https://lightning.chaintools.io/" target="_blank">Payment received</a><br/>(invoice - unfulfilled)</div>
  <div v-else-if="confirmedBtc || confirmedLnd">
    <div class="d-flex justify-content-start" v-if="confirmedBtc">
      <a :href="buyerBlockchainUrl()" target="_blank">Payment confirmed</a>
    </div>
    <div class="d-flex justify-content-start" v-else-if="confirmedLnd">
      <a href="https://lightning.chaintools.io/" target="_blank">Invoice settled</a>
    </div>
    <div class="d-flex justify-content-center"><mdb-btn @click="paySeller" rounded color="white" size="sm" class="mx-0 waves-light">pay seller</mdb-btn></div>
  </div>
  <div v-else-if="settling">Transferring <a :href="sellerBlockchainUrl()" target="_blank">{{sellerConfirmations}} / 6 confirmations</a></div>
  <div v-else-if="settled">Transferred <a :href="sellerBlockchainUrl()" target="_blank">{{sellerConfirmations}} confirmations</a></div>
  <div v-else>
    <div>status in between</div>
  </div>
</div>
</template>

<script>
import { mdbBtn } from "mdbvue";
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import moment from "moment";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ConfirmationDetails",
  components: {
    mdbBtn
  },
  props: {
    assetHash: null,
    purchaseCycle: null,
    debugMode: false
  },
  data() {
    return {
      showBlockchainInfo: false,
      showInstructions: false,
      showPaymentDetails: false,
      order: null,
    };
  },
  mounted() {
  },
  computed: {
    buyerConfirmations() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      return purchaseCycle.buyer.chainData.confirmations;
    },
    asset() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset;
    },
    amountBtc() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      try {
        return purchaseCycle.buyer.amountBitcoin + " BTC";
      } catch (err) {
        return 0;
      }
    },
    amountFiat() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      try {
        return purchaseCycle.buyer.amountFiat + " " + purchaseCycle.currency;
      } catch (err) {
        return 0;
      }
    },
    sellerConfirmations() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      try {
        return purchaseCycle.seller.chainData.confirmations;
      } catch (err) {
        return 0;
      }
    },
    settled() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset.status === 7;
    },
    settling() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset.status === 6;
    },
    confirmingBtc() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset.status === 4 && purchaseCycle.buyer.chainData.method === "bitcoin";
    },
    confirmingLnd() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset.status === 4 && purchaseCycle.buyer.chainData.method === "lightning";
    },
    confirmedLnd() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset.status === 5 && purchaseCycle.buyer.chainData.method === "lightning";
    },
    confirmedBtc() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset.status === 5 && purchaseCycle.buyer.chainData.method === "bitcoin";
    },
    unpaid() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset.status < 4;
    },
    confirmations() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      return purchaseCycle.buyer.chainData.confirmations;
    },
    digiArt() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset.assetType === "digital";
    },
    timeReceived() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let date = moment(purchaseCycle.created).format(moment.HTML5_FMT.DATE);
      let time = moment(purchaseCycle.created).format(moment.HTML5_FMT.TIME);
      return date + " " + time;
    },
    network() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      if (purchaseCycle.buyer.chainData.bitcoinMethod) {
        return "bitcoin";
      }
      if (purchaseCycle.buyer.chainData.lightningMethod) {
        return "lightning";
      }
      return "unknown";
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
  },
  methods: {
    registerBlockchainUrl() {
      let bitcoinConfig = this.$store.getters["assetStore/getBitcoinConfig"];
      if (bitcoinConfig.chain === "test") {
        return `https://testnet.smartbit.com.au/tx/${this.registerTx}`;
      }
      return `https://www.blockchain.com/btc/tx/${this.registerTx}`;
    },
    buyerBlockchainUrl() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let bitcoinConfig = this.$store.getters["assetStore/getBitcoinConfig"];
      let txid = purchaseCycle.buyer.chainData.txid;
      if (bitcoinConfig.chain === "test") {
        return `https://testnet.smartbit.com.au/tx/${txid}`;
      }
      return `https://www.blockchain.com/btc/tx/${txid}`;
    },
    sellerBlockchainUrl() {
      try {
        let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
        let bitcoinConfig = this.$store.getters["assetStore/getBitcoinConfig"];
        let txid = purchaseCycle.seller.chainData.txid;
        if (bitcoinConfig.chain === "test") {
          return `https://testnet.smartbit.com.au/tx/${txid}`;
        }
        return `https://www.blockchain.com/btc/tx/${txid}`;
      } catch (err) {
        return null;
      }
    },
    sendBuyNow() {
      this.$emit("buyNow");
    },
    sendRefreshRequest() {
      // this.$emit("buyNow");
    },
    paySeller() {
      if (!this.purchaseCycle.seller.chainData.txid) {
        this.$emit("paySeller");
      }
      return "payment sent..";
    }
  }
};
</script>
