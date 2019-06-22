<template>
<div class="row">
  <div class="col-lg-5 col-xl-4 mb-4">
    <item-image-list-view :item="item"/>
  </div>
  <div class="col-lg-7 col-xl-7 ml-xl-4 mb-4">
    <item-action-links :item="item" :itemAction="'register'" :asset="asset" :buttonMode="false"/>
    <p><strong><a @click.prevent="" slot="reference">Register Item on Bitcoin Blockchain <span v-if="bitcoinState">({{bitcoinState.chain}} chain)</span></a></strong></p>
    <p class="grey-text">
      Registering your item on the blockchain is strong evidence of your ownership.
      The process involves taking a cryptographic hash of the provenance data you've provided and
      storing this in a transaction on bitcoin.
    </p>
    <p class="grey-text">Once registered you can use dbidio tools to generate a Certificate of Authenticity for the item.</p>
    <div v-if="!asset.assetRegistrationTx" class="d-flex justify-content-start">
      <a class="btn btn-primary btn-md waves-effect waves-light"  @click="registerItemBitcoin()" v-if="!item.bitcoinTx">Register</a>
    </div>
    <div v-else>
      Your item has been registered on the bitcoin blockchain - <a @click.prevent="showTransaction = !showTransaction"><u>details</u></a>.
      <p class="mt-3 text-muted" v-if="showTransaction">
        Cryptographic hash: {{itemHash}}
        <br/>
        Transaction Id: <a :href="transactionUrl" target="_blank"><u>{{asset.assetRegistrationTx}}</u></a>
      </p>
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

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Registration",
  components: {
    mdbPopover, ItemImageListView, ItemActionLinks
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    },
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
      itemId: null,
      showItemHash: false,
      showTransaction: false,
      loading: true,
      asset: {}
    };
  },
  mounted() {
    let $self = this;
    let assetHash = utils.buildBitcoinHash($self.item);
    this.$store.dispatch("assetStore/lookupAssetByHash", assetHash).then(asset => {
      if (asset) {
        $self.asset = asset;
        $self.loading = false;
      } else {
        $self.$store.dispatch("assetStore/initialiseAsset", $self.item).then(asset => {
          $self.asset = asset;
        });
        $self.loading = false;
      }
    });
  },
  computed: {
    itemHash() {
      return utils.buildBitcoinHash(this.item);
    },
    myItemUrl() {
      return `/my-items/${this.item.id}`;
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
    registerItemBitcoin: function() {
      let item = this.item;
      this.modal = true;
      try {
        bitcoinService.registerAsset(this.asset).then(asset => {
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
      } catch (err) {
        this.$notify({type: 'error', title: 'Register Item', text: 'Unable to register item at the moment - please try again later.'});
        console.log(err);
      }
    },
  }
};
</script>
