<template>
<div class="d-flex justify-content-center" role="status" v-if="loading">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
<div class="container pt-5" v-else>

  <div class="row" v-if="notfound">
    <div class="col-lg-5 col-xl-4 mb-4">
      Item not found - <router-link to="/">search for items</router-link>
    </div>
  </div>
  <div v-else>
  <div class="row" v-if="!buyNowStarted && !biddingStarted">
    <div class="col-lg-5 col-xl-4 mb-4">
      <item-image-list-view :item="item"/>
    </div>
    <div class="col-lg-7 col-xl-7 ml-xl-4 mb-4">
      <div class="d-flex">
        <div class="mr-auto"><h3 class="mb-3">{{item.title}}</h3></div>
      </div>
      <p class="grey-text"><description-container :text="item.description"/></p>
      <div class="d-flex text-muted justify-content-end mb-3"><small>Listed <!--by; <a class="font-weight-bold dark-grey-text">{{ownerProfile.name}}</a> --> on <span class="">{{created}}</span></small></div>
      <a v-if="biddingEnabled" class="btn btn-sm btn-primary text-white m-0" @click.prevent="startBidding">Start the Bidding!</a>
      <buy-action v-else :item="item" :asset="asset" :myProfile="myProfile" @startPayment="startPayment"/>
    </div>
  </div>
  <div class="row" v-else-if="buyNowStarted">
    <div class="col-md-8 col-xs-12 offset-md-2">
      <div class=""><h5 class="mb-2">Purchase Order: {{item.title}}</h5></div>
      <div class="d-flex justify-content-end text-muted">
        <a class="text-primary" @click.prevent="showOrderDetails = !showOrderDetails"><small>order details</small></a>
        <a class="text-primary ml-3" @click.prevent="toggleShippingAddress"><small>check buyer info</small></a>
        <a v-if="assetStatus === 3" class="ml-3 text-danger" @click.prevent="cancelOrder(asset.assetHash)"><small>cancel order</small></a>
      </div>
      <settings-tabs v-if="showAddress" :tabList="tabList" :myProfile="myProfile" @saveEmail="saveEmail" @saveAddress="saveAddress"/>
      <div v-else>
        <order-details class="bg-card mb-4" v-if="showOrderDetails" :item="item" :purchaseCycle="purchaseCycle"/>
        <order-item class="bg-card mb-5" :item="item" :assetHash="asset.assetHash" :myProfile="myProfile" @cancelOrder="cancelOrder"/>
      </div>
    </div>
  </div>
  <div class="row" v-else-if="biddingStarted">
    <div class="col-md-8 col-xs-12 offset-md-2">
      <div class=""><h5 class="mb-2">Purchase Order: {{item.title}}</h5></div>
      <div class="d-flex justify-content-end text-muted">
        Bidding Started
      </div>
      <settings-tabs v-if="showAddress" :tabList="tabList" :myProfile="myProfile" @saveEmail="saveEmail" @saveAddress="saveAddress"/>
      <div v-else>
        <bid-action v-if="biddingEnabled" :item="item" :asset="asset" :myProfile="myProfile" @continueBidding="continueBidding"/>
      </div>
    </div>
  </div>
  </div>
</div>
</template>

