<template>
<div>
  <mdb-navbar expand="medium" color="success" style="min-height: 54px;" dark>
    <mdb-navbar-toggler>
      <mdb-navbar-brand>
        <span class="text-white" style="font-weight: 500">Orders</span>
      </mdb-navbar-brand>
      <mdb-navbar-nav right class="text-light">
        <a @click.prevent="showTab('buying')" class="nav-link navbar-link btn btn-primary" :class="activeTab === 'buying' ? 'text-light font-weight-bolder' : 'text-dark'">Buying <span class="badge badge-light ml-3">{{numberItemsBuying}}</span></a>
        <a @click.prevent="showTab('selling')" class="nav-link navbar-link btn btn-primary" :class="activeTab === 'selling' ? 'text-light font-weight-bolder' : 'text-dark'">Selling <span class="badge badge-light ml-3">{{numberItemsSelling}}</span></a>
      </mdb-navbar-nav>
    </mdb-navbar-toggler>
  </mdb-navbar>
  <div class="">
    <div v-if="activeTab === 'buying'" class="p-4">
      <div class="d-flex justify-content-start" v-if="numberItemsBuying === 0">
        <p class="h5-responsive mb-5">No orders found!</p>
      </div>
      <div v-else>
      <!--  <my-order0 class="row" v-for="asset in buying" :key="asset.assetHash" :asset="asset" :myProfile="myProfile"/> -->
        <my-sale-item class="row" v-for="asset in buying" :tradeType="'buying'" :key="asset.assetHash" :asset="asset" :myProfile="myProfile"/>
      </div>
    </div>
    <div v-else-if="activeTab === 'selling'" class="p-4">
      <div class="d-flex justify-content-start" v-if="numberItemsSelling === 0">
        <p class="h5-responsive mb-5">Nothing selling!</p>
      </div>
      <div v-else>
        <my-sale-item class="row" v-for="asset in selling" :tradeType="'selling'" :key="asset.assetHash" :asset="asset" :myProfile="myProfile"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import MySaleItem from "@/pages/components/orders/MySaleItem";
import { mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyOrders",
  components: {
    MySaleItem,
    mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem
  },
  props: {
    myProfile: null
  },
  data() {
    return {
      activeTab: null
    };
  },
  mounted() {
    this.$store.dispatch("assetStore/lookupAssetsBySeller").then(assets => {
    });
    this.$store.dispatch("assetStore/lookupAssetsByBuyer").then(assets => {
    });
    this.showTab("buying");
  },
  computed: {
    selling() {
      return this.$store.getters["assetStore/getAssetsSelling"](this.myProfile.username);
    },
    buying() {
      return this.$store.getters["assetStore/getAssetsBuying"](this.myProfile.username);
    },
    numberItemsBuying() {
      return this.$store.getters["assetStore/getAssetsBuying"](this.myProfile.username).length;
    },
    numberItemsSelling() {
      return this.$store.getters["assetStore/getAssetsSelling"](this.myProfile.username).length;
    },
  },

  methods: {
    showTab(tab) {
      this.activeTab = tab;
    },
  }
};
</script>
<style scoped>
.btn {
  font-size: 0.7rem;
  padding: 4px 10px;
  margin: 2px 3px;
  text-transform: capitalize;
}
</style>
