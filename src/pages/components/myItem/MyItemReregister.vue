<template>
<div class="d-flex justify-content-center" role="status" v-if="loading" style="height: 400px;">
  <div class="mask spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
<div class="row" v-else>
  <div class="col-lg-5 col-xl-4 mx-0 mb-4">
    <item-image-list-view :item="item"/>
  </div>
  <div class="col-lg-7 col-xl-8 mx-0 mb-4">
    <item-action-links :item="item" :itemAction="'register'" :asset="asset" :buttonMode="false"/>
    <p class="text-dark mx-0 px-0">Registered in bitcoin <span class="text-danger">{{bitcoinState.chain}}</span> blockchain in transaction;</p>
    <p class=""><small>Data Hash:<br/><span class="text-primary">{{itemHash}}</span></small></p>
    <p><small>Transaction:<br/><a class="text-primary" title="see full transaction data" :href="transactionUrl" target="_blank">{{asset.assetRegistrationTx}} <i class="ml-2 fas fa-external-link-alt"></i></a></small></p>
    <div class=" mb-3" v-if="showRecords"><h6 @click="showRecords = !showRecords">Hide Records of Ownership</h6></div>
    <div class=" mb-3" v-if="!showRecords"><h6 @click="showRecords = !showRecords">Show Records of Ownership</h6></div>
    <div class=" mb-5" v-if="showRecords">
      <p class="text-muted mb-3"><small>Files showing evidence of your ownership of this item. E.g. images / videos of you making the item, valuation reports, bills of sale, condition reports etc</small></p>
      <media-files-upload :readonly="true" :contentModel="contentModel2" :mediaFiles="mediaFilesRecords" :limit="5" :sizeLimit="3500" :mediaTypes="'image,doc'"/>
    </div>
    <a class="btn btn-block btn-primary text-white"  @click="unregisterItem()">Un-Register</a>
  </div>
</div>
</template>

<script>
import utils from "@/services/utils";
import moment from "moment";
import ItemImageListView from "./ItemImageListView";
import ItemActionLinks from "./ItemActionLinks";
import MediaFilesUpload from "@/pages/components/utils/MediaFilesUpload";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyItemReregister",
  components: {
    ItemImageListView, ItemActionLinks, MediaFilesUpload
  },
  props: {
    myProfile: null,
    assetHash: null,
    itemId: null
  },
  data() {
    return {
      message: null,
      loading: true,
      showRecords: false,
      loading: true,
      contentModel2: {
        title: null,
        errorMessage: "",
        popoverBody: "",
      },
    };
  },
  mounted() {
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
    myItemUrl() {
      return `/my-items/${this.item.id}`;
    },
    mediaFilesRecords() {
      let files = [];
      let item = this.$store.getters["myItemStore/myItem"](this.itemId);
      if (item.supportingDocuments && item.supportingDocuments.length  > 0) {
        files = item.supportingDocuments;
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
        let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
        let bitcoinState = this.$store.getters["assetStore/getBitcoinConfig"];
        if (bitcoinState) {
          chain = bitcoinState.chain;
        }
        if (chain === "test") {
          return `https://testnet.smartbit.com.au/tx/${asset.assetRegistrationTx}`;
        }
        return `https://www.blockchain.com/btc/tx/${asset.assetRegistrationTx}`;
      } catch (err) {
        return "#";
      }
    },
  },
  methods: {
    unregisterItem: function() {
      try {
        let item = this.$store.getters["myItemStore/myItem"](this.itemId);
        item.updated = moment({}).valueOf();
        item.bitcoinTx = null;
        item.coa = null;
        this.loading = true;
        this.$notify({type: 'info', title: 'Un-Register Item', text: 'Saving removing link to blockchain...'});
        this.$store.dispatch("myItemStore/updateItem", {item: item, updateProvData: false}).then(item => {
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
            this.$notify({type: 'error', title: 'Un-Register Item', text: 'Unable to un-register item at the moment - please try again later.'});
          }
        });
      } catch (err) {
        this.$notify({type: 'error', title: 'Un-Register Item', text: 'Unable to un-register item at the moment - please try again later.'});
        console.log(err);
      }
    },
    doBitcoinRegCall (asset) {
      asset.assetRegistrationTx = null;
      this.$store.dispatch("assetStore/unregisterAsset", asset).then(asset => {
        this.$notify({type: 'success', title: 'Un-Register Item', text: 'Un-registered item.'});
        this.loading = false;
      });
    },
  }
};
</script>
