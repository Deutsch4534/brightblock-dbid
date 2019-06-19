<template>
<div class="container" v-if="loading">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
<div class="container" v-else>
  <div class="row" v-if="!item">
    <div class="col-lg-5 col-xl-4 mb-4">
      Item not found - <router-link to="/">search for items</router-link>
    </div>
  </div>
  <div class="row" v-else>
    <div class="col-lg-5 col-xl-4 mb-4">
      <item-image-list-view :item="item"/>
    </div>
    <div class="col-lg-7 col-xl-7 ml-xl-4 mb-4" v-if="orderStarted">
      <div class="d-flex">
        <div class="mr-auto"><h3 class="mb-3 font-weight-bold dark-grey-text"><strong>{{item.title}}</strong></h3></div>
      </div>
      <item-order-form :item="item" :asset="asset" :myProfile="myProfile" @cancelOrder="cancelOrder"/>
    </div>
    <div class="col-lg-7 col-xl-7 ml-xl-4 mb-4" v-else>
      <div class="d-flex">
        <div class="mr-auto"><h3 class="mb-3 font-weight-bold dark-grey-text"><strong>{{item.title}}</strong></h3></div>
      </div>
      <p class="grey-text"><description-container :text="item.description"/></p>
      <p>Listed <!--by; <a class="font-weight-bold dark-grey-text">{{ownerProfile.name}}</a> --> on <span class="font-weight-bold dark-grey-text">{{created}}</span></p>
      <buyers-information :item="item" :asset="asset" action="buy" :myProfile="myProfile" @startPayment="startPayment"/>
    </div>
  </div>
</div>
</template>

<script>
import moment from "moment";
import utils from "@/services/utils";
import DescriptionContainer from "@/pages/components/utils/DescriptionContainer";
import ItemImageListView from "@/pages/components/myItem/ItemImageListView";
import BuyersInformation from "@/pages/components/selling/BuyersInformation";
import ItemOrderForm from "@/pages/components/orders/ItemOrderForm";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ItemDetails",
  components: {
    DescriptionContainer, ItemImageListView, BuyersInformation, ItemOrderForm
  },
  props: {
  },
  data() {
    return {
      loading: true,
      myProfile: null,
      asset: null,
      item: {
        type: Object,
        default() {
          return {};
        }
      },
    };
  },
  mounted() {
    let itemId = Number(this.$route.params.itemId);
    this.$store.dispatch("itemSearchStore/fetchItem", itemId).then((item) => {
      if (item) {
        this.item = item;
        this.$store.dispatch("myAccountStore/fetchMyAccount").then((myProfile) => {
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
    startPayment: function(asset) {
      this.asset = asset;
    },
    cancelOrder(assetHash) {
      this.$store.dispatch("assetStore/cancelPurchase", assetHash).then((asset) => {
        this.asset = asset;
      });
    }
  },
  computed: {
    created() {
      if (this.item.created) {
        return moment(this.item.created).format("YYYY-MM-DD HH:mm (Z)");
      }
      return;
    },
    orderStarted() {
      return this.asset.status > 0;
    },
    ownerProfile() {
      let myProfile = this.$store.getters["userProfilesStore/getProfile"](this.item.owner);
      return myProfile ? myProfile : {};
    }
  }
};
</script>
<style scoped>
</style>
