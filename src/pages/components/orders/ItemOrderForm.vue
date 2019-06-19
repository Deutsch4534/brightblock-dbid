<template>
<div>
  <div>
    <div class="col-12" v-if="showOrderDetails">
      <p class="text-muted"><span class="text-success">{{bitcoinConfig.chain}}</span> network</p>
      <p class="text-muted text-nowrap" style="width: 0.7rem;"><small>
      For lightning payments please open a channel from your lightning wallet to radpay lightning node:
      <br/><span id="payment-address" class="text-success">{{lightningPeer}}</span><a href="#" @click.prevent="copyAddress"><i class="fas fa-clone ml-4"></i></a>
      </small>
      </p>
      <order-details :purchaseCycle="purchaseCycle"/>
    </div>
    <order-item :item="item" :lightningConfig="lightningConfig" :assetHash="asset.assetHash" :myProfile="myProfile" @cancelOrder="cancelOrder"/>
  </div>
</div>
</template>

<script>
import OrderItem from "@/pages/components/orders/OrderItem";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ItemOrderForm",
  components: {
    OrderItem,
  },
  props: ["asset", "item", "myProfile"],
  data() {
    return {
      showOrderDetails: false,
    };
  },
  mounted() {
    this.$store.dispatch("assetStore/subscribeAssetPurchaseNews");
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
    cancelOrder() {
      this.$emit("cancelOrder", this.asset.assetHash);
    }
  },
  computed: {
    debugMode() {
      return this.$store.getters["isDebugMode"];
    },
    purchaseCycle() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.asset.assetHash);
      return purchaseCycle;
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
  }
};
</script>
<style>
</style>
