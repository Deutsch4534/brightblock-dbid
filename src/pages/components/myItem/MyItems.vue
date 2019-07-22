<template>
<div class="p-4 d-flex justify-content-center" role="status" v-if="loading">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
<div class="" v-else>

  <buy-sell-tabs :myProfile="myProfile" :activeTab="activeTab"  style="width: 100%;"/>

  <div class="p-4" v-if="notFoundMessage">
    <p class="h5-responsive mb-5">{{notFoundMessage}}!</p>
  </div>
  <div v-else>

    <div class="p-4" v-if="activeTab === 'unsold'">
      <my-items-list :items="unsold" :myProfile="myProfile"/>
    </div>

    <div class="p-4" v-else-if="activeTab === 'sold'">
      <my-items-list :items="sold" :myProfile="myProfile"/>
    </div>

    <div class="p-4" v-else-if="activeTab === 'selling'">
      <my-sale-item class="row" v-for="asset in selling" :tradeType="'selling'" :key="asset.assetHash" :asset="asset" :myProfile="myProfile"/>
    </div>

    <div class="p-4" v-else-if="activeTab === 'buying'">
      <my-sale-item class="row" v-for="asset in buying" :tradeType="'buying'" :key="asset.assetHash" :asset="asset" :myProfile="myProfile"/>
    </div>

    <div class="p-4" v-else-if="activeTab === 'registered'">
      <my-items-list :items="registered" :myProfile="myProfile"/>
    </div>

    <div class="p-4" v-else-if="activeTab === 'unregistered'">
      <my-items-list :items="unregistered" :myProfile="myProfile"/>
    </div>

  </div>

</div>
</template>

<script>
import MyItemsList from "./MyItemsList";
import { mdbSpinner } from 'mdbvue';
import MySaleItem from "@/pages/components/orders/MySaleItem";
import BuySellTabs from "@/pages/components/myItem/BuySellTabs";
import { mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyItems",
  components: {
    BuySellTabs, MySaleItem, MyItemsList, mdbSpinner,
    mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem
  },
  props: ["myProfile"],
  data() {
    return {
      loading: true,
      activeTab: "unsold",
    };
  },
  watch: {
    '$route' (to, from) {
      this.setView(to.name);
    }
  },
  mounted() {
    this.$store.dispatch("myItemStore/fetchMyItems").then(() => {
      this.loading = false;
      let routeName = this.$route.name;
      this.setView(routeName);
    });
  },
  methods: {
    setView(action) {
      if (action === "my-items") {
        action = "unsold";
      }
      this.activeTab = action;
    },
  },
  computed: {
    notFoundMessage() {
      let count = 0;
      let action = this.activeTab;
      if (action === "my-items" || action === "unsold") {
        count = this.$store.getters["myItemStore/numberItemsUnsold"];
      } else if (action === "selling") {
        count = this.$store.getters["assetStore/getAssetsSelling"](this.myProfile.username).length;
      } else if (action === "buying") {
        count = this.$store.getters["assetStore/getAssetsBuying"](this.myProfile.username).length;
      } else if (action === "sold") {
        count = this.$store.getters["myItemStore/numberItemsSold"];
      } else if (action === "unregistered") {
        count = this.$store.getters["myItemStore/registered"](false).length;
      } else if (action === "registered") {
        count = this.$store.getters["myItemStore/registered"](true).length;
      }
      if (count === 0) {
        return "Nothing " + this.activeTab;
      }
    },
    unsold() {
      return this.$store.getters["myItemStore/unsold"];
    },
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
    /**
    selling() {
      return this.$store.getters["myItemStore/selling"];
    },
    buying() {
      return this.$store.getters["myItemStore/buying"];
    },
    numberItemsBuying() {
      return this.$store.getters["myItemStore/buying"].length;
    },
    numberItemsSelling() {
      return this.$store.getters["myItemStore/selling"].length;
    },
    **/
    sold() {
      return this.$store.getters["myItemStore/sold"];
    },
    registered() {
      return this.$store.getters["myItemStore/registered"](true);
    },
    unregistered() {
      return this.$store.getters["myItemStore/registered"](false);
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
