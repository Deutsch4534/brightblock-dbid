<template>
<div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <!-- <p><a href="#" @click.prevent="showBlockchainInfo = !showBlockchainInfo">Open full details</a></p> -->
        <div class="mb-4" v-if="showBlockchainInfo">
          <div class="row">
            <div class="col-3">Network</div>
            <div class="col-6">{{bitcoinState.chain}}</div>
          </div>
          <div class="row">
            <div class="col-3">Transactions</div>
            <div class="col-6"><a :href="registerBlockchainUrl()" target="_blank">Provenance</a></div>
          </div>
          <div class="row" v-if="purchaseCycle.buyer.chainData.txid">
            <div class="col-3"></div>
            <div class="col-6"><a :href="buyerBlockchainUrl()" target="_blank">Payment</a></div>
          </div>
          <div class="row" v-if="purchaseCycle.seller.chainData.txid">
            <div class="col-3"></div>
            <div class="col-6"><a :href="sellerBlockchainUrl()" target="_blank">Settlement</a></div>
          </div>
        </div>
        <div class="mt-4 pt-2"><h6>Order</h6></div>
        <div>Created: {{timeReceived}}</div>
        <div v-if="unpaid">Payment not yet received</div>
        <div v-else-if="confirmingBtc"><a :href="buyerBlockchainUrl()" target="_blank">Payment received</a><br/>(confirming - {{buyerConfirmations}} / 6) <!-- <mdb-icon icon="sync-alt" @click="sendRefreshRequest"/> --></div>
        <div v-else-if="confirmingLnd"><a href="https://lightning.chaintools.io/" target="_blank">Payment received</a><br/>(invoice - unfulfilled)</div>
        <div v-else-if="confirmedBtc">
          <a :href="buyerBlockchainUrl()" target="_blank">Payment has been confirmed</a><br/>(with {{buyerConfirmations}} confirmations)
          <div><mdb-btn @click="paySeller" rounded color="white" size="sm" class="mx-0 waves-light">pay seller</mdb-btn></div>
        </div>
        <div v-else-if="confirmedLnd">
          <a href="https://lightning.chaintools.io/" target="_blank">Invoice settled</a>
          <div><mdb-btn @click="paySeller" rounded color="white" size="sm" class="mx-0 waves-light">pay seller</mdb-btn></div>
        </div>
        <div v-else-if="settling">Transferring <a :href="sellerBlockchainUrl()" target="_blank">{{sellerConfirmations}} / 6 confirmations</a></div>
        <div v-else-if="settled">Transferred <a :href="sellerBlockchainUrl()" target="_blank">{{sellerConfirmations}} confirmations</a></div>
        <div v-else>
          <div>status in between</div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import { mdbPopover, mdbIcon, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import { mdbTbl, mdbTblHead, mdbTblBody } from 'mdbvue';
import bitcoinService from "@/services/bitcoinService";
import moment from "moment";
import myArtworksService from "@/services/myArtworksService";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ConfirmationDetails",
  components: {
    mdbCardBody,
    mdbPopover,
    mdbIcon,
    mdbCardTitle,
    mdbCardText,
    mdbBtn,
    mdbTbl,
    mdbTblHead,
    mdbTblBody
  },
  props: {
    assetHash: null,
    purchaseCycle: null,
    debugMode: false
  },
  data() {
    return {
      bitcoinState: {},
      showBlockchainInfo: false,
      showInstructions: false,
      showPaymentDetails: false,
      order: null,
    };
  },
  mounted() {
    this.bitcoinState = this.$store.getters["assetStore/getBitcoinConfig"];
  },
  computed: {
    buyerConfirmations() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      return purchaseCycle.buyer.chainData.confirmations;
    },
    asset() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset;
    },
    sellerConfirmations() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      try {
        return purchaseCycle.seller.chainData.confirmations;
      } catch (err) {
        return 0;
      }
    },
    settled() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset.status === 7;
    },
    settling() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset.status === 6;
    },
    confirmingBtc() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset.status === 4 && purchaseCycle.buyer.chainData.method === "bitcoin";
    },
    confirmingLnd() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset.status === 4 && purchaseCycle.buyer.chainData.method === "lightning";
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
    unpaid() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset.status < 4;
    },
    confirmations() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      return purchaseCycle.buyer.chainData.confirmations;
    },
    digiArt() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset.assetType === "digital";
    },
    timeReceived() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      let date = moment(asset.created).format(moment.HTML5_FMT.DATE);
      let time = moment(asset.created).format(moment.HTML5_FMT.TIME);
      return date + " " + time
    }
  },
  methods: {
    registerBlockchainUrl() {
      if (this.bitcoinState.chain === "test") {
        return `https://testnet.smartbit.com.au/tx/${this.registerTx}`;
      }
      return `https://www.blockchain.com/btc/tx/${this.registerTx}`;
    },
    buyerBlockchainUrl() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let txid = purchaseCycle.buyer.chainData.txid;
      if (this.bitcoinState.chain === "test") {
        return `https://testnet.smartbit.com.au/tx/${txid}`;
      }
      return `https://www.blockchain.com/btc/tx/${txid}`;
    },
    sellerBlockchainUrl() {
      try {
        let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
        let txid = purchaseCycle.seller.chainData.txid;
        if (this.bitcoinState.chain === "test") {
          return `https://testnet.smartbit.com.au/tx/${txid}`;
        }
        return `https://www.blockchain.com/btc/tx/${txid}`;
      } catch (err) {
        return null;
      }
    },
    sendBuyNow() {
      this.$emit("buyNow");
    },
    sendRefreshRequest() {
      // this.$emit("buyNow");
    },
    paySeller() {
      if (!this.purchaseCycle.seller.chainData.txid) {
        this.$emit("paySeller");
      }
      return "payment sent..";
    }
  }
};
</script>
