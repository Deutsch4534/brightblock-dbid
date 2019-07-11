<template>
<div class="">
  <mdb-navbar expand="medium" color="grey lighten-1" style="min-height: 54px;" dark>
    <mdb-navbar-toggler>
      <mdb-navbar-nav style="font-weight: 500;">
          <a v-if="includeTab('notifications')" @click.prevent="showTab('notifications')" class="nav-link navbar-link" :class="activeTab === 'notifications' ? 'text-light font-weight-bolder' : 'text-dark'">Notifications<i class="fas fa-check text-success ml-2" v-if="validEmailInfo"></i><i class="fas fa-times text-danger ml-2" v-else></i></a>
          <a v-if="includeTab('shipping')"      @click.prevent="showTab('shipping')"      class="nav-link navbar-link" :class="activeTab === 'shipping' ? 'text-light font-weight-bolder' : 'text-dark'">Shipping<i class="fas fa-check text-success ml-2" v-if="validAddressInfo"></i><i class="fas fa-times text-danger ml-2" v-else></i></a>
          <a v-if="includeTab('payments')"      @click.prevent="showTab('payments')"      class="nav-link navbar-link" :class="activeTab === 'payments' ? 'text-light font-weight-bolder' : 'text-dark'">Payments<i class="fas fa-check text-success ml-2" v-if="paymentAddress('bitcoin')"></i><i class="fas fa-times text-danger ml-2" v-else></i></a>
          <a v-if="includeTab('friends')"       @click.prevent="showTab('friends')"       class="nav-link navbar-link" :class="activeTab === 'friends' ? 'text-light font-weight-bolder' : 'text-dark'">Friends</a>
          <a v-if="includeTab('blockstack')"    @click.prevent="showTab('blockstack')"    class="nav-link navbar-link" :class="activeTab === 'blockstack' ? 'text-light font-weight-bolder' : 'text-dark'">Blockstack</a>
      </mdb-navbar-nav>
    </mdb-navbar-toggler>
  </mdb-navbar>
  <div class="">
    <div v-if="activeTab === 'notifications'" class="bg-card p-4">
      <notifications @saveEmail="saveEmail"/>
    </div>
    <div v-else-if="activeTab === 'shipping'" class="bg-card p-4">
      <address-form @saveEmail="saveEmail" @saveAddress="saveAddress"/>
    </div>
    <div v-else-if="activeTab === 'payments'" class="bg-card">
      <crypto-address-tabs :buyer="false" :myProfile="myProfile" @saveEmail="saveEmail" @saveAddress="saveAddress"/>
    </div>
    <div v-else-if="activeTab === 'friends'" class="bg-card p-4">
      <trusted-users :trustedIds="myProfile.auxiliaryProfile.trustedIds"/>
    </div>
    <div v-else-if="activeTab === 'blockstack'" class="bg-card p-4">
      <blockstack-section :myProfile="myProfile"/>
    </div>
  </div>
</div>
</template>

<script>
import Notifications from "@/pages/components/user-settings/Notifications";
import AddressForm from "@/pages/components/user-settings/AddressForm";
import TrustedUsers from "@/pages/components/user-settings/TrustedUsers";
import CryptoAddressTabs from "@/pages/components/user-settings/CryptoAddressTabs";
import BlockstackSection from "@/pages/components/user-settings/BlockstackSection";
import { mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem } from 'mdbvue';
import _ from "lodash";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SettingsTabs",
  components: {
    AddressForm, TrustedUsers, CryptoAddressTabs, BlockstackSection, Notifications,
    mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem
  },
  props: {
    buyer: false,
    myProfile: null,
    tabList: null
  },
  data() {
    return {
      activeTab: null
    };
  },
  mounted() {
    this.showTab("notifications");
  },
  computed: {
    validAddressInfo() {
      let validity = this.$store.getters["myAccountStore/getProfileValidity"];
      return validity.shippingValid;
    },
    validEmailInfo() {
      let validity = this.$store.getters["myAccountStore/getProfileValidity"];
      return validity.emailValid;
    },
  },

  methods: {
    paymentAddress(network) {
      let currentNetwork = this.$store.getters["myAccountStore/getPaymentNetwork"];
      return currentNetwork && network === currentNetwork;
    },
    includeTab(tab) {
      let tabs = this.tabList.join(",");
      return tabs.indexOf(tab) > -1;
    },
    showTab(tab) {
      this.activeTab = tab;
    },
    paymentNetworkUpdate(data) {
      if (data === "stacks") {
        this.$notify({type: 'error', title: 'Payment Network', text: 'Payment on stacks network is not yet supported - check back soon as things change fast!'});
      } else if (data === "lightning") {
        this.$notify({type: 'error', title: 'Payment Network', text: 'Payment to sellers using lightning network is not yet supported - check back soon as things change fast!'});
      } else {
        this.$store.dispatch("myAccountStore/updatePaymentNetwork", data).then((prof) => {
          this.$notify({type: 'success', title: 'Payment Network', text: 'Payments will be made using: ' + data});
        });
      }
    },
    saveEmail: function(emailAddress) {
      this.$emit("saveEmail", emailAddress);
    },
    saveAddress: function(address) {
      this.$emit("saveAddress", address);
    },
  }
};
</script>
<style scoped>
</style>
