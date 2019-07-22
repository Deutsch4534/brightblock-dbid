<template>
<div class="">
  <div class="d-flex justify-content-center" role="status" v-if="loading">
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <div v-else>
    <div class="d-flex justify-content-center" role="status" v-if="notfound">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      Item not found.
    </div>
    <div class="bg-card" v-else>
      <buy-sell-tabs :myProfile="myProfile" :activeTab="currentItemAction" style="width: 100%;"/>
      <my-item-manage class="p-4" v-if="itemAction === 'manage'" :item="item" :asset="asset" :myProfile="myProfile"/>
      <my-item-update class="p-4" v-else-if="itemAction === 'update'" :formTitle="'New Item'" :item="item" :mode="'upload'" :asset="asset" :myProfile="myProfile"/>
      <my-item-register class="p-4" v-else-if="itemAction === 'register'" :itemId="item.id" :asset="asset" :myProfile="myProfile"/>
      <my-item-coa class="p-4" v-else-if="itemAction === 'coa'" :item="item" :asset="asset" :myProfile="myProfile"/>
      <my-item-set-price class="p-4" v-else-if="itemAction === 'set-price'" :item="item" :asset="asset" :myProfile="myProfile"/>
      <my-order class="mb-4" v-else-if="itemAction === 'my-order'" :myProfile="myProfile" :assetHash="asset.assetHash" :item="item"/>
    </div>
  </div>
</div>
</template>

<script>
import MyItemUpdate from "./MyItemUpdate";
import MyItemRegister from "./MyItemRegister";
import MyItemManage from "./MyItemManage";
import MyItemCoa from "./MyItemCoa";
import MyItemSetPrice from "./MyItemSetPrice";
import MyOrder from "@/pages/components/orders/MyOrder";
import { mdbContainer, mdbRow,  mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, mdbCardImage, mdbMask, mdbIcon, mdbView, mdbBtn } from 'mdbvue';
import { mdbSpinner } from 'mdbvue';
import utils from "@/services/utils";
import BuySellTabs from "@/pages/components/myItem/BuySellTabs";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyItem",
  bodyClass: "index-page",
  components: {
    BuySellTabs, MyOrder, MyItemManage, MyItemRegister, MyItemCoa, MyItemSetPrice, MyItemUpdate,
    mdbContainer,
    mdbRow,
    mdbCard,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbCardImage,
    mdbMask,
    mdbIcon,
    mdbView,
    mdbBtn, mdbSpinner
  },
  props: ["itemAction", "myProfile"],
  data() {
    return {
      item: null,
      asset: null,
      loading: true,
      notfound: false
    };
  },
  created() {
    let routeName = this.$route.name;
    if (routeName === "my-order") {
      let assetHash = this.$route.params.assetHash;
      this.fetchAssetItem(assetHash);
    } else {
      let itemId = Number(this.$route.params.itemId);
      this.fetchItemAsset(itemId);
    }
  },
  computed: {
    currentItemAction() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.asset.assetHash);
      if (purchaseCycle) {
        if (purchaseCycle.buyer.did === this.myProfile.username) {
          return "buyer";
        } else if (purchaseCycle.seller.did === this.myProfile.username) {
          return "seller";
        }
      }
      return this.itemAction;
    },
  },
  methods: {
    fetchItemAsset(itemId) {
      this.$store.dispatch("myItemStore/fetchMyItem", itemId).then((item) => {
        if (item) {
          this.item = item;
          let assetHash = utils.buildBitcoinHash(item);
          this.$store.dispatch("assetStore/lookupAssetByHash", assetHash).then(asset => {
            if (asset) {
              this.asset = asset;
              this.loading = false;
            } else {
              this.$store.dispatch("assetStore/initialiseAsset", item).then(asset => {
                this.asset = asset;
                this.loading = false;
              });
            }
          });
        } else {
          this.loading = false;
        }
      });
    },
    fetchAssetItem(assetHash) {
      this.$store.dispatch("assetStore/lookupAssetByHash", assetHash).then(asset => {
        if (asset) {
          this.asset = asset;
          this.$store.dispatch("myAccountStore/fetchMyAccount").then((myProfile) => {
            this.myProfile = myProfile;
            this.$store.dispatch("assetStore/subscribeAssetPurchaseNews", myProfile);
            let itemId = Number(asset.assetId.split("_::_")[1]);
            this.$store.dispatch("itemSearchStore/fetchItem", itemId).then((item) => {
              if (item) {
                this.item = item;
              } else {
                this.$notify({type: 'error', title: 'Purchase Order', text: 'Unable to find item.'});
                this.notfound = true;
              }
              this.loading = false;
            });
          });
        } else {
          this.$notify({type: 'error', title: 'Purchase Order', text: 'Unable to find item.'});
          this.loading = false;
          this.notfound = true;
        }
      });
    },
  },
};
</script>
