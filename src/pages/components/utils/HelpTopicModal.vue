<template>
<mdb-modal v-if="modal" @close="closeMe">
  <mdb-modal-header>
    <mdb-modal-title v-html="title"></mdb-modal-title>
  </mdb-modal-header>
  <mdb-modal-body v-if="showView === 1">
    <div class='popover-body'>
      To receive btc payments on the bitcoin network enter a bitcoin receive address.
      This is used for;
      <ul class='mt-3'>
        <li>for making payments to you</li>
        <li>for generating certificates of authenticity</li>
      </ul>
    </div>
    <div class='popover-body'>
      The <a href='https://electrum.org' target='_blank' rel='noreferrer'>electrum <mdb-icon class="ml-2" icon='external-link-alt' /></a> and <a href='https://bitcoin.org/en/download' target='_blank' rel='noreferrer'>bitcoin core <mdb-icon class="ml-2" icon='external-link-alt' /></a> wallets are used to test dbid.
      <br/><br/>
      Use this address to try out the site - tb1q5d2p3tejxrjfqelcwght3km3ua9wgrd09w05es
      <br/><br/>
      <a class='text-primary' href='https://bitcoin.stackexchange.com/questions/76598/how-to-get-electrum-3-1-3-on-bitcoin-testnet' target='_blank'><u>Learn more about running bitcoin on testnet<i class="fas fa-angle-right ml-2"></i></u></a>
    </div>
  </mdb-modal-body>
  <mdb-modal-body v-else-if="showView === 2">
    <div class='popover-body'>To receive btc payments on the lightning network enter your lightning wallet receive address.
      <br/><br/>If you are running your own lightning node you can alternatively enter the connection details.
      <br/><br/>
      <a class='text-primary' href='https://lightning.engineering/' target='_blank'><u>Learn more about the Lightning Network <i class="fas fa-angle-right ml-2"></i></u></a>
    </div>
  </mdb-modal-body>
  <mdb-modal-body v-else-if="showView === 3">
    <div class='popover-body'>
      Stacks are Blockstack native tokens. We will be accepting payments in stacks once they are fully operational.
      <br/><br/>
      A stacks public wallet address is a string of letters and numbers starting with an ‘SP’ or SM’, for example SP017AUV5YRM7HT3TSQXJF7FCCYXETAB276BQ6XY is a wallet address.
      <br/><br/>
      <a class='text-primary' href='https://stackstoken.com/' target='_blank'><u>Learn more about stacks tokens <i class="fas fa-angle-right ml-2"></i></u></a>
    </div>
  </mdb-modal-body>
  <mdb-modal-body v-else-if="showView === 4">
    <div class='popover-body'>Trusted users will be able to decrypt your profile information - please enter as comma separated list of blockstack user ids.</div>
  </mdb-modal-body>
  <mdb-modal-footer>
    <a class="btn btn-primary text-white" @click.prevent="closeMe">Close</a>
  </mdb-modal-footer>
</mdb-modal>
</template>

<script>
import { mdbIcon, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ConfirmationModal",
  components: {
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbBtn, mdbIcon
  },
  props: ["modal", "topic"],
  data() {
    return {
      showView: 1,
      title: "",
      body: "",
      bitcoinAddress: {
        title: "Bitcoin Addresses",
      },
      stacksAddress: {
        title: "Stacks Addresses",
      },
      lightningAddress: {
        title: "Lightning Addresses",
      },
      trustedUsers: {
        title: "Trusted Users",
        body: "Trusted users will be able to decrypt your profile information - please enter as comma separated list of blockstack user ids."
      }
    };
  },
  mounted() {
    if (this.topic === "bitcoin-address") {
      this.showView = 1;
      this.title = this.bitcoinAddress.title;
    } else if (this.topic === "lightning-address") {
      this.showView = 2;
      this.title = this.lightningAddress.title;
    } else if (this.topic === "stacks-address") {
      this.showView = 3;
      this.title = this.stacksAddress.title;
    } else if (this.topic === "trusted-users") {
      this.showView = 4;
      this.title = this.trustedUsers.title;
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
