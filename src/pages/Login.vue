<template>
<mdb-container>
  <login-tab-modal v-if="showModal" :modal="showModal" @closeModal="closeModal"/>
  <mdb-modal v-if="login" @close="closeLogin">
    <mdb-modal-header class="text-center">
      <mdb-modal-title tag="h4" bold class="w-100">Login</mdb-modal-title>
    </mdb-modal-header>
    <mdb-modal-body class="mx-3 grey-text text-center">
      <mdb-btn><button class="btn btn-light btn-block" v-on:click="loginMultiPlayer">Login with Blockstack</button></mdb-btn>
    </mdb-modal-body>
    <mdb-modal-footer>
      <div class="row">
        <div class="col-12 text-right">
          <small class="text-muted"><a @click.prevent="showBrowser = !showBrowser">whats this?</a></small>
        </div>
        <div class="col-12 text-right" v-if="showBrowser">
          <small class="text-muted"><a href="https://blockstack.org/install/" target="_blank" rel="noreferrer">Install blockstack browser</a> to access the decentralised web 3.0!</small>
        </div>
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
