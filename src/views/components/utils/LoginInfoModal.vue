<template>
<mdb-modal v-if="modal" @close="closeMe">
  <mdb-modal-header>
    <mdb-modal-title>{{title}}</mdb-modal-title>
  </mdb-modal-header>
  <mdb-modal-body v-html="content"></mdb-modal-body>
  <mdb-modal-footer>
    <mdb-btn class="btn default" @click.native="closeMe">Close</mdb-btn>
  </mdb-modal-footer>
</mdb-modal>
</template>

<script>
import { mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "LoginInfoModal",
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
      title: "Please Log In",
      content: "<p>You need to login to use this feature.</p>",
    };
  },
  mounted() {
  },
  methods: {
    closeMe: function() {
      this.$emit("closeLoginInfoModal");
    }
  }
};
</script>
<style>

</style>
<style scoped>
</style>
