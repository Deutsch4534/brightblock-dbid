<template>
<div id="my-app-element" class="d-flex justify-content-center container bg-card p-5 text-center mt-5" v-if="loading">
  <mdb-spinner big multicolor />
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
  <div class="row mx-5" v-else>
    <div class="col-md-8 col-xs-12 offset-md-2">
      <div class=""><h3 class="mb-2">Purchase Order: {{item.title}}</h3></div>
      <div class="d-flex justify-content-end text-muted" v-if="addressValid">
        <a class="mr-3 text-primary" @click.prevent="toggleShippingAddress"><small>check shipping</small></a>
        <a class="mr-3 text-primary" @click.prevent="toggleEmailAddress"><small>check email</small></a>
      </div>
      <email-address-entry v-if="showEmailAddress" :addressTitle="'Email Address'" :addressBlurb="addressBlurb" :emailAddress="myProfile.auxiliaryProfile.emailAddress" @saveEmail="saveEmail"/>
      <address-form v-else-if="showAddress" :addressTitle="'Shipping Address'" :addressBlurb="''" :address="myProfile.auxiliaryProfile.shippingAddress" @saveAddress="saveAddress"/>
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
import AddressForm from "@/pages/components/user-settings/AddressForm";
import EmailAddressEntry from "@/pages/components/user-settings/EmailAddressEntry";
import { mdbSpinner } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ItemDetails",
  components: {
    mdbSpinner, AddressForm, EmailAddressEntry, DescriptionContainer, ItemImageListView, BuyersInformationItemDetails, ItemOrderForm
  },
  props: {
  },
  data() {
    return {
      loading: true,
      addressBlurb: "",
      myProfile: null,
      asset: null,
      addressValid: false,
      emailValid: false,
      showAddress: true,
      showEmailAddress: true,
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
          this.addressValid = this.isAddressValid();
          if (this.addressValid) {
            this.showAddress = false;
          } else {
            myProfile.auxiliaryProfile.shippingAddress = {};
          }
          if (this.isEmailValid()) {
            this.showEmailAddress = false;
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
      this.asset = asset;
    },
    upload: function() {
      let $self = this;
      this.$store.dispatch("myAccountStore/updateAuxiliaryProfile", this.myProfile.auxiliaryProfile)
        .then(auxiliaryProfile => {
          this.addressValid = true;
          this.showAddress = false;
          this.showEmailAddress = false;
          this.$notify({type: 'success', title: 'Address', text: 'Saved address.'});
        })
        .catch(() => {
          this.$notify({type: 'warning', title: 'Settings', text: 'Unable to update your settings at present.'});
        });
    },
    saveEmail: function(emailAddress) {
      this.myProfile.auxiliaryProfile.emailAddress = emailAddress;
      this.upload();
    },
    saveAddress: function(address) {
      if (!address) {
        address = {};
      }
      this.myProfile.auxiliaryProfile.shippingAddress = address;
      this.upload();
    },
    cancelOrder(assetHash) {
      this.$store.dispatch("assetStore/cancelPurchase", assetHash).then((asset) => {
        this.asset = asset;
      });
    },
    toggleShippingAddress() {
      this.showAddress = !this.showAddress;
      this.showEmailAddress = false;
    },
    toggleEmailAddress() {
      this.showEmailAddress = !this.showEmailAddress;
      this.showAddress = false;
    },
    isEmailValid() {
      if (!this.myProfile.auxiliaryProfile.emailAddress) {
        this.myProfile.auxiliaryProfile.emailAddress = {
          email: null,
          verified: false
        };
      }
      let ea = this.myProfile.auxiliaryProfile.emailAddress;
      if (!ea || !ea.email || !ea.verified) {
        return false;
      }
      return true;
    },
    isAddressValid() {
      let address = this.myProfile.auxiliaryProfile.shippingAddress;
      if (!address) {
        return false;
      }
      let valid = true;
      valid = valid && address && address.line1 && address.line1.length > 0;
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
  }
};
</script>
<style scoped>
</style>
