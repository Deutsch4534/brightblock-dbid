<template>
<div>
  <div class="row">
    <div class="col-md-12">
      <mdb-popover trigger="click" :options="{placement: 'top'}">
        <div class="popover">
          <div class="popover-header">
            Email Address
          </div>
          <div class="popover-body">
            We use your email address for the following;
            <ul>
              <li>For notifying about events related to selling your item.</li>
              <li>For notifying about other events you have subscribed to.</li>
            </ul>
          </div>
        </div>
        <a @click.prevent="" slot="reference">
          Email Address <mdb-icon far icon="question-circle" />
        </a>
      </mdb-popover>
    </div>
  </div>
  <div class="row my-4">
    <div class="col-md-6 m-0">
      <input type="email" class="m-0 form-control" id="vc-email" placeholder="email address" v-model="tmpEmail" required  @change="emailChange">
    </div>
  </div>
  <div class="row mb-4">
    <div class="col-md-6">
      <a @click="checkForm($event)"><mdb-btn size="sm" type="submit" class="btn teal lighten-1">save</mdb-btn></a>
    </div>
  </div>
</div>
</template>

<script>
import { mdbIcon, mdbPopover, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "EmailAddressEntry",
  components: {
    mdbCardBody,
    mdbPopover,
    mdbIcon,
    mdbCardTitle,
    mdbCardText,
    mdbBtn
  },
  props: {
    emailAddress: null,
  },
  data() {
    return {
      tmpEmail: null
    };
  },
  mounted() {
    this.tmpEmail = this.emailAddress;
  },
  computed: {
  },
  methods: {
    emailChange: function() {
      this.$emit("emailUpdate", this.tmpEmail);
    },
    checkForm(event) {
      if (event) {
        event.preventDefault;
        event.target.classList.add('was-validated');
      }
      this.errors = [];
      if (!this.tmpEmail) {
        this.errors.push("Email required.");
      }
      if (this.errors.length > 0) {
        return false;
      } else {
        this.$emit("saveEmail", this.tmpEmail);
      }
    }
  }
};
</script>
<style>

</style>
<style scoped>
</style>
