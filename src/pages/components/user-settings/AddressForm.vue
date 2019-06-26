<template>
<div>
  <!-- email address -->
  <div class="row mt-3">
    <div class="col-md-12">
      <h5>Address Information</h5>
    </div>
    <div class="col-md-12">
      <p class="text-muted">Needed to complete the sale - not shown to anyone else - including us!</p>
    </div>
  </div>
  <div v-if="showCode">
    <div class="row">
      <div class="col-md-12">
        <form v-on:submit.prevent="" class="form-inline">
          <input type="text" class="m-0 form-control" style="min-width: 150px;" id="vc-code" placeholder="enter code" v-model="code" required v-on:keyup.13="checkCode($event)">
          <a class="btn btn-primary btn-sm text-white" @click.prevent="checkCode($event)">Verify Code</a>
        </form>
      </div>
    </div>
  </div>
  <div class="row mt-3">
    <div class="col-md-12">
      <h6>Email Address</h6>
    </div>
  </div>
  <form v-on:submit.prevent="" class="form-inline needs-validation" novalidate>
    <div class="row">
      <div class="col-md-12">
        <input type="email" style="min-width: 400px;" class="m-0 form-control" id="vc-email" placeholder="email address" v-model="newEmail" required>
        <button class="btn btn-primary btn-sm"><a @click="checkEmailForm($event)">Send Code</a></button>
      </div>
    </div>
  </form>

  <!-- shipping address -->
  <div class="row mt-3">
    <div class="col-md-12">
      <h6>Shipping Address</h6>
    </div>
  </div>
  <form v-on:submit.prevent="checkForm" class="needs-validation py-1" novalidate>
  <div class="row mb-4">
    <div class="col-md-6">
      <input type="text" class="form-control" id="vline1" placeholder="Address line 1" v-model="address.line1" required @change="addressChange" required>
    </div>
    <div class="col-md-6">
      <input type="text" class="form-control" id="vline2" placeholder="Address line 2" v-model="address.line2" @change="addressChange">
    </div>
  </div>
  <div class="row mb-4">
    <div class="col-md-6">
      <input type="text" class="form-control" id="vline3" placeholder="Address line 3" v-model="address.line3" @change="addressChange">
    </div>
    <div class="col-md-6">
      <input type="text" class="form-control" id="vline4" placeholder="Town or city" v-model="address.city" @change="addressChange" required>
    </div>
  </div>
  <div class="row mb-4">
    <div class="col-md-6">
      <input type="text" class="form-control" id="vline5" placeholder="Region" v-model="address.region" @change="addressChange" required>
    </div>
    <div class="col-md-6">
      <input type="text" class="form-control" id="vline6" placeholder="Zip or postcode*" v-model="address.postcode" @change="addressChange" required>
    </div>
  </div>
  <div class="row mb-4">
    <div class="col-md-12">
      <button type="submit" class="btn btn-primary btn-sm text-white">Save</button>
      <a class="btn btn-primary btn-sm text-white" @click.prevent="cancel">Back</a>
    </div>
  </div>
  </form>
</div>
</template>

<script>
import { mdbIcon, mdbPopover, mdbCol, mdbRow, mdbContainer, mdbBtn } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "AddressForm",
  components: {
    mdbContainer,
    mdbIcon,
    mdbPopover,
    mdbCol,
    mdbRow,
    mdbBtn
  },
  props: {
    emailAddress: null,
    address: null,
  },
  data() {
    return {
      errors: [],
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
    addressChange: function() {
      // this.$emit("addressUpdate", this.address);
    },
    cancel: function() {
      this.$emit("cancelAddress");
    },
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
      if (this.newEmail === this.oldEmailAddress.email && this.oldEmailAddress.verified) {
        this.$notify({type: 'warn', title: 'Email Update', text: 'Email address has not changed.'});
        return;
      }
      let email = {
        email: this.newEmail,
        code: null,
        verified: false,
      };
      this.$notify({type: 'info', title: 'Email Update', text: 'Code sent - please check your email.'});
      this.$store.dispatch("contentStore/sendVerifyEmail", email).then((response) => {
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
        this.$notify({type: 'error', title: 'Email Address', text: 'Please enter a valid email address.'});
      }
      if (this.errors.length > 0) {
        return false;
      } else {
        this.sendCode();
      }
    },
    checkForm(event) {
      if (event) {
        event.preventDefault;
        event.target.classList.add('was-validated');
      }
      this.errors = [];
      if (!this.address.line1) {
        this.errors.push("Address line1 required.");
      }
      if (!this.address.city) {
        this.errors.push("City / town required.");
      }
      if (!this.address.postcode) {
        this.errors.push("Postcode / zip required.");
      }
      if (this.errors.length > 0) {
        return false;
      } else {
        this.$emit("saveAddress", this.address);
      }
    }
  }
};
</script>
<style>

</style>
<style scoped>
</style>
