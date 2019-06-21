<template>
<div id="my-app-element" class="container pt-5" v-if="loading">
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
      <p>Listed <!--by; <a class="font-weight-bold dark-grey-text">{{ownerProfile.name}}</a> --> on <span class="font-weight-bold dark-grey-text">{{created}}</span></p>
      <buyers-information :item="item" :asset="asset" action="buy" :myProfile="myProfile" @startPayment="startPayment"/>
    </div>
  </div>
  <div class="row mx-5" v-else>
    <div class="col-md-8 col-xs-12 offset-md-2">
      <div class=""><h3 class="mb-2">Purchase Order: {{item.title}}</h3></div>
      <div class="d-flex justify-content-end text-muted" v-if="addressValid">
        <a class="mr-3 text-primary" @click.prevent="showAddress = !showAddress"><small>check shipping</small></a>
        <a class="text-danger" @click.prevent="cancelOrder(asset.assetHash)"><small>cancel order</small></a>
      </div>
      <address-form v-if="showAddress" :addressBlurb="addressBlurb" :addressTitle="'Check Shipping Address'" :address="myProfile.auxiliaryProfile.shippingAddress" @saveAddress="saveAddress"/>
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
import BuyersInformation from "@/pages/components/selling/BuyersInformation";
import ItemOrderForm from "@/pages/components/orders/ItemOrderForm";
import AddressForm from "@/pages/components/user-settings/AddressForm";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ItemDetails",
  components: {
    AddressForm, DescriptionContainer, ItemImageListView, BuyersInformation, ItemOrderForm
  },
  props: {
  },
  data() {
    return {
      loading: true,
      addressBlurb: "No one (including us) but the seller can see your address.",
      myProfile: null,
      asset: null,
      addressValid: false,
      showAddress: true,
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
          this.addressValid = this.isAddressValid();
          if (this.addressValid) {
            this.showAddress = false;
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
    saveAddress: function(address) {
      this.myProfile.auxiliaryProfile.shippingAddress = address;
      this.$store.dispatch("myAccountStore/updateAuxiliaryProfile", this.myProfile.auxiliaryProfile)
        .then(auxiliaryProfile => {
          this.addressValid = true;
          this.showAddress = false;
          this.$notify({type: 'success', title: 'Address', text: 'Saved address.'});
        })
        .catch(() => {
          this.$notify({type: 'warning', title: 'Address', text: 'Unable to update your address at present.'});
        });
    },
    cancelOrder(assetHash) {
      this.$store.dispatch("assetStore/cancelPurchase", assetHash).then((asset) => {
        this.asset = asset;
      });
    },
    isAddressValid() {
      let address = this.myProfile.auxiliaryProfile.shippingAddress;
      if (!address) {
        return false;
      }
      let valid = address.line1 && address.line1.length > 0;
      valid = valid && address.city && address.city.length > 0;
      valid = valid && address.region && address.region.length > 0;
      valid = valid && address.postcode && address.postcode.length > 0;
      return valid;
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
