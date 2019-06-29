<template>
<mdb-modal v-if="modal" @close="closeMe">
  <mdb-modal-header>
    <mdb-modal-title>{{title}}</mdb-modal-title>
  </mdb-modal-header>
  <mdb-modal-body v-html="content"></mdb-modal-body>
  <mdb-modal-footer>
    <mdb-btn class="btn btn-primary text-white" @click.native="reloadMe">Reload</mdb-btn>
  </mdb-modal-footer>
</mdb-modal>
</template>

<script>
import { mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "LoginTabModal",
  components: {
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbBtn
  },
  props: ["modal"],
  data() {
    return {
      title: "Blockstack Login",
      content: "<p>Log in opened another browser tab - please reload this tab to continue.</p>",
    };
  },
  mounted() {
  },
  methods: {
    closeMe: function() {
      this.$emit("closeModal");
    },
    reloadMe: function() {
      location.reload();
    }
  }
};
</script>
<style>

</style>
<style scoped>
</style>