<script>
import moment from "moment";
import utils from "@/services/utils";
import DescriptionContainer from "@/pages/components/utils/DescriptionContainer";
import ItemImageListView from "@/pages/components/myItem/ItemImageListView";
import BuyAction from "@/pages/components/selling/BuyAction";
import BidAction from "@/pages/components/selling/BidAction";
import OrderItem from "@/pages/components/orders/OrderItem";
import OrderDetails from "@/pages/components/orders/OrderDetails";
import SettingsTabs from "@/pages/components/user-settings/SettingsTabs";
import { mdbSpinner } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ItemDetails",
  components: {
    mdbSpinner,
    BidAction, SettingsTabs, DescriptionContainer, ItemImageListView, BuyAction, OrderItem, OrderDetails,
  },
  props: {
  },
  data() {
    return {
      loading: true,
      notfound: true,
      tabList: ["notifications", "shipping", "payments"],
      showOrderDetails: false,
      addressBlurb: "Needed to complete the sale - not shown to anyone else - including us!",
      myProfile: null,
      asset: null,
      assetHash: null,
      addressValid: false,
      emailValid: false,
      showAddress: false,
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
    this.$store.dispatch("assetStore/subscribeAssetPurchaseNews");
    this.$store.dispatch("myAccountStore/fetchMyAccount").then((myProfile) => {
      this.myProfile = myProfile;
      this.$store.dispatch("itemSearchStore/fetchItem", itemId).then((item) => {
        if (item) {
          this.item = item;
          this.notfound = false;
          let validity = this.$store.getters["myAccountStore/getProfileValidity"];
          if (!validity.emailValid || !validity.shippingValid || !validity.bitcoinValid) {
            this.showAddress = true;
          }
          let assetHash = utils.buildBitcoinHash(item);
          this.assetHash = assetHash;
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
    });
  },
  methods: {
    startPayment: function(asset) {
      this.asset = asset;
      let validity = this.$store.getters["myAccountStore/getProfileValidity"];
      if (validity.emailValid && validity.shippingValid && validity.bitcoinValid) {
        this.showAddress = false;
      }
    },
    startBidding: function(asset) {
      this.$store.dispatch("assetStore/initialisePayment", {bidding: true, asset: this.asset, item: this.item}).then(asset => {
        if (!asset) {
          this.$notify({type: 'error', title: 'Place Order', text: 'Unable to start bidding at present.'});
        }
      });
    },
    continueBidding: function(asset) {
      this.asset = asset;
      let validity = this.$store.getters["myAccountStore/getProfileValidity"];
      if (validity.emailValid && validity.shippingValid && validity.bitcoinValid) {
        this.showAddress = false;
      }
    },
    saveEmail: function(email) {
      // this.$notify({type: 'success', title: 'Address Info', text: 'Address updated.'});
    },
    saveAddress: function(address) {
      // this.$notify({type: 'success', title: 'Address Info', text: 'Address updated.'});
    },
    cancelAddress: function() {
      this.showAddress = false;
    },
    cancelOrder(assetHash) {
      this.$store.dispatch("assetStore/cancelPurchase", assetHash).then((asset) => {
        this.asset = asset;
      });
    },
    toggleShippingAddress() {
      let validity = this.$store.getters["myAccountStore/getProfileValidity"];
      if (!validity.emailValid || !validity.shippingValid || !validity.bitcoinValid) {
        this.showAddress = true;
        this.$notify({type: 'warning', title: 'Information Needed', text: 'Please enter the info needed to proceed with the buying / selling - this data is completely private and only used as needed to complete a sale.'});
      } else {
        this.showAddress = !this.showAddress;
      }
    },
  },
  computed: {
    created() {
      if (this.item.created) {
        return moment(this.item.created).format("YYYY-MM-DD HH:mm (Z)");
      }
      return;
    },
    buyNowStarted() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.asset.assetHash);
      let buyNowStarted = (purchaseCycle && !purchaseCycle.bidding);
      return this.asset.status > 0 && buyNowStarted;
    },
    biddingStarted() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.asset.assetHash);
      let biddingStarted = (purchaseCycle && purchaseCycle.bidding);
      return this.asset.status > 0 && biddingStarted;
    },
    biddingEnabled() {
      return this.item.saleData.soid === 2;
    },
    purchaseCycle() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.asset.assetHash);
      return purchaseCycle;
    },
    assetStatus() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      if (asset) {
        return asset.status;
      }
      return -1;
    },
    validAddressInfo() {
      let validity = this.$store.getters["myAccountStore/getProfileValidity"];
      return validity.emailValid && validity.shippingValid;
    },
  }
};
</script>
<style scoped>
</style>
