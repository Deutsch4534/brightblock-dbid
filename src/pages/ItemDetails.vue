<template>
<div class="d-flex justify-content-center" role="status" v-if="loading">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
<div class="container pt-5" v-else>
  <div class="row" v-if="!item">
    <div class="col-lg-5 col-xl-4 mb-4">
      Item not found - <router-link to="/">search for items</router-link>
    </div>
  </div>
  <div class="row" v-if="!orderStarted">
    <div class="col-lg-5 col-xl-4 mb-4">
      <item-image-list-view :item="item"/>
    </div>
    <div class="col-lg-7 col-xl-7 ml-xl-4 mb-4">
      <div class="d-flex">
        <div class="mr-auto"><h3 class="mb-3">{{item.title}}</h3></div>
      </div>
      <p class="grey-text"><description-container :text="item.description"/></p>
      <div class="d-flex text-muted justify-content-end mb-3"><small>Listed <!--by; <a class="font-weight-bold dark-grey-text">{{ownerProfile.name}}</a> --> on <span class="">{{created}}</span></small></div>
      <buyers-information-item-details :item="item" :asset="asset" action="buy" :myProfile="myProfile" @startPayment="startPayment"/>
    </div>
  </div>
  <div class="row" v-else>
    <div class="col-md-8 col-xs-12 offset-md-2">
      <div class=""><h3 class="mb-2">Purchase Order: {{item.title}}</h3></div>
      <div class="d-flex justify-content-end text-muted">
        <a class="text-primary" @click.prevent="toggleShippingAddress"><small>check buyer info</small></a>
        <a v-if="asset.status === 3" class="ml-3 text-danger" @click.prevent="cancelOrder(asset.assetHash)"><small>cancel order</small></a>
      </div>

      <crypto-address-tabs v-if="showAddress" :buyer="true" :myProfile="myProfile" @saveEmail="saveEmail" @saveAddress="saveAddress"/>
      <item-order-form v-else :item="item" :asset="asset" :myProfile="myProfile" @cancelOrder="cancelOrder"/>
    </div>
  </div>
</div>
</template>

<script>
import moment from "moment";
import utils from "@/services/utils";
import DescriptionContainer from "@/pages/components/utils/DescriptionContainer";
import ItemImageListView from "@/pages/components/myItem/ItemImageListView";
import BuyersInformationItemDetails from "@/pages/components/selling/BuyersInformationItemDetails";
import ItemOrderForm from "@/pages/components/orders/ItemOrderForm";
import CryptoAddressTabs from "@/pages/components/user-settings/CryptoAddressTabs";
import { mdbSpinner } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ItemDetails",
  components: {
    mdbSpinner, CryptoAddressTabs, DescriptionContainer, ItemImageListView, BuyersInformationItemDetails, ItemOrderForm
  },
  props: {
  },
  data() {
    return {
      loading: true,
      addressBlurb: "Needed to complete the sale - not shown to anyone else - including us!",
      myProfile: null,
      asset: null,
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
    this.$store.dispatch("myAccountStore/fetchMyAccount").then((myProfile) => {
      this.myProfile = myProfile;
      this.$store.dispatch("itemSearchStore/fetchItem", itemId).then((item) => {
        if (item) {
          this.item = item;
          let validity = this.$store.getters["myAccountStore/getProfileValidity"];
          if (!validity.emailValid || !validity.shippingValid || !validity.bitcoinValid) {
            this.showAddress = true;
          }
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
    });
  },
  methods: {
    startPayment: function(asset) {
      let validity = this.$store.getters["myAccountStore/getProfileValidity"];
      if (validity.emailValid && validity.shippingValid && validity.bitcoinValid) {
        this.asset = asset;
      } else {
        this.showAddress = true;
      }
    },
    saveEmail: function(email) {
      this.$notify({type: 'success', title: 'Address Info', text: 'Address updated.'});
    },
    saveAddress: function(address) {
      this.$notify({type: 'success', title: 'Address Info', text: 'Address updated.'});
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
      this.showAddress = !this.showAddress;
    },
  },
  computed: {
    created() {
      if (this.item.created) {
        return moment(this.item.created).format("YYYY-MM-DD HH:mm (Z)");
      }
      return;
    },
    validAddressInfo() {
      let validity = this.$store.getters["myAccountStore/getProfileValidity"];
      return validity.emailValid && validity.shippingValid;
    },
    orderStarted() {
      return this.asset.status > 0;
    },
  }
};
</script>
<style scoped>
</style>
