<template>
<mdb-container>
  <login-tab-modal v-if="showModal" :modal="showModal" @closeModal="closeModal"/>
  <mdb-modal v-if="login" @close="closeLogin">
    <mdb-modal-header class="">
      <mdb-modal-title tag="h4" bold>Login</mdb-modal-title>
    </mdb-modal-header>
    <mdb-modal-body>
      <button class="btn btn-primary btn-block" v-on:click="loginMultiPlayer">Login with Blockstack</button>
    </mdb-modal-body>
    <mdb-modal-footer>
      <div><small class="text-muted"><a @click.prevent="showBrowser = !showBrowser">Sign Up</a></small></div>
      <div class="text-center" v-if="showBrowser">
        <div class="mt-3">To access the decentralised web...</div>
        <div class="mt-3">Create your own online identity <a class="text-primary" href="https://blockstack.org/install/" target="_blank" rel="noreferrer"><i class="fas fa-angle-right mr-2"></i><u>Install Blockstack</u></a></div>
      </div>
    </mdb-modal-footer>
  </mdb-modal>
</mdb-container>
</template>

<script>
import { mdbContainer, mdbBtn, mdbModal, mdbModalHeader, mdbModalBody, mdbModalTitle, mdbModalFooter } from 'mdbvue';
import myAccountService from "@/services/myAccountService";
import LoginTabModal from "@/pages/components/user-settings/LoginTabModal";

export default {
  bodyClass: "login-page",
  components: {
    LoginTabModal,
    mdbContainer,
    mdbBtn,
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
    mdbModalFooter,
    mdbModalTitle
  },
  data() {
    return {
      firstname: null,
      showBrowser: false,
      email: null,
      password: null,
      showModal: false,
      login: true
    };
  },
  props: {
    header: {
      type: String,
      default: require("@/assets/img/missing/artwork-missing.jpg")
    }
  },
  mounted() {
    if (myAccountService.isLoggedIn() > 0) {
      this.$router.push({ path: "/" });
    }
  },
  methods: {
    loginMultiPlayer: function () {
      let res = myAccountService.loginMultiPlayer();
      this.$store.dispatch("myAccountStore/fetchMyAccount");
      this.$router.push({ path: "/" });
      this.showModal = true;
      return res;
    },
    closeModal: function() {
      this.showModal = false;
      this.$router.push({ path: "/" });
    },
    closeLogin: function () {
      this.$router.push({ path: "/" });
    }
  },
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${this.header})`
      };
    }
  }
};
</script>

<style></style>
