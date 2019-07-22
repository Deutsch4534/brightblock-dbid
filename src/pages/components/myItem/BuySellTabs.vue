<template>
  <mdb-navbar expand="medium" color="blue-grey lighten-3" style="min-height: 54px;" dark>
    <mdb-navbar-toggler>
      <mdb-navbar-brand>
      </mdb-navbar-brand>
      <mdb-navbar-nav left class="text-light">
        <router-link to="/my-unsold" class="nav-link navbar-link" :class="activeTab === 'unsold' ? 'text-white font-weight-bold' : 'text-dark'"><span class="badge badge-light ml-3 mr-2">{{numberItemsUnsold}}</span> Unsold</router-link>
        <router-link to="/my-buying"  class="nav-link navbar-link" :class="activeTab === 'buying' ? 'text-white font-weight-bold' : 'text-dark'"> <span class="badge badge-light ml-3 mr-2">{{numberItemsBuying}}</span> Buying</router-link>
        <router-link to="/my-selling"  class="nav-link navbar-link" :class="activeTab === 'selling' ? 'text-white font-weight-bold' : 'text-dark'"> <span class="badge badge-light ml-3 mr-2">{{numberItemsSelling}} </span> Selling</router-link>
      </mdb-navbar-nav>
    </mdb-navbar-toggler>
  </mdb-navbar>
</template>

<script>
import { mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "BuySellTabs",
  components: {
    mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem
  },
  props: ["myProfile", "activeTab"],
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
  },
  computed: {
    numberItemsBuying() {
      return this.$store.getters["assetStore/getAssetsBuying"](this.myProfile.username).length;
    },
    numberItemsSelling() {
      return this.$store.getters["assetStore/getAssetsSelling"](this.myProfile.username).length;
    },
    numberItemsRegistered() {
      return this.$store.getters["myItemStore/registered"](true).length;
    },
    numberItemsUnregistered() {
      return this.$store.getters["myItemStore/registered"](false).length;
    },
    numberItemsSold() {
      return this.$store.getters["myItemStore/numberItemsSold"];
    },
    numberItemsUnsold() {
      return this.$store.getters["myItemStore/numberItemsUnsold"];
    },
  }
};
</script>
<style scoped>
.nav-link {
  font-size: 1.2rem;
  text-transform: lowercase;
  line-height: 1.2rem;
}
</style>
