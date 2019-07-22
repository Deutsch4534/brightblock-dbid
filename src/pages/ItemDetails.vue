<template>
<div class="d-flex justify-content-center" role="status" v-if="loading">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
<div class="container" v-else>
  <div class="row" v-if="notfound">
    <div class="col-lg-5 col-xl-4 p-4 mb-4">
      Item not found - <router-link to="/">search for items</router-link>
    </div>
  </div>
  <div class="my-4" v-else>
    <mdb-navbar expand="medium" color="blue-grey lighten-1" dark style="min-height: 54px;">
      <mdb-navbar-toggler>
        <mdb-navbar-brand>
          <span style="font-weight: 500">
            Buy: {{item.title}}
          </span>
        </mdb-navbar-brand>
      </mdb-navbar-toggler>
    </mdb-navbar>
    <div class="d-flex bg-card p-4">
      <div class="col-lg-5 col-xl-4 mb-4">
        <item-image-list-view :item="item"/>
      </div>
      <div class="col-lg-7 col-xl-7 ml-xl-4 mb-4">
        <h4 class="mb-3" v-html="item.title"></h4>
        <p class="mb-3" v-html="item.description"></p>
        <div class="d-flex text-muted justify-content-between mb-3">
          <small><a class="font-weight-bold dark-grey-text">{{item.owner}}</a></small>
          <small>Listed on <span class="">{{created}}</span></small>
        </div>
        <div v-if="activeTab === 'not-selling'">
          <not-selling :itemId="item.id"/>
        </div>
        <div v-else-if="activeTab === 'under-offer'">
          <under-offer :itemId="item.id"/>
        </div>
        <div v-else-if="activeTab === 'start-buying'">
          <buy-action :item="item" :assetHash="assetHash" :myProfile="myProfile"/>
        </div>
        <div v-else-if="activeTab === 'start-bidding'">
          <bid-action :item="item" :assetHash="assetHash" :myProfile="myProfile" @continueBidding="continueBidding"/>
        </div>
        <div v-else-if="activeTab === 'ended-bidding'">
          <a class="btn btn-sm btn-primary text-white m-0">Bidding has ended on this item!</a>
        </div>
        <div v-else-if="activeTab === 'bidding-started'">
          <bid-action :item="item" :assetHash="assetHash" :myProfile="myProfile" @continueBidding="continueBidding"/>
        </div>
        <div v-else-if="activeTab === 'me-buying'">
          You are buying this item - please <router-link :to="purchaseUrl"><u>go here to complete the purchase</u></router-link>.
        </div>
        <div v-else-if="activeTab === 'me-selling'">
          Potential buyer online now - please visit <router-link :to="purchaseUrl"><u>here to complete the sale</u></router-link>.
        </div>
        <div v-else>
          <router-link class="btn btn-primary text-white" to="/login">Login to Continue</router-link>.
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
import NotSelling from "@/pages/components/selling/NotSelling";
import UnderOffer from "@/pages/components/selling/UnderOffer";

import BuyAction from "@/pages/components/selling/BuyAction";
import BidAction from "@/pages/components/selling/BidAction";
import SettingsTabs from "@/pages/components/user-settings/SettingsTabs";
import { mdbSpinner } from 'mdbvue';
import { mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ItemDetails",
  components: {
    mdbSpinner,
    BidAction, SettingsTabs, DescriptionContainer, ItemImageListView, BuyAction, NotSelling, UnderOffer,
    mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem
  },
  props: {
  },
  data() {
    return {
      loading: true,
      notfound: true,
      myProfile: null,
      assetHash: null,
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
    this.$store.dispatch("myAccountStore/fetchMyAccount").then((myProfile) => {
      this.myProfile = myProfile;
      this.$store.dispatch("assetStore/subscribeAssetPurchaseNews", myProfile);
      this.$store.dispatch("itemSearchStore/fetchItem", itemId).then((item) => {
        if (item) {
          this.item = item;
          this.notfound = false;
          this.assetHash = utils.buildBitcoinHash(item);
          this.$store.dispatch("assetStore/lookupAssetByHash", this.assetHash).then(asset => {
            if (asset) {
              this.loading = false;
              this.assetHash = asset.assetHash;
            } else {
              this.$store.dispatch("assetStore/initialiseAsset", item).then(asset => {
                this.loading = false;
                this.assetHash = asset.assetHash;
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
    paymentExpired() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      let now = moment({}).valueOf();
      let diff = now - purchaseCycle.created;
      return (100 - ((diff) / 1000));
      //return diff < 0;
    },
    continueBidding: function() {
      // this.asset = asset;
    },
  },
  computed: {
    created() {
      if (this.item.created) {
        //return moment(this.item.created).format("YYYY-MM-DD HH:mm (Z)");
        return moment(this.item.created).format("LLLL");
      }
      return;
    },
    purchaseUrl() {
      return "/my-orders/" + this.assetHash;
    },
    activeTab() {
      if (!this.myProfile.loggedIn) {
        return "login";
      }
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      if (this.buyerInfo) {
        return "buyer-info";
      }
      let activeTab = "not-selling";
      if (this.item.saleData.soid === 1) {
        activeTab = "start-buying";
      } else if (this.item.saleData.soid === 2) {
        let now = moment({}).valueOf();
        if (this.item.saleData.biddingEnds < now) {
          activeTab = "ended-bidding";
        } else {
          activeTab = "start-bidding";
        }
      }
      if (asset && asset.status > 0) {
        activeTab = "under-offer";
        let biddingStarted = (purchaseCycle && purchaseCycle.bidding);
        if (biddingStarted) {
          activeTab = "bidding-started";
        } else {
          let username = this.myProfile.username
          if (username === purchaseCycle.buyer.did) {
            if (this.paymentExpired() < 0) {
              this.$store.dispatch("assetStore/cancelPurchase", this.assetHash);
            }
            activeTab = "me-buying";
          } else if (username === purchaseCycle.seller.did) {
            activeTab = "me-selling";
            //this.$router.push("/my-sales/" + this.assetHash);
          }
        }
      }
      return activeTab;
    },
  }
};
</script>
<style scoped>
</style>
