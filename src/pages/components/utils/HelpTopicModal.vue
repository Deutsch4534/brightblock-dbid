<template>
<mdb-modal v-if="modal" @close="closeMe">
  <mdb-modal-header>
    <mdb-modal-title v-html="title"></mdb-modal-title>
  </mdb-modal-header>
  <mdb-modal-body v-html="body"></mdb-modal-body>
  <mdb-modal-footer>
    <mdb-btn class="btn btn-small white" @click.native="closeMe">Close</mdb-btn>
  </mdb-modal-footer>
</mdb-modal>
</template>

<script>
import { mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ConfirmationModal",
  components: {
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbBtn
  },
  props: ["modal", "topic"],
  data() {
    return {
      title: "",
      body: "",
      bitcoinAddress: {
        title: "Bitcoin Addresses",
        body: "<div class='popover-body'>Your bitcoin address is needed;<ul>" +
                "<li>for making payments to you</li>" +
                "<li>for generating certificates of authenticity</li></ul></div><div class='popover-body'>The <a href='https://electrum.org' target='_blank' rel='noreferrer'>electrum wallet <mdb-icon icon='external-link-alt' /></a> and <a href='https://bitcoin.org/en/download' target='_blank' rel='noreferrer'>bitcoin core <mdb-icon icon='external-link-alt' /></a> are used to test dbid.</div>"
      },
      trustedUsers: {
        title: "Trusted Users",
        body: "Trusted users will be able to decrypt your profile information - please enter as comma separated list of blockstack user ids."
      }
    };
  },
  mounted() {
    if (this.topic === "bitcoin-address") {
      this.title = this.bitcoinAddress.title;
      this.body = this.bitcoinAddress.body;
    } else if (this.topic === "trusted-users") {
      this.title = this.trustedUsers.title;
      this.body = this.trustedUsers.body;
    }
  },
  methods: {
    closeMe: function() {
      this.$emit("closeModal");
    }
  }
};
</script>
<style>

</style>
<style scoped>
</style>
