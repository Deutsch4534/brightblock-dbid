<template>
<div v-if="paymentDetected">
  <div class="mx-md-5">
    <div class="d-flex justify-content-start mb-3">Wey hey - you have a potential buyer!</div>
    <div class="d-flex justify-content-start mb-3">Once their payment is confirmed we will display shipping details for you to send the goods.</div>
  </div>
  <div class="mx-md-5">
    <div class="d-flex justify-content-between text-muted">
      <div>Confirmations {{buyerConfirmations}} / 6 (apprx 1 hour)</div>
      <div class="text-muted"><a :href="buyerBlockchainUrl" target="_blank">Check chain <i class="fas fa-external-link-alt"></i></a></div>
    </div>
  </div>
  <!--
  <div class="mx-md-5">
    <div class="d-flex justify-content-start text-muted">Note: If the payment fails for any reason the item will remain listed!</div>
  </div>
  -->
</div>
<div v-else>
  <div class="mx-md-5">
    <div class="d-flex justify-content-start mb-3">Someone is considering buying this item.</div>
    <div class="d-flex justify-content-start mb-3">We will let you know when they have paid and show you next steps.</div>
  </div>
</div>
</template>

<script>
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import moment from "moment";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ShippingWaiting",
  components: {
  },
  props: {
    assetHash: null,
  },
  data() {
    return {
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
    paymentDetected() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let method = purchaseCycle.buyer.chainData.method;
      let txid = purchaseCycle.buyer.chainData.txid;
      let confirmations = purchaseCycle.buyer.chainData.confirmations;
      let settled = purchaseCycle.buyer.chainData.settled;
      let payment = txid || settled;
      return payment;
    },
    shippingAddress() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let profile = this.$store.getters['userProfilesStore/getProfile'](purchaseCycle.buyer.did);
      let confs = purchaseCycle.buyer.chainData.confirmations;
      if (confs < 3) return;
      return profile.shippingAddress;
    },
    network() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      if (purchaseCycle.buyer.chainData.bitcoinMethod) {
        return "bitcoin";
      }
      if (purchaseCycle.buyer.chainData.lightningMethod) {
        return "lightning";
      }
      return;
    },
  },
  methods: {
    notifySeller(sellerMessage) {
      this.$emit("notifySeller", sellerMessage);
    },
  }
};
</script>
