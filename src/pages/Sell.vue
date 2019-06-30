<template>
<div class="d-flex justify-content-center" role="status" v-if="loading">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
<div id="my-app-element" class="container bg-spinner my-5" v-else>
  <div class=""> 
    <div v-if="loggedIn">
      <mdb-navbar color="primary" dark>
        <mdb-navbar-toggler>
          <mdb-navbar-nav class="text-light">
              <router-link class="nav-link navbar-link" to="/seller-info" :class="activeTab === 1 ? 'secondary' : 'primary'" v-if="sellerInfoNeeded">Seller Info <span class="text-danger">*</span></router-link>
              <router-link class="nav-link navbar-link" to="/seller-info" :class="activeTab === 1 ? 'secondary' : 'primary'" v-else>Seller Info</router-link>
              <router-link class="nav-link navbar-link" to="/my-item/upload" :class="activeTab === 2 ? 'secondary' : 'primary'">New Listing</router-link>
              <router-link class="nav-link navbar-link" to="/my-items" :class="activeTab === 3 ? 'secondary' : 'primary'">Listings</router-link>
              <router-link class="nav-link navbar-link" to="/my-orders" :class="activeTab === 5 ? 'secondary' : 'primary'">Purchases</router-link>
              <router-link class="nav-link navbar-link" :to="myItemUrl" v-if="activeTab === 4" :class="activeTab === 4 ? 'secondary' : 'primary'">{{listingLabel}}</router-link>
          </mdb-navbar-nav>
        </mdb-navbar-toggler>
      </mdb-navbar>

      <div v-if="activeTab === 1">
        <div class="d-flex justify-content-start bg-card" style="min-height: 50vh;">
          <seller-info :formTitle="'Update Seller Info'" :myProfile="myProfile" @sellerInfoUpdated="updateSellerState"/>
        </div>
      </div>
      <div v-if="activeTab === 2">
        <div class="bg-card">
          <item-upload-form :formTitle="'New Item'" :itemId="itemId" :mode="'upload'" :myProfile="myProfile"/>
        </div>
      </div>
      <div v-if="activeTab === 3">
        <div class="d-flex justify-content-start bg-card">
          <my-items :formTitle="'Listings'" :myProfile="myProfile"/>
        </div>
      </div>
      <div v-if="activeTab === 4">
        <div class="bg-card">
          <my-item :itemId="itemId" :myProfile="myProfile" :itemAction="itemAction"/>
        </div>
      </div>
      <div v-if="activeTab === 5">
        <div class="bg-card">
          <my-orders :myProfile="myProfile" :itemAction="itemAction"/>
        </div>
      </div>
    </div>
    <div v-else>
      <div><router-link to="/login">Please log in to continue..</router-link></div>
    </div>
  </div>
</div>
</template>

<script>
import SellerInfo from "./components/selling/SellerInfo";
import ItemUploadForm from "./components/myItem/ItemUploadForm";
import MyOrders from "./components/orders/MyOrders";
import MyItems from "./components/myItem/MyItems";
import MyItem from "./components/myItem/MyItem";
import { mdbSpinner } from 'mdbvue';
import { mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Sell",
  bodyClass: "index-page",
  components: {
    mdbSpinner, SellerInfo, ItemUploadForm, MyItems, MyItem, MyOrders,
    mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem
  },
  data() {
    return {
      loading: true,
      listingLabel: "Manage Item",
      updateOrUploadMode: "upload",
      itemAction: "manage",
      itemId: null,
      activeTab: 1,
      sellerInfoNeeded: false,
      myProfile: null,
    };
  },
  watch: {
    '$route' (to, from) {
      this.setView();
    }
  },
  mounted() {
    this.$store.dispatch("myAccountStore/fetchMyAccount").then((myProfile) => {
      this.myProfile = myProfile;
      let routeName = this.$route.name;
      if (routeName === "seller-info") {
        this.setView();
      } else {
        let btcaddr;
        if (myProfile.publicKeyData && myProfile.publicKeyData.rxAddressList) {
          btcaddr = myProfile.publicKeyData.rxAddressList[0].address;
        }
        if (btcaddr) {
          this.$store.dispatch("bitcoinStore/checkAddress", btcaddr).then((result) => {
            if (!result) {
              this.$router.push({ path: "/seller-info" });
            } else {
              this.activeTab = 2;
            }
            this.setView();
          });
        } else {
          this.$router.push({ path: "/seller-info" });
        }
      }
    });
  },
  methods: {
    updateSellerState: function() {
      this.activeTab = 2;

    },
    isSellerInfoComplete: function() {
      this.activeTab = 2;
    },
    setView: function() {
      let routeName = this.$route.name;
      this.updateOrUploadMode = "upload";
      this.itemId = null;
      if (routeName === "seller-info") {
        this.activeTab = 1;
        this.listingLabel = "Seller Info"
      } else if (routeName === "my-item-upload") {
        this.activeTab = 2;
        this.listingLabel = "Create"
      } else if (routeName === "my-item-update") {
        this.itemId = Number(this.$route.params.itemId);
        this.itemAction = "update";
        this.activeTab = 4;
        this.listingLabel = "Update"
      } else if (routeName === "my-items") {
        this.activeTab = 3;
        this.listingLabel = "Listings"
      } else if (routeName === "my-item-register") {
        this.activeTab = 4;
        this.itemAction = "register"
        this.listingLabel = "Register Item"
      } else if (routeName === "my-item-coa") {
        this.activeTab = 4;
        this.itemAction = "coa"
        this.listingLabel = "Certification"
      } else if (routeName === "my-item-set-price") {
        this.activeTab = 4;
        this.itemAction = "set-price"
        this.listingLabel = "Set Price"
      } else if (routeName === "my-item") {
        this.itemId = Number(this.$route.params.itemId);
        this.listingLabel = "Manage Item"
        this.itemAction = "manage"
        this.activeTab = 4;
      } else if (routeName === "my-orders") {
        this.listingLabel = "Purchases"
        this.itemAction = "orders"
        this.activeTab = 5;
      }
      this.loading = false;
    }
  },
  computed: {
    loggedIn() {
      return (this.myProfile) ? this.myProfile.loggedIn : false;
    },
    myItemUrl() {
      return `/my-items/${this.itemId}`;
    }
  },
};
</script>
<style scoped>
.primary {
  color: white;
}
.secodary {
  color: #EFF1F2;
  text-decoration: underline;
  font-size: 3.2rem;
}
</style>
