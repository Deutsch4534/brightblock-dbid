<template>
<div v-if="!loading">
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
        <form v-on:submit.prevent="" class="">
          <input type="text" class="m-0 form-control" id="vc-code" placeholder="enter code" v-model="code" required v-on:keyup.13="checkCode($event)">
          <a class="btn btn-primary btn-sm text-white" @click.prevent="checkCode($event)">Verify Code</a>
        </form>
      </div>
    </div>
  </div>
  <div class="row mt-3">
    <div class="col-md-12">
      <h6>Email Address <i class="fas fa-check text-success ml-2" v-if="validEmailInfo"></i></h6>
    </div>
  </div>
  <form v-on:submit.prevent="" class="needs-validation" novalidate>
    <div class="row">
      <div class="col-md-12">
        <input type="email" class="m-0 form-control" id="vc-email" placeholder="email address" v-model="newEmail" required>
        <button class="btn btn-primary btn-sm"><a @click="checkEmailForm($event)">Send Code</a></button>
      </div>
    </div>
  </form>

  <!-- shipping address -->
  <div class="row mt-3">
    <div class="col-md-12">
      <h6>Shipping Address <i class="fas fa-check text-success ml-2" v-if="validShippingInfo"></i></h6>
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
  },
  data() {
    return {
      auxiliaryProfile: null,
      errors: [],
      enterCodeMessage: "We just sent a 6 digit code to this address please copy it into the filed below when it arrives.",
      showCode: false,
      code: null,
      oldEmailAddress: null,
      newEmail: null,
      address: null,
      loading: true
    };
  },
  mounted() {
    let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
    this.auxiliaryProfile = myProfile.auxiliaryProfile;
    this.oldEmailAddress = this.auxiliaryProfile.emailAddress;
    this.newEmail = this.auxiliaryProfile.emailAddress.email;
    this.address = this.auxiliaryProfile.shippingAddress;
    this.loading = false;
  },
  computed: {
    validEmailInfo() {
      let validity = this.$store.getters["myAccountStore/getProfileValidity"];
      return validity.emailValid;
    },
    validShippingInfo() {
      let validity = this.$store.getters["myAccountStore/getProfileValidity"];
      return validity.shippingValid;
    },
  },
  methods: {
    addressChange: function() {
      // this.$emit("addressUpdate", this.address);
    },
    cancel: function() {
      this.$emit("cancelAddress");
    },
    upload: function(type, data) {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      if (type === "email-address") {
        myProfile.auxiliaryProfile.emailAddress = data;
      } else if (type === "shipping-address") {
        myProfile.auxiliaryProfile.shippingAddress = data;
      }
      this.$store.dispatch("myAccountStore/updateAuxiliaryProfile", myProfile.auxiliaryProfile)
        .then(auxiliaryProfile => {
          this.$emit("sellerInfoUpdated");
          if (type === "email-address") {
            this.$notify({type: 'success', title: 'Email Address', text: 'Email address verified.'});
            this.showCode = false;
            this.$emit("saveEmail", auxiliaryProfile.emailAddress);
          } else if (type === "shipping-address") {
            this.$emit("saveAddress", auxiliaryProfile.shippingAddress);
            this.$notify({type: 'success', title: 'Shipping Address', text: 'Shipping address saved.'});
          }
        })
        .catch(() => {
          this.$notify({type: 'success', title: 'Address Information', text: 'Error updating seller information.'});
        });
    },
    checkCode: function() {
      let emailAddress = {
        email: this.newEmail,
        code: this.code,
        verified: false,
      };
      this.$store.dispatch("contentStore/sendCheckEmailCode", emailAddress).then((response) => {
        if (response) {
          emailAddress.verified = true;
          this.upload("email-address", emailAddress);
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
      this.showCode = true;
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
        this.upload("shipping-address", this.address);
      }
    }
  }
};
</script>
<style>

</style>
<style scoped>
</style>
