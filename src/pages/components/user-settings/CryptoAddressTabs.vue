<template>
<div class="">
  <mdb-navbar expand="medium" color="grey darken-1" class="text-white" style="min-height: 54px;" dark>
    <mdb-navbar-toggler>
      <mdb-navbar-nav>
          <a @click.prevent="showTab('bitcoin')" class="nav-link navbar-link" :class="activeTab === 'bitcoin' ? 'text-light font-weight-bolder' : 'text-dark'">Bitcoin<i class="fas fa-check text-success ml-2" v-if="paymentAddress('bitcoin')"></i><i class="fas fa-times text-danger ml-2" v-else></i></a>
          <a @click.prevent="showTab('lightning')" class="nav-link navbar-link" :class="activeTab === 'lightning' ? 'text-light font-weight-bolder' : 'text-dark'">Lightning<i class="fas fa-check text-success ml-2" v-if="paymentAddress('lightning')"></i></a>
          <a @click.prevent="showTab('stacks')" class="nav-link navbar-link" :class="activeTab === 'stacks' ? 'text-light font-weight-bolder' : 'text-dark'">Stacks<i class="fas fa-check text-success ml-2" v-if="paymentAddress('stacks')"></i></a>
      </mdb-navbar-nav>
    </mdb-navbar-toggler>
  </mdb-navbar>
  <div class="">
    <div v-if="activeTab === 'bitcoin'" class="bg-card p-4">
      <bitcoin-address :buyer="buyer" :activeTab="activeTab" @paymentNetworkUpdate="paymentNetworkUpdate"/>
    </div>
    <div v-else-if="activeTab === 'lightning'" class="bg-card p-4">
      <lightning-address :buyer="buyer" :activeTab="activeTab" @paymentNetworkUpdate="paymentNetworkUpdate"/>
    </div>
    <div v-else-if="activeTab === 'stacks'" class="bg-card p-4">
      <stacks-address :buyer="buyer" :activeTab="activeTab" @paymentNetworkUpdate="paymentNetworkUpdate"/>
    </div>
  </div>
</div>
</template>

<script>
import BitcoinAddress from "./BitcoinAddress";
import LightningAddress from "./LightningAddress";
import StacksAddress from "./StacksAddress";
import { mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "CryptoAddressTabs",
  components: {
    BitcoinAddress, LightningAddress, StacksAddress,
    mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem
  },
  props: {
    buyer: false,
    myProfile: null
  },
  data() {
    return {
      activeTab: null
    };
  },
  mounted() {
    this.showTab("bitcoin");
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
