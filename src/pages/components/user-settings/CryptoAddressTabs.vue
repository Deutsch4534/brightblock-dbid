<template>
<div class="">
<mdb-navbar color="light" class="pt-3">
  <mdb-navbar-toggler>
    <mdb-navbar-brand>
      Payments on dBid
    </mdb-navbar-brand>
    <mdb-navbar-nav>
        <a class="nav-link navbar-link text-nowrap active" id="bitcoin-tab-md" data-toggle="tab" @click.prevent="showTab('bitcoin')" href="#bitcoin-md" role="tab" aria-controls="bitcoin-md" aria-selected="true">
          Bitcoin<i class="fas fa-check text-success ml-2" v-if="paymentAddress('bitcoin')"></i><i class="fas fa-times text-danger ml-2" v-else></i></a>
        <a class="nav-link navbar-link text-nowrap" id="lightning-tab-md" data-toggle="tab" @click.prevent="showTab('lightning')" href="#lightning-md" role="tab" aria-controls="lightning-md"
          aria-selected="false">Lightning<i class="fas fa-check text-success ml-2" v-if="paymentAddress('lightning')"></i></a>
        <a class="nav-link navbar-link text-nowrap" id="stacks-tab-md" data-toggle="tab" @click.prevent="showTab('stacks')" href="#stacks-md" role="tab" aria-controls="stacks-md"
          aria-selected="false">Stacks<i class="fas fa-check text-success ml-2" v-if="paymentAddress('stacks')"></i></a>
    </mdb-navbar-nav>
  </mdb-navbar-toggler>
</mdb-navbar>
<div class="tab-content card pt-3 m-0" id="myTabContentMD">
  <div class="tab-pane fade show active" id="bitcoin-md" role="tabpanel" aria-labelledby="bitcoin-tab-md">
    <mdb-container fluid class="">
      <bitcoin-address :buyer="buyer" :activeTab="activeTab" @paymentNetworkUpdate="paymentNetworkUpdate"/>
    </mdb-container>
  </div>
  <div class="tab-pane fade" id="lightning-md" role="tabpanel" aria-labelledby="lightning-tab-md">
    <mdb-container fluid class="">
      <lightning-address :buyer="buyer" :activeTab="activeTab" @paymentNetworkUpdate="paymentNetworkUpdate"/>
    </mdb-container>
  </div>
  <div class="tab-pane fade" id="stacks-md" role="tabpanel" aria-labelledby="stacks-tab-md">
    <mdb-container fluid class="">
      <stacks-address :buyer="buyer" :activeTab="activeTab" @paymentNetworkUpdate="paymentNetworkUpdate"/>
    </mdb-container>
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
      let $ele = document.getElementById("bitcoin-tab-md");
      $ele.classList.remove('active');
      if (!this.buyer) {
        $ele = document.getElementById("lightning-tab-md");
        $ele.classList.remove('active');
        $ele = document.getElementById("stacks-tab-md");
        $ele.classList.remove('active');
      }
      $ele = document.getElementById(tab + "-tab-md");
      $ele.classList.add('active');

      if (!this.buyer) {
        $ele = document.getElementById("lightning-md");
        $ele.classList.remove('active');
        $ele.classList.remove('show');

        $ele = document.getElementById("stacks-md");
        $ele.classList.remove('active');
        $ele.classList.remove('show');
      }

      $ele = document.getElementById("bitcoin-md");
      $ele.classList.remove('active');
      $ele.classList.remove('show');

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
