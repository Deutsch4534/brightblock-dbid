<template>
<div>
  <div>
    <textarea rows="5" class="form-control" v-model="sellerMessage"></textarea>
    <button class="btn btn-primary m-0 py-2 mt-2" @click="notifySeller">Send</button>
  </div>
</div>
</template>

<script>
import { mdbBtn } from "mdbvue";
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import moment from "moment";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ContactSeller",
  components: {
    mdbBtn
  },
  props: {
    assetHash: null
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
  },
  methods: {
    sellerMessageDef() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      let itemId = Number(asset.assetId.split("_::_")[1]);
      let itemTitle = asset.assetTitle;
      let msg = "Hey " + purchaseCycle.seller.did + ",";
      msg += "\n\nJust to let you know I just bought your item: " + itemTitle;
      msg += "\nPlease log in to complete shipping - I'll release the payment once I receive the goods.";
      msg += "\n\nBest wishes " + purchaseCycle.buyer.did + ",";
      return msg;
    },
    notifySeller() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      let text = this.sellerMessage;
      if (!text) {
        text = "One of your items on dbid.io has been sold: <br/><br/>" + this.item.title + "<br/><br/>please login <a href=\"https://dbid.io/my-orders/" + this.assetHash + "\">here for shipping details.</a>";
      }
      let data = {
        text: text,
        asset: asset
      };
      this.$store.dispatch("assetStore/notifySeller", data).then((result) => {
        this.$notify({type: 'success', title: 'Message Sent', text: 'Message has been sent to the seller.'});
      });
    },
  }
};
</script>
