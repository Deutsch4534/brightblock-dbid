<template>
<div v-if="!loading">
  <div class="mx-md-5 mb-3" v-if="shippingAddress">
    <div class="mb-3">Please send goods to</div>
    <address-view :address="shippingAddress" />
  </div>
  <div class="mx-md-5">
    <div class="d-flex justify-content-between text-muted">
      <div>Confirmations {{buyerConfirmations}} / 6 (apprx 1 hour)</div>
      <div class="text-muted"><a :href="buyerBlockchainUrl" target="_blank">Check chain <i class="fas fa-external-link-alt"></i></a></div>
    </div>
  </div>
</div>
</template>

<script>
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import moment from "moment";
import AddressView from "@/pages/components/user-settings/AddressView";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ShippingRequired",
  components: {
    AddressView
  },
  props: {
    assetHash: null,
    myProfile: null
  },
  data() {
    return {
      loading: true,
    };
  },
  mounted() {
    let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
    this.$store.dispatch("userProfilesStore/fetchShippingDetails", {username: this.myProfile.username, buyer: purchaseCycle.buyer.did}).then(() => {
      this.loading = false;
    });
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
  }
};
</script>
