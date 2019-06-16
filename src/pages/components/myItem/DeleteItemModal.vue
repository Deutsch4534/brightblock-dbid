<template>
<mdb-modal v-if="modal" @close="closeMe">
  <mdb-modal-header>
    <mdb-modal-title>{{title}}</mdb-modal-title>
  </mdb-modal-header>
  <mdb-modal-body v-html="content"></mdb-modal-body>
  <mdb-modal-footer>
    <button class="btn btn-danger ripple-parent" @click="closeMe">DELETE</button>
    <button class="btn btn-white ripple-parent" @click="cancel">Cancel</button>
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
  props: ["modal", "title", "content", "modalLoginWarning"],
  data() {
    return {
      modalLoginTitle: "Please Log In",
      modalLoginContent: "<p>You'll need to login to use this feature.</p>",
    };
  },
  mounted() {
    if (this.modalLoginWarning) {
      this.title = this.modalLoginTitle;
      this.content = this.modalLoginContent;
    }
  },
  methods: {
    closeMe: function() {
      this.$emit("deleteItemConfirmed", {proceed: true});
    },
    cancel: function() {
      this.$emit("deleteItemConfirmed", {proceed: false});
    }
  }
};
</script>
<style>

</style>
<style scoped>
</style>
