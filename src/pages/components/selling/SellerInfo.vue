<template>
<div class="">
  <!-- <crypto-address-tabs :buyer="false" :myProfile="myProfile" @saveEmail="saveEmail" @saveAddress="saveAddress"/> -->
  <settings-tabs :tabList="tabList" :myProfile="myProfile" @saveEmail="saveEmail" @saveAddress="saveAddress"/>
</div>
</template>

<script>
import moment from "moment";
import SettingsTabs from "@/pages/components/user-settings/SettingsTabs";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SellerInfo",
  components: {
    SettingsTabs,
  },
  props: {
    myProfile: null
  },
  data() {
    return {
      tabList: ["notifications", "shipping", "payments"]
    };
  },
  mounted() {
    // this.myProfile = this.$store.getters["myAccountStore/getMyProfile"];
  },
  computed: {
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
<style>

</style>
<style scoped>
</style>
