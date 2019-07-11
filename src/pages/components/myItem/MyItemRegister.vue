<template>
<div class="row" v-if="!loading">
  <div class="col-lg-5 col-xl-4 mb-4">
    <item-image-list-view :item="item"/>
  </div>
  <div class="col-lg-7 col-xl-7 ml-xl-4 mb-4">
    <item-action-links :item="item" :itemAction="'register'" :asset="asset" :buttonMode="false"/>
    <p class="text-secondary"><a>Register on Blockchain</span></a></p>
    <p class="text-muted"><span v-if="bitcoinState">({{bitcoinState.chain}} chain)</span></p>
    <p class="grey-text">
      Registering your item provides strong evidence of your ownership.
      The process involves taking a cryptographic hash of the provenance data you've provided and
      storing this in a transaction on bitcoin.
    </p>
    <div class="form-row mb-3"><h5>Ownership Files</h5></div>
    <div class="form-row mb-5">
      <div id="vc-040-error" class="invalid-feedback">
        Please select some categories!
      </div>
      <media-files-upload :contentModel="contentModel2" :mediaFiles="mediaFilesRecords" :limit="5" :sizeLimit="2500" :mediaTypes="'image,doc'" @updateMedia="updateMediaRecords($event)"/>
    </div>
    <p class="grey-text">Once registered you can use dbidio tools to generate a Certificate of Authenticity for the item.</p>
    <div v-if="canRegister" class="d-flex justify-content-start">
      <a class="btn btn-primary text-white"  @click="registerItemBitcoin()">Register</a>
    </div>
    <div v-else-if="asset.assetRegistrationTx" class="d-flex justify-content-start">
      Your item has been registered on the bitcoin blockchain - <a @click.prevent="showTransaction = !showTransaction"><u>details</u></a>.
      <p class="mt-3 text-muted" v-if="showTransaction">
        Cryptographic hash: {{itemHash}}
        <br/>
        Transaction Id: <a :href="transactionUrl" target="_blank"><u>{{asset.assetRegistrationTx}}</u></a>
      </p>
    </div>
    <div v-else>
      Add ownership info.
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
  name: "Registration",
  components: {
    mdbPopover, ItemImageListView, ItemActionLinks, MediaFilesUpload
  },
  props: {
    itemId: null,
    myProfile: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      message: null,
      loading: true,
      showItemHash: false,
      showTransaction: false,
      loading: true,
      asset: {},
      assetHash: null,
      contentModel2: {
        title: null,
        errorMessage: "",
        popoverBody: "Provide bills of sale, receipts, images or video clips which prove your ownership (evidence of this data can optionally be stored in the blockchain).<br/><br/>Up to 5 images / documents.",
      },
    };
  },
  mounted() {
    this.item = this.$store.getters["myItemStore/myItem"](this.itemId);
    this.assetHash = utils.buildBitcoinHash(this.item);
    this.loading = false;
  },
  computed: {
    itemHash() {
      return utils.buildBitcoinHash(this.item);
    },
    canRegister() {
      let registered = this.asset.assetRegistrationTx;
      let hasDocs = this.item.supportingDocuments && this.item.supportingDocuments.length > 0;
      return !registered && hasDocs;
    },
    myItemUrl() {
      return `/my-items/${this.item.id}`;
    },
    mediaFilesRecords() {
      let files = [];
      if (this.item.supportingDocuments && this.item.supportingDocuments.length  > 0) {
        files = this.item.supportingDocuments;
      }
      return files;
    },
    bitcoinState() {
      let state = this.$store.getters["assetStore/getBitcoinConfig"];
      return state;
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
      this.item.supportingDocuments = mediaObjects.media;
    },
    doBitcoinRegCall (asset) {
      bitcoinService.registerAsset(asset).then(asset => {
        if (!asset || !asset.assetRegistrationTx) {
          this.$notify({type: 'error', title: 'Register Item', text: 'Unable to register item at the moment - please try again later.'});
        } else {
          this.asset = asset;
          item.bitcoinTx = asset.assetRegistrationTx;
          this.$store.dispatch("myItemStore/updateItem", {item: item, updateProvData: false});
          this.$notify({type: 'success', title: 'Register Item', text: 'Registered item on the bitcoin blockchain.'});
        }
      })
        .catch(err => {
          console.log(err);
          this.$notify({type: 'error', title: 'Register Item', text: 'Unable to register item at the moment - please try again later.'});
        });
    },
    registerItemBitcoin: function() {
      let item = this.item;
      try {
        this.item.updated = moment({}).valueOf();
        this.$store.dispatch("myItemStore/updateItem", {item: this.item, updateProvData: true}).then(item => {
          if (item) {
            this.item = item;
            if (this.asset && this.asset.assetId) {
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
