<template>
<div class="container-fluid flex-1">
  <div class="d-flex justify-content-center bg-spinner" v-if="loading">
    <mdb-spinner big multicolor />
  </div>
  <div v-else>
    <div class="bg-card" v-if="!item">
      <div>404 - item not found</div>
    </div>
    <div class="bg-card" v-else>
      <my-item-manage v-if="itemAction === 'manage'" :item="item" :asset="asset" :myProfile="myProfile"/>
      <my-item-update v-else-if="itemAction === 'update'" :formTitle="'New Item'" :item="item" :mode="'upload'" :asset="asset" :myProfile="myProfile"/>
      <my-item-register v-else-if="itemAction === 'register'" :itemId="item.id" :asset="asset" :myProfile="myProfile"/>
      <my-item-coa v-else-if="itemAction === 'coa'" :item="item" :asset="asset" :myProfile="myProfile"/>
      <my-item-set-price v-else-if="itemAction === 'set-price'" :item="item" :asset="asset" :myProfile="myProfile"/>
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
import { mdbContainer, mdbRow,  mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, mdbCardImage, mdbMask, mdbIcon, mdbView, mdbBtn } from 'mdbvue';
import { mdbSpinner } from 'mdbvue';
import utils from "@/services/utils";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyItem",
  bodyClass: "index-page",
  components: {
    MyItemManage, MyItemRegister, MyItemCoa, MyItemSetPrice, MyItemUpdate,
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
    };
  },
  created() {
    let itemId = Number(this.$route.params.itemId);
    this.$store.dispatch("myItemStore/fetchMyItem", itemId).then((item) => {
      if (item) {
        this.item = item;
        this.$store.dispatch("myAccountStore/fetchMyAccount").then(myProfile => {
          this.myProfile = myProfile;
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
        });
      } else {
        this.loading = false;
      }
    });
  },
  methods: {
  },
};
</script>
