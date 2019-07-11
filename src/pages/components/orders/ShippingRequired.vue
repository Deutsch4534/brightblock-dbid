<template>
<div class="bg-light mb-5 p-4" v-if="!loading">
  <div class="d-flex justify-content-center">
    <div class="d-flex justify-content-center">
      <h4>{{network}}&nbsp;<span class="text-danger">{{bitcoinConfig.chain}}</span>&nbsp;network</h4>
    </div>
  </div>
  <div class="mx-md-5">
    <div class="d-flex justify-content-start mb-3">Buyers payment is confirmed!</div>
    <div class="d-flex justify-content-start mb-3">Please send to</div>
    <div class="d-flex justify-content-start mb-3" v-if="shippingAddress"><address-view :address="shippingAddress" /></div>
  </div>
  <div class="mx-md-5 my-4">
    <div class="d-flex justify-content-center mb-3">Thank you for using dbid!</div>
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
    shippingAddress() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let profile = this.$store.getters['userProfilesStore/getProfile'](purchaseCycle.buyer.did);
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
  }
};
</script>
