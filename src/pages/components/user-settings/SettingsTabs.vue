<template>
<div class="">
  <mdb-navbar color="warning" light class="pt-3">
    <mdb-navbar-toggler>
      <mdb-navbar-nav>
          <a v-if="includeTab('notifications')" class="nav-link navbar-link text-nowrap active" id="notifications-tab-md" data-toggle="tab" @click.prevent="showTab('notifications')" href="#notifications-md" role="tab" aria-controls="notifications-md"
            aria-selected="true">Notifications<i class="fas fa-check text-success ml-2" v-if="validEmailInfo"></i><i class="fas fa-times text-danger ml-2" v-else></i></a>
          <a v-if="includeTab('shipping')" class="nav-link navbar-link text-nowrap active" id="shipping-tab-md" data-toggle="tab" @click.prevent="showTab('shipping')" href="#shipping-md" role="tab" aria-controls="shipping-md"
            aria-selected="true">Shipping<i class="fas fa-check text-success ml-2" v-if="validAddressInfo"></i><i class="fas fa-times text-danger ml-2" v-else></i></a>
          <a v-if="includeTab('payments')" class="nav-link navbar-link text-nowrap" id="payments-tab-md" data-toggle="tab" @click.prevent="showTab('payments')" href="#payments-md" role="tab" aria-controls="payments-md" aria-selected="true">
            Payments<i class="fas fa-check text-success ml-2" v-if="paymentAddress('bitcoin')"></i><i class="fas fa-times text-danger ml-2" v-else></i></a>
          <a v-if="includeTab('friends')" class="nav-link navbar-link text-nowrap" id="friends-tab-md" data-toggle="tab" @click.prevent="showTab('friends')" href="#friends-md" role="tab" aria-controls="friends-md"
            aria-selected="false">Friends</a>
          <a v-if="includeTab('blockstack')" class="nav-link navbar-link text-nowrap" id="blockstack-tab-md" data-toggle="tab" @click.prevent="showTab('blockstack')" href="#blockstack-md" role="tab" aria-controls="blockstack-md"
            aria-selected="false">Blockstack</a>
      </mdb-navbar-nav>
    </mdb-navbar-toggler>
  </mdb-navbar>
  <div class="tab-content card" id="myTabContentMD">
    <div v-if="includeTab('notifications')" class="tab-pane fade show active" id="notifications-md" role="tabpanel" aria-labelledby="notifications-tab-md">
      <mdb-container fluid class="">
        <notifications @saveEmail="saveEmail"/>
      </mdb-container>
    </div>
    <div v-if="includeTab('shipping')" class="tab-pane fade show active" id="shipping-md" role="tabpanel" aria-labelledby="shipping-tab-md">
      <mdb-container fluid class="">
        <address-form @saveEmail="saveEmail" @saveAddress="saveAddress"/>
      </mdb-container>
    </div>
    <div v-if="includeTab('payments')" class="tab-pane fade" id="payments-md" role="tabpanel" aria-labelledby="payments-tab-md">
      <mdb-container fluid class="">
        <crypto-address-tabs :buyer="false" :myProfile="myProfile" @saveEmail="saveEmail" @saveAddress="saveAddress"/>
      </mdb-container>
    </div>
    <div v-if="includeTab('friends')" class="tab-pane fade" id="friends-md" role="tabpanel" aria-labelledby="friends-tab-md">
      <mdb-container fluid class="">
        <trusted-users :trustedIds="myProfile.auxiliaryProfile.trustedIds"/>
      </mdb-container>
    </div>
    <div v-if="includeTab('blockstack')" class="tab-pane fade" id="blockstack-md" role="tabpanel" aria-labelledby="blockstack-tab-md">
      <mdb-container fluid class="">
        <blockstack-section :myProfile="myProfile"/>
      </mdb-container>
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
      let $ele;
      _.forEach(this.tabList, function(tab) {
        $ele = document.getElementById(tab + "-tab-md");
        $ele.classList.remove('active');
      });
      _.forEach(this.tabList, function(tab) {
        $ele = document.getElementById(tab + "-md");
        $ele.classList.remove('active');
        $ele.classList.remove('show');
      });

      $ele = document.getElementById(tab + "-tab-md");
      $ele.classList.add('active');

      $ele = document.getElementById(tab + "-md");
      $ele.classList.add('active');
      $ele.classList.add('show');
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
.container-fluid {
}
.navbar {
  align-items: start;
}
</style>
