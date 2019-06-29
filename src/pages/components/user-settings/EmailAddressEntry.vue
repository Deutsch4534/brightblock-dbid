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
    <div class="row">
      <div class="col-md-12">
        <form v-on:submit.prevent="" class="form-inline">
          <input type="text" class="m-0 form-control" style="min-width: 150px;" id="vc-code" placeholder="enter code" v-model="code"  v-on:keyup.13="checkCode($event)">
          <a class="btn btn-primary btn-sm text-white" @click.prevent="checkCode($event)">Verify Code</a>
        </form>
      </div>
    </div>
  </div>
  <form v-on:submit.prevent="" class="form-inline needs-validation" novalidate>
    <div class="row">
      <div class="col-md-12">
        <input type="email" style="min-width: 400px;" class="m-0 form-control" id="vc-email" placeholder="email address" v-model="newEmail" required>
        <button class="btn btn-primary btn-sm"><a @click="checkEmailForm($event)">Send Code</a></button>
        <a class="btn btn-primary btn-sm text-white" @click.prevent="cancel">Back</a>
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
    cancel: function() {
      this.$emit("cancelEmail");
    },
    sendCode: function() {
      if (this.newEmail === this.oldEmailAddress.email && this.oldEmailAddress.verified) {
        this.$notify({type: 'warn', title: 'Email Update', text: 'Email address has not changed.'});
        return;
      }
      let email = {
        email: this.newEmail,
        code: null,
        verified: false,
      };
      this.$store.dispatch("contentStore/sendVerifyEmail", email).then((response) => {
        this.$notify({type: 'info', title: 'Email Update', text: 'Code sent - please check your email.'});
        this.showCode = true;
      });
    },
    checkEmailForm(event) {
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
