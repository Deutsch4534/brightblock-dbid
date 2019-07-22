<template>
<div class="">
  <div class="d-flex justify-content-start py-5">
    <ul class="list-group mr-5">
      <a @click.prevent="showTab('bitcoin')" class="list-group-item justify-content-between d-flex align-items-center list-group-item-action" :class="activeTab === 'bitcoin' ? 'active text-light font-weight-bolder' : 'text-dark'">Bitcoin<i class="fas fa-check text-success ml-2" v-if="paymentAddress('bitcoin')"></i><i class="fas fa-times text-danger ml-2" v-else></i></a>
      <a @click.prevent="showTab('lightning')" class="list-group-item justify-content-between d-flex align-items-center list-group-item-action" :class="activeTab === 'lightning' ? ' active text-light font-weight-bolder' : 'text-dark'">Lightning<i class="fas fa-check text-success ml-2" v-if="paymentAddress('lightning')"></i></a>
      <a @click.prevent="showTab('stacks')" class="list-group-item justify-content-between d-flex align-items-center list-group-item-action" :class="activeTab === 'stacks' ? ' active text-light font-weight-bolder' : 'text-dark'">Stacks<i class="fas fa-check text-success ml-2" v-if="paymentAddress('stacks')"></i></a>
    </ul>
    <div class="">
      <div v-if="activeTab === 'bitcoin'" class="bg-card">
        <bitcoin-address :buyer="buyer" :activeTab="activeTab" @paymentNetworkUpdate="paymentNetworkUpdate"/>
      </div>
      <div v-else-if="activeTab === 'lightning'" class="bg-card">
        <lightning-address :buyer="buyer" :activeTab="activeTab" @paymentNetworkUpdate="paymentNetworkUpdate"/>
      </div>
      <div v-else-if="activeTab === 'stacks'" class="bg-card">
        <stacks-address :buyer="buyer" :activeTab="activeTab" @paymentNetworkUpdate="paymentNetworkUpdate"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import BitcoinAddress from "./BitcoinAddress";
import LightningAddress from "./LightningAddress";
import StacksAddress from "./StacksAddress";
import { mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem } from 'mdbvue';
import { mdbListGroup, mdbListGroupItem } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "CryptoAddressTabs",
  components: {
    BitcoinAddress, LightningAddress, StacksAddress,
    mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem,
    mdbListGroup, mdbListGroupItem
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
.list-group-item.active {
  background-color: #607d8b;
  border-color: #607d8b;
}
</style>
