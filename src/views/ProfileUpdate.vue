<template>
<mdb-container fluid class="bg-light flex-1 px-5">
  <mdb-container class="bg-white mt-5 p-3" v-if="loading">
    <div>Loading user profile - please wait...</div>
  </mdb-container>
  <mdb-container class="mt-5" v-else>
    <auxiliary-profile-form :formTitle="'RA Profile'" :mode="'update'" :profile="profile" v-if="loggedIn"/>
    <div v-else><router-link to="/login">Please log in</router-link></div>
  </mdb-container>
</mdb-container>
</template>

<script>
import AuxiliaryProfileForm from "./components/profile/AuxiliaryProfileForm";
import { mdbContainer } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ProfileUpdate",
  bodyClass: "index-page",
  components: {
    AuxiliaryProfileForm, mdbContainer
  },
  data() {
    return {
      loading: true,
      profile: null
    };
  },
  mounted() {
    this.$store.dispatch("myAccountStore/fetchMyAccount").then((profile) => {
      this.profile = profile;
      this.loading = false;
    });
  },
  computed: {
    loggedIn() {
      return (this.profile) ? this.profile.loggedIn : false;
    }
  },
  methods: {}
};
</script>
