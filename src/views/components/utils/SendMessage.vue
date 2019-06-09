<template>
<mdb-modal @close="closeMe">
  <mdb-modal-header>
    <mdb-modal-title>To: {{recipient}}</mdb-modal-title>
  </mdb-modal-header>
  <mdb-modal-body v-if="error" v-html="error" class="text-danger"></mdb-modal-body>
  <mdb-modal-body>
    <p>{{content}}</p>
    <div class="form-row">
        <!--<label for="validationCustom02">Description of Artwork</label>-->
        <textarea type="text" class="form-control" id="validationCustom02" :placeholder="'message'" v-model="message" rows="10" required></textarea>
    </div>
  </mdb-modal-body>
  <mdb-modal-footer>
    <mdb-btn class="btn default" @click.native="sendMe">Send</mdb-btn>
    <mdb-btn class="btn default" @click.native="closeMe">Close</mdb-btn>
  </mdb-modal-footer>
</mdb-modal>
</template>

<script>
import { mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn } from 'mdbvue';
import collaborationService from "@/services/collaborationService";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SendMessage",
  components: {
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbBtn
  },
  props: ["recipient"],
  data() {
    return {
      title: "Please Log In",
      content: "Enter message - if the seller is online they will see it straight away else they will be shown your message next time they log in..",
      error: null,
      message: null
    };
  },
  mounted() {
  },
  methods: {
    closeMe: function() {
      this.$emit("closeModal");
    },
    sendMe: function() {
      this.error = null;
      if (!this.message || this.message.trim().length === 0) {
        this.error = "Please enter a message";
        return;
      }
      collaborationService.sendMessage({recipient: this.recipient, message: this.message});
      this.$emit("closeModal");
    }
  }
};
</script>
<style scoped>
</style>
