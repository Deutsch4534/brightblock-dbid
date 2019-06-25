<template>
<div>
  <div class="row mb-1">
    <div class="col-md-12">
      <h5>{{addressTitle}}</h5>
    </div>
    <div class="col-md-12">
      <p class="text-muted" v-html="addressBlurb"></p>
    </div>
  </div>
  <div v-if="showCode">
    <div class="row my-4">
      <div class="col-md-6 m-0">
        <input type="text" class="m-0 form-control" id="vc-code" placeholder="enter code" v-model="code"  v-on:keyup.13="checkCode($event)">
      </div>
    </div>
    <div class="row mb-4">
      <div class="col-md-6">
        <mdb-btn size="sm" type="submit" class="btn btn-light lighten-1"><a @click="checkCode($event)">Verify Code</a></mdb-btn>
      </div>
    </div>
  </div>
  <form v-on:submit.prevent="checkForm" class="needs-validation py-1" novalidate>
    <div class="row my-4">
      <div class="col-md-6 m-0">
        <input type="email" class="m-0 form-control" id="vc-email" placeholder="email address" v-model="newEmail" required>
      </div>
    </div>
    <div class="row mb-4">
      <div class="col-md-6">
        <mdb-btn size="sm" type="submit" class="btn btn-light lighten-1"><a @click="checkForm($event)">Send Code</a></mdb-btn>
      </div>
    </div>
  </form>
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
    addressTitle: null,
    addressBlurb: null
  },
  data() {
    return {
      enterCodeMessage: "We just sent a 6 digit code to this address please copy it into the filed below when it arrives.",
      showCode: false,
      code: null,
      oldEmailAddress: null,
      newEmail: null
    };
  },
  mounted() {
    this.oldEmailAddress = this.emailAddress;
    this.newEmail = this.emailAddress.email;
  },
  computed: {
  },
  methods: {
    checkCode: function() {
      let email = {
        email: this.newEmail,
        code: this.code,
        verified: false,
      };
      this.$store.dispatch("contentStore/sendCheckEmailCode", email).then((response) => {
        if (response) {
          this.$emit("saveEmail", {
            email: this.newEmail,
            verified: true,
          });
        } else {
          this.$notify({type: 'error', title: 'Incorrect Code', text: 'Please check your email for the right code.'});
        }
      });
    },
    sendCode: function() {
      let email = {
        email: this.newEmail,
        code: null,
        verified: false,
      };
      this.$store.dispatch("contentStore/sendVerifyEmail", email).then((response) => {
        this.$notify({type: 'info', title: 'Code Sent', text: 'Please check your email.'});
        this.showCode = true;
      });
    },
    checkForm(event) {
      if (event) {
        event.preventDefault;
        event.target.classList.add('was-validated');
      }
      this.errors = [];
      if (!this.newEmail || this.newEmail.indexOf("@") < 3 ) {
        this.errors.push("Email required.");
      }
      if (this.newEmail === this.oldEmailAddress.email && !this.oldEmailAddress.verified) {
        //this.errors.push("Email needs to be verified.");
      }
      if (this.errors.length > 0) {
        return false;
      } else {
        this.sendCode();
      }
    }
  }
};
</script>
<style>

</style>
<style scoped>
</style>
