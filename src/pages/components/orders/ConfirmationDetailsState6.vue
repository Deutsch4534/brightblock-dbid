<template>
<div>
  <div class="mx-md-5">
    <div class="d-flex justify-content-start mb-3">Goods received! Your payment has been sent to the seller.</div>
  </div>
  <div class="mx-md-5 d-flex justify-content-start">
    <div>Payment to seller is confirming - {{sellerConfirmations}} / 6 confirmations</div>
  </div>
</div>
</template>

<script>
import { mdbBtn } from "mdbvue";
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import moment from "moment";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ConfirmationDetailsState6",
  components: {
    mdbBtn
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
    sellerConfirmations() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      try {
        return purchaseCycle.seller.chainData.confirmations;
      } catch (err) {
        return 0;
      }
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
  },
  methods: {
  }
};
</script>
