<template>
<div>
  <div class="mx-md-5">
    <div class="d-flex justify-content-start mb-3">Payment received with thanks.</div>
    <div class="d-flex justify-content-start mb-3" v-if="buyerConfirmations > 2"><a @click.prevent="showContactSeller = !showContactSeller"><u>Contact seller</u></a></div>
    <contact-seller :assetHash="assetHash" v-if="showContactSeller" />
  </div>
  <div class="mx-md-5 d-flex justify-content-around mb-3">
    <div><mdb-btn @click="paySeller" rounded color="white" size="sm" class="mx-0 waves-light">confirm goods received</mdb-btn></div>
  </div>
  <div class="mx-md-5">
    <div class="d-flex justify-content-between text-muted" v-if="confirmedBtc">
      <div v-if="buyerConfirmations > 5">Confirmations {{buyerConfirmations}} / 6 payment received with thanks.</div>
      <div v-else>Confirmations {{buyerConfirmations}} / 6 (apprx 1 hour)</div>
      <div class="text-muted"><a :href="buyerBlockchainUrl" target="_blank">Check chain <i class="fas fa-external-link-alt"></i></a></div>
    </div>
    <div class="mx-md-5 d-flex justify-content-between mb-3" v-else-if="confirmedLnd">
      <div>Invoice settled</div>
      <div class="text-muted"><a href="https://lightning.chaintools.io" target="_blank">Check chain <i class="fas fa-external-link-alt"></i></a></div>
    </div>
  </div>
</div>
</template>

<script>
import { mdbBtn } from "mdbvue";
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import moment from "moment";
import ContactSeller from "@/pages/components/orders/ContactSeller";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ConfirmationDetailsState5",
  components: {
    mdbBtn, ContactSeller
  },
  props: {
    assetHash: null,
    purchaseCycle: null,
    item: null
  },
  data() {
    return {
      showContactSeller: false,
    };
  },
  mounted() {
  },
  computed: {
    asset() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset;
    },
    buyerConfirmations() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      return purchaseCycle.buyer.chainData.confirmations;
    },
    confirmedLnd() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset.status === 5 && purchaseCycle.buyer.chainData.method === "lightning";
    },
    confirmedBtc() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset.status === 5 && purchaseCycle.buyer.chainData.method === "bitcoin";
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
    buyerBlockchainUrl() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let bitcoinConfig = this.$store.getters["assetStore/getBitcoinConfig"];
      let txid = purchaseCycle.buyer.chainData.txid;
      if (bitcoinConfig.chain === "test") {
        return `https://testnet.smartbit.com.au/tx/${txid}`;
      }
      return `https://www.blockchain.com/btc/tx/${txid}`;
    },
    paySeller() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      if (!purchaseCycle.seller.chainData.txid) {
        this.$emit("paySeller");
      }
    }
  }
};
</script>
