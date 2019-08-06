<template>
<div class="d-flex justify-content-center" role="status" v-if="loading" style="height: 400px;">
  <div class="mask spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
<div class="row" v-else>
  <div class="col-lg-5 col-xl-4 mb-4">
    <item-image-list-view :item="item"/>
  </div>
  <div class="col-lg-7 col-xl-7 ml-xl-4 mb-4">
    <item-action-links :item="item" :itemAction="'register'" :asset="asset" :buttonMode="false"/>
    <p class="text-secondary">Register on bitcoin {{bitcoinState.chain}} blockchain</p>
    <p class=""><small>Data Hash:<br/><span class="text-primary">{{itemHash}}</span></small></p>
    <div class="mb-3"><h6>Ownership Files</h6></div>
    <p class="text-muted mb-3"><small>Upload files showing evidence of your ownership of this item. E.g. images / videos of you making the item, valuation reports, bills of sale, condition reports etc</small></p>
    <div class="mb-5">
      <div id="vc-040-error" class="invalid-feedback">
        Please select some categories!
      </div>
      <media-files-upload :contentModel="contentModel2" :mediaFiles="mediaFilesRecords" :limit="5" :sizeLimit="3500" :mediaTypes="'image,doc'" @updateMedia="updateMediaRecords($event)"/>
    </div>
    <div v-if="canRegister" class="d-flex justify-content-start">
      <a class="btn btn-block btn-primary text-white"  @click="registerItemBitcoin()">Register</a>
    </div>
  </div>
</div>
</template>

<script>
import utils from "@/services/utils";
import notify from "@/notify";
import moment from "moment";
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import { mdbPopover } from "mdbvue";
import ItemImageListView from "./ItemImageListView";
import ItemActionLinks from "./ItemActionLinks";
import MediaFilesUpload from "@/pages/components/utils/MediaFilesUpload";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyItemRegister",
  components: {
    mdbPopover, ItemImageListView, ItemActionLinks, MediaFilesUpload
  },
  props: {
    myProfile: null,
    assetHash: null,
    itemId: null
  },
  data() {
    return {
      message: null,
      supportingDocuments: null,
      loading: true,
      showRecords: false,
      showTransaction: false,
      loading: true,
      contentModel2: {
        title: null,
        errorMessage: "",
        popoverBody: "Provide bills of sale, receipts, images or video clips which prove your ownership (evidence of this data can optionally be stored in the blockchain).<br/><br/>Up to 5 images / documents.",
      },
    };
  },
  mounted() {
    let item = this.$store.getters["myItemStore/myItem"](this.itemId);
    this.supportingDocuments = item.supportingDocuments;
    this.loading = false;
  },
  computed: {
    itemHash() {
      let item = this.$store.getters["myItemStore/myItem"](this.itemId);
      return utils.buildBitcoinHash(item);
    },
    item() {
      return this.$store.getters["myItemStore/myItem"](this.itemId);
    },
    asset() {
      return this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
    },
    canRegister() {
      let hasDocs = this.supportingDocuments && this.supportingDocuments.length > 0;
      return hasDocs;
    },
    myItemUrl() {
      return `/my-items/${this.item.id}`;
    },
    mediaFilesRecords() {
      let item = this.$store.getters["myItemStore/myItem"](this.itemId);
      let files = [];
      if (item.supportingDocuments && item.supportingDocuments.length  > 0) {
        files = this.item.supportingDocuments;
      }
      return files;
    },
    bitcoinState() {
      let bitcoinConfig = this.$store.getters["assetStore/getBitcoinConfig"];
      return bitcoinConfig;
    },
    transactionUrl() {
      try {
        let chain = "test";
        let bitcoinState = this.$store.getters["assetStore/getBitcoinConfig"];
        if (bitcoinState) {
          chain = bitcoinState.chain;
        }
        if (chain === "test") {
          return `https://testnet.smartbit.com.au/tx/${this.asset.assetRegistrationTx}`;
        }
        return `https://www.blockchain.com/btc/tx/${this.asset.assetRegistrationTx}`;
      } catch (err) {
        return "#";
      }
    },
  },
  methods: {
    updateMediaRecords (mediaObjects) {
      this.supportingDocuments = mediaObjects.media;
    },
    doBitcoinRegCall (asset) {
      this.$store.dispatch("assetStore/registerAsset", asset).then(asset => {
        let item = this.$store.getters["myItemStore/myItem"](this.itemId);
        item.bitcoinTx = asset.assetRegistrationTx;
        this.$store.dispatch("myItemStore/updateItem", {item: item, updateProvData: false});
        this.$notify({type: 'success', title: 'Register Item', text: 'Registered item on the bitcoin blockchain.'});
        this.loading = false;
      });
    },
    registerItemBitcoin: function() {
      try {
        let item = this.$store.getters["myItemStore/myItem"](this.itemId);
        item.updated = moment({}).valueOf();
        item.supportingDocuments = this.supportingDocuments;
        this.$notify({type: 'info', title: 'Register Item', text: 'Saving files... please allow a minute or so'});
        this.loading = true;
        this.$store.dispatch("myItemStore/updateItem", {item: item, updateProvData: true}).then(item => {
          if (item) {
            let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
            if (asset && asset.assetId) {
              this.doBitcoinRegCall(asset);
            } else {
              this.$store.dispatch("assetStore/initialiseAsset", item).then(asset => {
                this.doBitcoinRegCall(asset);
              });
            }
          } else {
            this.$notify({type: 'error', title: 'Register Item', text: 'Unable to register item at the moment - please try again later.'});
          }
        });
      } catch (err) {
        this.$notify({type: 'error', title: 'Register Item', text: 'Unable to register item at the moment - please try again later.'});
        console.log(err);
      }
    },
  }
};
</script>
