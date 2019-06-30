<template>
<div class="">
  <crypto-address-tabs :buyer="false" :myProfile="myProfile" @saveEmail="saveEmail" @saveAddress="saveAddress"/>
</div>
</template>

<script>
import moment from "moment";
import CryptoAddressTabs from "../user-settings/CryptoAddressTabs";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SellerInfo",
  components: {
    CryptoAddressTabs,
  },
  props: {
    myProfile: null
  },
  data() {
    return {
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
 #profileForm .form-control,
 #profileForm >>> .form-control,
 #profileForm input,
 #profileForm textarea,
 #profileForm label {
   background-color: transparent;
   color: rgba(0, 0, 0, 0.6);
   font-weight: 300;
   font-size: 0.85rem;
  }

#profileForm input::-webkit-input-placeholder,
#profileForm input::-moz-placeholder,
#profileForm input:-ms-input-placeholder,
#profileForm input:-moz-placeholder {
  color: rgba(0, 0, 0, 0.6);
  font-weight: 300;
  font-size: 0.85rem;
 }

 #profileForm .form-row {
   margin-bottom: 1rem;
 }

 /* Drag and drop boxes */

 .load-profile {
   display: flex;
   height: 150px;
   text-align: center;
   padding: 20px;
   font-size: 1em;
   background-color: white;
   border-radius: 10px;
 }
.drop-area {
 width: 100%;
 border: 1px dashed rgba(0, 0, 0, 0.24);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.drop-label {
  color: rgba(0, 0, 0, 0.2);
  font-size: 0.9rem;
  margin-bottom: 0;
}
</style>
