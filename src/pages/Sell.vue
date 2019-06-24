<template>
<div id="my-app-element" class="container my-5">
  <div class="container bg-card p-5 text-center" role="status" v-if="loading">
    <div class="container spinner-border text-center" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <div class="container my-5" v-else>
    <div v-if="loggedIn">
      <div class="d-flex text-primary text-white border-bottom mb-5">
        <div class="p-2 px-4 border-right" :class="activeTab === 1 ? 'text-secondary' : 'text-primary'" v-if="sellerInfoNeeded"><router-link to="/seller-info">Seller Info - Required</router-link></div>
        <div class="p-2 px-4 border-right" :class="activeTab === 1 ? 'text-secondary' : 'text-primary'" v-else><router-link to="/seller-info">Seller Info</router-link></div>
        <div class="py-2 px-4 border-right" :class="activeTab === 2 ? 'text-secondary' : 'text-primary'"><router-link to="/my-item/upload">New Listing</router-link></div>
        <div class="py-2 px-4 border-right" :class="activeTab === 3 ? 'text-secondary' : 'text-primary'"><router-link to="/my-items">Listings</router-link></div>
        <div v-if="activeTab === 4" class="py-2 px-4 border-right" :class="activeTab === 4 ? 'text-secondary' : 'text-primary'"><router-link :to="myItemUrl">{{listingLabel}}</router-link></div>
      </div>
      <div v-if="activeTab === 1">
        <div class="d-flex justify-content-center bg-card">
          <seller-info :formTitle="'Update Seller Info'" :myProfile="myProfile" @sellerInfoUpdated="updateSellerState"/>
        </div>
      </div>
      <div v-if="activeTab === 2">
        <div class="d-flex justify-content-center bg-card">
          <item-upload-form :formTitle="'New Item'" :itemId="itemId" :mode="'upload'" :myProfile="myProfile"/>
        </div>
      </div>
      <div v-if="activeTab === 3">
        <div class="d-flex justify-content-start bg-card">
          <my-items :formTitle="'Listings'" :myProfile="myProfile"/>
        </div>
      </div>
      <div v-if="activeTab === 4">
        <div class="d-flex justify-content-start mb-5">
          <my-item :itemId="itemId" :myProfile="myProfile" :itemAction="itemAction"/>
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
import MyItems from "./components/myItem/MyItems";
import MyItem from "./components/myItem/MyItem";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Sell",
  bodyClass: "index-page",
  components: {
    SellerInfo, ItemUploadForm, MyItems, MyItem
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
        if (myProfile.publicKeyData.bitcoinAddress) {
          this.$store.dispatch("bitcoinStore/checkAddress", myProfile.publicKeyData.bitcoinAddress).then((result) => {
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
    setView: function() {
      let routeName = this.$route.name;
      this.updateOrUploadMode = "upload";
      this.itemId = null;
      if (routeName === "seller-info") {
        this.activeTab = 1;
      } else if (routeName === "my-item-upload") {
        this.activeTab = 2;
      } else if (routeName === "my-item-update") {
        this.itemId = Number(this.$route.params.itemId);
        this.itemAction = "update";
        this.activeTab = 4;
      } else if (routeName === "my-items") {
        this.activeTab = 3;
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
