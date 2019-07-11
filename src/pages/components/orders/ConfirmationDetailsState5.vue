<template>
<div class="bg-light mb-5 p-4">
  <div class="d-flex justify-content-center">
    <div class="d-flex justify-content-center text-capitalize">
      <h4>{{network}}&nbsp;<span class="text-danger">{{bitcoinConfig.chain}}</span>&nbsp;network</h4>
    </div>
  </div>
  <div class="mx-md-5">
    <div class="d-flex justify-content-start mb-3">Payment received with thanks.</div>
    <div class="d-flex justify-content-start mb-3"><a @click.prevent="showContactSeller = !showContactSeller"><u>Contact seller</u></a></div>
    <div v-if="showContactSeller">
      <textarea class="form-control" v-model="sellerMessage"></textarea>
      <p class="text-muted">Send a message to the seller</p>
      <a @click="checkForm($event)"><button class="btn btn-primary m-0 py-2" @click="notifySeller">Send</button></a>
    </div>
  </div>
  <div class="mx-md-5 d-flex justify-content-around mb-3">
    <div><mdb-btn @click="paySeller" rounded color="white" size="sm" class="mx-0 waves-light">confirm goods received</mdb-btn></div>
  </div>
  <div class="mx-md-5">
    <div class="d-flex justify-content-start mb-3 text-muted">Note: If the seller fails to send you your goods you will be given a full refund!</div>
    <div class="d-flex justify-content-end mb-3" v-if="confirmedBtc">
      <div class="text-muted"><a :href="buyerBlockchainUrl()" target="_blank">Check chain <i class="fas fa-external-link-alt"></i></a></div>
    </div>
    <div class="mx-md-5 d-flex justify-content-between mb-3" v-else-if="confirmedLnd">
      <div>Invoice settled</div>
      <div class="text-muted"><a href="https://lightning.chaintools.io" target="_blank">Check chain <i class="fas fa-external-link-alt"></i></a></div>
    </div>
  </div>
  <div class="mx-md-5 my-4">
    <div class="d-flex justify-content-center mb-3">Thank you for using dbid!</div>
  </div>
</div>
</template>

<script>
import { mdbBtn } from "mdbvue";
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import moment from "moment";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ConfirmationDetailsState5",
  components: {
    mdbBtn
  },
  props: {
    assetHash: null,
    purchaseCycle: null,
    item: null
  },
  data() {
    return {
      showContactSeller: false,
      sellerMessage: null,
    };
  },
  mounted() {
    this.sellerMessage = this.sellerMessageDef();
  },
  computed: {
    asset() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset;
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
    buyerBlockchainUrl() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let bitcoinConfig = this.$store.getters["assetStore/getBitcoinConfig"];
      let txid = purchaseCycle.buyer.chainData.txid;
      if (bitcoinConfig.chain === "test") {
        return `https://testnet.smartbit.com.au/tx/${txid}`;
      }
      return `https://www.blockchain.com/btc/tx/${txid}`;
    },
    sellerMessageDef() {
      let msg = "Hey " + this.purchaseCycle.seller.did + ",";
      msg += "\n\nJust to let you know I just bought your item: " + this.item.title;
      msg += "\nPlease log in to complete shipping - I'll release the payment once I receive the goods.";
      return msg;
    },
    notifySeller() {
      this.$emit("notifySeller", this.sellerMessage);
    },
    paySeller() {
      if (!this.purchaseCycle.seller.chainData.txid) {
        this.$emit("paySeller");
      }
    }
  }
};
</script>
