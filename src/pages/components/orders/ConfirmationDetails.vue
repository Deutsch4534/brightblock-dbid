<template>
<div class="bg-light mb-5">
  <div class="d-flex justify-content-center">
    <div class="d-flex justify-content-center">
      <h4>{{network}}&nbsp;<span class="text-danger">{{bitcoinConfig.chain}}</span>&nbsp;network</h4>
    </div>
  </div>
  <div class="d-flex justify-content-center">
    <div class="text-muted text-center">{{amountBtc}}</div>
  </div>
  <div class="d-flex justify-content-center">
    <div class="text-muted text-center mb-3">{{amountFiat}}</div>
  </div>
  <div class="" v-if="asset.status > 3">
    <div class="d-flex justify-content-start mb-3">Paid: <span class="ml-4 text-muted">{{timeReceived}}</span></div>
  </div>
  <div class="" v-if="asset.status === 4">
    <div class="d-flex justify-content-between" v-if="asset.status === 4">
      <div>Confirmations {{buyerConfirmations}} / 6 (apprx 1 hour)</div>
      <div class="text-muted"><a :href="buyerBlockchainUrl()" target="_blank">Check chain <i class="fas fa-external-link-alt"></i></a></div>
    </div>
  </div>
  <div class="" v-else-if="asset.status === 5">
    <div class="d-flex justify-content-end mb-3" v-if="confirmedBtc">
      <div class="text-muted"><a :href="buyerBlockchainUrl()" target="_blank">Check chain <i class="fas fa-external-link-alt"></i></a></div>
    </div>
    <div class="d-flex justify-content-between mb-3" v-else-if="confirmedLnd">
      <div>Invoice settled</div>
      <div class="text-muted"><a href="https://lightning.chaintools.io" target="_blank">Check chain <i class="fas fa-external-link-alt"></i></a></div>
    </div>
    <div class="row mb-3">
      <div><mdb-btn @click="paySeller" rounded color="white" size="sm" class="mx-0 waves-light">confirm shipping completed</mdb-btn></div>
    </div>
  </div>
  <div class="d-flex justify-content-start" v-else-if="asset.status === 6">
    <div>Payment to seller is confirming - {{sellerConfirmations}} / 6 confirmations</div>
  </div>
  <div class="d-flex justify-content-start" v-else-if="asset.status === 7">
    <div>Transferred item to your storage.</div>
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
    confirming() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset.status === 4;
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
