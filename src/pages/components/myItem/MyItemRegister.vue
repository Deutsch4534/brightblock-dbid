<template>
<div class="row">
  <div class="col-lg-5 col-xl-4 mb-4">
    <item-image-list-view :item="item"/>
  </div>
  <div class="col-lg-7 col-xl-7 ml-xl-4 mb-4">
    <div class="d-flex">
      <div class="mr-auto"><h3 class="mb-3 font-weight-bold dark-grey-text"><strong>{{item.title}}</strong></h3></div>
      <div><item-action-links :item="item" :itemAction="'manage'" :asset="asset" :buttonMode="false"/></div>
    </div>
    <p><strong><a @click.prevent="" slot="reference">Register Item on Bitcoin Blockchain <span v-if="bitcoinState">({{bitcoinState.chain}} chain)</span></a></strong></p>
    <p class="grey-text">
      We will create a piece of data that is unique to you and this item
      and store it the bitcoin blockchain where it can be used to prove your
      ownership. You'll then be able to generate a Certificate of Ownership.
      <br/><br/>
      <a @click.prevent="showItemHash = !showItemHash">Show this data!</a>
    </p>
    <p v-if="showItemHash">
      {{itemHash}}
    </p>
    <div v-if="!asset.assetRegistrationTx" class="d-flex justify-content-start">
      <a class="btn btn-primary btn-md waves-effect waves-light"  @click="registerItemBitcoin()" v-if="!item.bitcoinTx">Register</a>
    </div>
    <div v-else>
      asset registered in transaction {{asset.assetRegistrationTx}}
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
      showItemHash: null,
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
  },
  methods: {
    registerItemBitcoin: function() {
      let item = this.item;
      this.modal = true;
      try {
        let $self = this;
        this.$emit("registerBitcoin", {error: false, message: "Registering please wait.."});
        bitcoinService.registerAsset(asset).then(asset => {
          if (!asset || !asset.assetRegistrationTx) {
            $self.$emit("registerBitcoin", {error: true, message: "transaction failed - please try again later."});
          } else {
            $self.asset = asset;
            item.bitcoinTx = asset.assetRegistrationTx;
            $self.$store.dispatch("myItemStore/updateItem", {item: item, updateProvData: false});
            $self.$emit("registerBitcoin", {error: false, message: "Registered item on the bitcoin blockchain."});
          }
        })
          .catch(err => {
            console.log(err);
            $self.$emit("registerBitcoin", {failed: true, message: err.message});
          });
      } catch (err) {
        $self.$emit("registerBitcoin", {error: true, message: 'transaction failed - please try again later'});
        console.log(err);
      }
    },
  }
};
</script>
