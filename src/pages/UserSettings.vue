<template>
<div id="my-app-element" class="container pt-5">
  <div class="container spinner-border" role="status" v-if="loading">
    <span class="sr-only">Loading...</span>
  </div>
  <div class="container" v-else>
    <auxiliary-profile-form :formTitle="'RA Profile'" :mode="'update'" :profile="profile" v-if="loggedIn"/>
    <div v-else><router-link to="/login">Please log in</router-link></div>
  </div>
</div>
</template>

<script>
import AuxiliaryProfileForm from "./components/user-settings/AuxiliaryProfileForm";
import { mdbContainer } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "UserSettings",
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
