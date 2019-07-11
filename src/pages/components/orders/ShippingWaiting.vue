<template>
<div class="bg-light mb-5 p-4">
  <div class="d-flex justify-content-center">
    <div class="d-flex justify-content-center">
      <h4>{{network}}&nbsp;<span class="text-danger">{{bitcoinConfig.chain}}</span>&nbsp;network</h4>
    </div>
  </div>
  <div class="mx-md-5">
    <div class="d-flex justify-content-start mb-3">Wey hey - we found you a potential buyer!</div>
    <div class="d-flex justify-content-start mb-3">Once their payment is confirmed we will display shipping details for you to send the goods.</div>
  </div>
  <div class="mx-md-5">
    <div class="d-flex justify-content-start text-muted">Note: If the payment fails for any reason the item will remain listed!</div>
  </div>
  <div class="mx-md-5 my-4">
    <div class="d-flex justify-content-center mb-3">Thank you for using dbid!</div>
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
    notifySeller(sellerMessage) {
      this.$emit("notifySeller", sellerMessage);
    },
  }
};
</script>
