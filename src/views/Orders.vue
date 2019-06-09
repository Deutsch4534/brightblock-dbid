<template>
  <div class="container mt-5" v-if="loaded">
    <mdb-row>
      <div class="col-12 mb-3">
        <h2>Order History</h2>
        <p class="text-small">We are currently testing and are using bitcoin <span class="text-success">{{bitcoinConfig.chain}}</span> network to be on the safe side.
        <br/>For lightning payments please open a channel from your lightning wallet to radpay lightning node:
        <br/><span id="payment-address" class="text-success">{{lightningPeer}}</span><a href="#" @click.prevent="copyAddress"><i class="fas fa-clone ml-4"></i></a></p>
      </div>
    </mdb-row>
    <mdb-row v-if="!hasOrders">
      <div class="col-12 mb-5">
        <p class="h1-responsive mb-5">No orders found!</p>
        <p><router-link to="/my-artwork/upload" class="btn btn-white btn-sm btn-rounded ripple-parent">Upload Artwork</router-link> to get started...</p>
      </div>
    </mdb-row>
    <ul class="list-unstyled" v-else>
      <order-item v-for="asset in orders" :key="asset.assetHash" :lightningConfig="lightningConfig" :debugMode="debugMode" :assetHash="asset.assetHash" :myProfile="myProfile" />
    </ul>
  </div>
</template>

<script>
import OrderItem from "./components/orders/OrderItem";
import { mdbContainer, mdbCol, mdbRow, mdbIcon } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Orders",
  bodyClass: "index-page",
  components: {
    OrderItem,
    mdbContainer,
    mdbCol,
    mdbRow,
    mdbIcon
  },
  data() {
    return {
      assetHash: null,
      loaded: false,
      myProfile: null,
    };
  },
  mounted() {
    this.$store.dispatch("assetStore/subscribeAssetPurchaseNews");
    this.$store.dispatch("myAccountStore/fetchMyAccount").then((profile) => {
      this.myProfile = profile;
        this.$store.dispatch("assetStore/lookupAssetsByBuyer").then((assets) => {
          this.orders = assets;
          this.loaded = true;
        });
    });
  },
  methods: {
    copyAddress() {
      document.execCommand("copy");
      var copyText = document.getElementById("payment-address");
      var textArea = document.createElement("textarea");
      textArea.value = copyText.textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("Copy");
      this.$notify({type: 'success', title: 'Copied Address', text: 'Copied the address to clipboard: ' + textArea.value});
      textArea.remove();
    },
  },
  computed: {
    debugMode() {
      return this.$store.getters["isDebugMode"];
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
    lightningConfig() {
      let lightningConfig = this.$store.getters["assetStore/getLightningConfig"];
      return lightningConfig;
    },
    lightningPeer() {
      let lightningConfig = this.$store.getters["assetStore/getLightningConfig"];
      if (lightningConfig) {
        let alice = lightningConfig["alice"];
        return alice.pubkey + "@" + alice.nodeUri;
      }
    },
    hasOrders() {
      let orders = this.$store.getters["assetStore/getAssets"];
      if (!orders) {
        return 0;
      }
      return orders.length;
    }
  }
};
</script>
<style>
</style>
