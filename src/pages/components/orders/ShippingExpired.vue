<template>
<div>
  <div class="d-flex justify-content-start mb-3">The buyer has changed their mind.</div>
  <div class="">
    <p><router-link :to="myItemUrl" class="btn btn-primary text-white">Manage item</router-link></p>
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
    myProfile: null,
    itemId: null
  },
  data() {
    return {
      loading: true,
    };
  },
  mounted() {
    let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
  },
  computed: {
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
    myItemUrl() {
      return `/my-items/${this.itemId}`;
    },
  },
  methods: {
  }
};
</script>
