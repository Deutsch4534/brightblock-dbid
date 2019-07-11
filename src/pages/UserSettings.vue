<template>
<div id="my-app-element" class="container pt-3 mb-5">
  <div class="d-flex justify-content-center" role="status" v-if="loading">
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <div class="" v-else>
    <settings-tabs :tabList="tabList" :myProfile="myProfile"/>
  </div>
</div>
</template>

<script>
import SettingsTabs from "@/pages/components/user-settings/SettingsTabs";
import { mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "UserSettings",
  bodyClass: "index-page",
  components: {
    SettingsTabs,
    mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem
  },
  data() {
    return {
      loading: true,
      fromPage: this.$route.query.from,
      myProfile: null,
      tabList: ["notifications", "shipping", "payments", "friends", "blockstack"]
    };
  },
  mounted() {
    this.$store.dispatch("myAccountStore/fetchMyAccount").then((myProfile) => {
      this.myProfile = myProfile;
      this.loading = false;
    });
  },
  computed: {
    loggedIn() {
      return (this.profile) ? this.myProfile.loggedIn : false;
    }
  },
  methods: {
    saveEmail: function(email) {
      // this.$notify({type: 'success', title: 'Address Info', text: 'Address updated.'});
    },
    saveAddress: function(address) {
      // this.$notify({type: 'success', title: 'Address Info', text: 'Address updated.'});
    },
  }
};
</script>
<style scoped>
</style>
