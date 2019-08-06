<template>
<div class="d-flex justify-content-center" role="status" v-if="loading">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
<div id="my-app-element" class="container mt-4" v-else>
  <mdb-navbar expand="medium" color="blue-grey lighten-1" dark>
    <mdb-navbar-brand>
      <span class="text-white" style="font-weight: 500">Selling</span>
    </mdb-navbar-brand>
    <mdb-navbar-toggler >
      <mdb-navbar-nav right class="text-light">
          <router-link class="nav-link navbar-link btn" to="/my-item/upload" :class="activeTab === 2 ? 'btn-grey text-white font-weight-bolder' : 'btn-light text-dark'">New Listing</router-link>
          <router-link class="nav-link navbar-link btn" to="/my-items" :class="activeTab >= 3 ? 'btn-grey text-white font-weight-bolder' : 'btn-light text-dark'">My Listings</router-link>
          <!-- <router-link class="nav-link navbar-link btn" :to="myItemUrl" v-if="activeTab === 4" :class="activeTab === 4 ? 'btn-grey text-white font-weight-bolder' : 'btn-light text-dark'">{{listingLabel}}</router-link> -->
          <router-link class="nav-link navbar-link btn" to="/seller-info" :class="activeTab === 1 ? 'btn-grey text-white font-weight-bolder' : 'btn-light text-dark'" v-if="!validAddressInfo">Information Required <i class="fas fa-times text-warning ml-0"></i></router-link>
          <router-link class="nav-link navbar-link btn" to="/seller-info" :class="activeTab === 1 ? 'btn-grey text-white font-weight-bolder' : 'btn-light text-dark'" v-else>My Information <i class="fas fa-check text-success ml-0"></i></router-link>
      </mdb-navbar-nav>
    </mdb-navbar-toggler>
  </mdb-navbar>
  <div>
    <div v-if="loggedIn">
      <div v-if="activeTab === 1" style="min-height: 50vh;">
        <seller-info :myProfile="myProfile"/>
      </div>
      <div class="bg-card p-4 mb-4" v-if="activeTab === 2">
        <item-upload-form :formTitle="'New Item'" :itemId="itemId" :mode="'upload'" :myProfile="myProfile"/>
      </div>
      <div class="d-flex justify-content-start bg-card" v-if="activeTab === 3">
        <my-items :formTitle="'Listings'" :myProfile="myProfile" :itemAction="itemAction"/>
      </div>
      <div class="bg-card" v-if="activeTab === 4">
        <my-item :itemId="itemId" :myProfile="myProfile" :itemAction="itemAction"/>
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
import MyItems from "./components/myItem/MyItems";
import MyItem from "./components/myItem/MyItem";
import { mdbSpinner } from 'mdbvue';
import { mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Sell",
  bodyClass: "index-page",
  components: {
    mdbSpinner, SellerInfo, ItemUploadForm, MyItems, MyItem,
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
      myProfile: null,
      assetHash: null
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
          this.$store.dispatch("assetStore/checkAddress", btcaddr).then((result) => {
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
      } else if (routeName === "sell") {
        this.activeTab = 2;
        this.listingLabel = "Create"
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
      } else if (routeName === "unsold" || routeName === "buying" || routeName === "selling") {
        this.activeTab = 3;
        this.itemAction = routeName;
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
      } else if (routeName === "my-order") {
        this.listingLabel = "Purchase"
        this.itemAction = "my-order"
        this.activeTab = 4;
      }
      this.loading = false;
    }
  },
  computed: {
    loggedIn() {
      return (this.myProfile) ? this.myProfile.loggedIn : false;
    },
    validAddressInfo() {
      let validity = this.$store.getters["myAccountStore/getProfileValidity"];
      return validity.emailValid && validity.shippingValid && validity.bitcoinValid;
    },
    myItemUrl() {
      return `/my-items/${this.itemId}`;
    }
  },
};
</script>
<style scoped>
.btn {
  font-size: 1.1rem;
  padding: 4px 10px;
  margin: 2px 3px;
  text-transform: capitalize;
}
</style>
