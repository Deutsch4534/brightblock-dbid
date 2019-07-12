<template>
<div>
  <div class="mx-md-5">
    <div class="d-flex justify-content-start mb-3">Buyer has received the goods!</div>
    <div class="d-flex justify-content-start mb-3">Your payment is clearing on chain.</div>
  </div>
  <div class="mx-md-5">
    <div class="d-flex justify-content-between text-muted">
      <div>Confirmations {{sellerConfirmations}} / 6 (apprx 1 hour)</div>
      <div class="text-muted"><a :href="sellerBlockchainUrl" target="_blank">Check chain <i class="fas fa-external-link-alt"></i></a></div>
    </div>
  </div>
</div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: "SellerSettling",
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
    sellerBlockchainUrl() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let bitcoinConfig = this.$store.getters["assetStore/getBitcoinConfig"];
      let txid = purchaseCycle.seller.chainData.txid;
      if (bitcoinConfig.chain === "test") {
        return "https://testnet.smartbit.com.au/tx/" + txid;
      }
      return "https://www.blockchain.com/btc/tx/" + txid;
    },
    sellerConfirmations() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      return purchaseCycle.seller.chainData.confirmations;
    },
  },
  methods: {
  }
};
</script>
