<template>
<div>
  <mdb-navbar color="light" class="pt-3">
    <mdb-navbar-toggler>
      <mdb-navbar-brand>
        Purchases
      </mdb-navbar-brand>
      <mdb-navbar-nav>
        <a class="nav-link navbar-link text-nowrap active" id="buying-tab-md" data-toggle="tab" @click.prevent="showTab('buying')" href="#buying-md" role="tab" aria-controls="buying-md" aria-selected="true">
          buying <span class="badge badge-light ml-3">{{numberItemsBuying}}</span></a>
        <a class="nav-link navbar-link text-nowrap" id="selling-tab-md" data-toggle="tab" @click.prevent="showTab('selling')" href="#selling-md" role="tab" aria-controls="selling-md" aria-selected="true">
          selling <span class="badge badge-light ml-3">{{numberItemsSelling}}</span></a>
      </mdb-navbar-nav>
    </mdb-navbar-toggler>
  </mdb-navbar>

  <div class="tab-content card pt-3" id="myTabContentMD">
    <div class="tab-pane fade show active" id="buying-md" role="tabpanel" aria-labelledby="buying-tab-md">
      <div class="container-fluid">
        <div class="d-flex justify-content-start" v-if="numberItemsBuying === 0">
          <p class="h5-responsive mb-5">No orders found!</p>
        </div>
        <div v-else>
          <my-order class="row" v-for="asset in buying" :key="asset.assetHash" :asset="asset" :myProfile="myProfile"/>
        </div>
      </div>
    </div>
    <div class="tab-pane fade" id="selling-md" role="tabpanel" aria-labelledby="selling-tab-md">
      <div class="container-fluid">
        <div class="d-flex justify-content-start" v-if="numberItemsSelling === 0">
          <p class="h5-responsive mb-5">Nothing selling!</p>
        </div>
        <div v-else>
          <my-sale-item class="row" v-for="asset in selling" :key="asset.assetHash" :asset="asset" :myProfile="myProfile"/>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import MyOrder from "@/pages/components/orders/MyOrder";
import MySaleItem from "@/pages/components/orders/MySaleItem";
import { mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "CryptoAddressTabs",
  components: {
    MyOrder, MySaleItem,
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
  },
  mounted() {
    this.showTab("buying");
    this.$store.dispatch("assetStore/subscribeAssetPurchaseNews");
    this.assetConfig = this.$store.getters["assetStore/getAssetConfig"];
    this.$store.dispatch("assetStore/lookupAssetsByBuyer").then((assets) => {
      this.orders = assets;
      this.loaded = true;
    });
    this.$store.dispatch("assetStore/lookupAssetsBySeller").then((assets) => {
      this.loaded = true;
    });

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
      let $ele = document.getElementById("selling-tab-md");
      $ele.classList.remove('active');

      $ele = document.getElementById("buying-tab-md");
      $ele.classList.remove('active');

      $ele = document.getElementById(tab + "-tab-md");
      $ele.classList.add('active');

      $ele = document.getElementById("selling-md");
      $ele.classList.remove('active');
      $ele.classList.remove('show');

      $ele = document.getElementById("buying-md");
      $ele.classList.remove('active');
      $ele.classList.remove('show');

      $ele = document.getElementById(tab + "-md");
      $ele.classList.add('active');
      $ele.classList.add('show');
    },
  }
};
</script>
<style scoped>
.container-fluid {
}
</style>
