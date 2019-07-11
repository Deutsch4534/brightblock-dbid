<template>
<div class="bg-light mb-5 p-4">
  <div class="d-flex justify-content-center">
    <div class="d-flex justify-content-center">
      <h4>{{network}}&nbsp;<span class="text-danger">{{bitcoinConfig.chain}}</span>&nbsp;network</h4>
    </div>
  </div>
  <div class="mx-md-5">
    <div class="d-flex justify-content-start mb-3">We have detected your payment.</div>
    <div class="d-flex justify-content-start mb-3">We will give them your shipping address when they log in - it isn't revealed to anyone else.</div>
  </div>
  <div class="mx-md-5 d-flex justify-content-around mb-3">
    <div><mdb-btn @click="notifySeller" rounded color="white" size="sm" class="mx-0 waves-light">notify seller</mdb-btn></div>
  </div>
  <div class="mx-md-5">
    <div class="d-flex justify-content-start text-muted">Note: If the seller fails to send you your goods you will be given a full refund!</div>
    <div class="d-flex justify-content-between text-muted">
      <div>Confirmations {{buyerConfirmations}} / 6 (apprx 1 hour)</div>
      <div class="text-muted"><a :href="buyerBlockchainUrl" target="_blank">Check chain <i class="fas fa-external-link-alt"></i></a></div>
    </div>
  </div>
  <div class="mx-md-5 my-4">
    <div class="d-flex justify-content-center mb-3">Thank you for using dbid!</div>
  </div>
</div>
</template>

<script>
import { mdbBtn } from "mdbvue";
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import moment from "moment";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ConfirmationDetailsState4",
  components: {
    mdbBtn
  },
  props: {
    assetHash: null,
    purchaseCycle: null,
  },
  data() {
    return {
      showBlockchainInfo: false,
      showInstructions: false,
      showPaymentDetails: false,
      order: null,
      sellerMessage: null
    };
  },
  mounted() {
  },
  computed: {
    buyerBlockchainUrl() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let bitcoinConfig = this.$store.getters["assetStore/getBitcoinConfig"];
      let txid = purchaseCycle.buyer.chainData.txid;
      if (bitcoinConfig.chain === "test") {
        return "https://testnet.smartbit.com.au/tx/" + txid;
      }
      return "https://www.blockchain.com/btc/tx/" + txid;
    },
    buyerConfirmations() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      return purchaseCycle.buyer.chainData.confirmations;
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
    notifySeller() {
      this.$emit("notifySeller", this.sellerMessage);
    },
  }
};
</script>
