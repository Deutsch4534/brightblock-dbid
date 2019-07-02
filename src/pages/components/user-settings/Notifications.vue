<template>
<div v-if="!loading">
  <!-- email address -->
  <div class="row">
    <div class="col-md-12">
      <h4 class="text-capitalize">Notifications</h4>
    </div>
  </div>
  <div class="row">
    <div class="col-md-12">
      <p class="text-muted">Allow other users to contact you about items your selling.</p>
      <p class="text-muted">Contact details are stored in your storage.</p>
    </div>
  </div>
  <div class="row my-3">
    <div class="col-md-12">
      <h6>Email Notifications <!-- <i class="fas fa-check text-success ml-2" v-if="validEmailInfo"></i> --></h6>
    </div>
  </div>
  <div class="row mb-3">
    <div class="col-md-12">
      <form v-on:submit.prevent="" class="needs-validation" novalidate>
        <div class="form-check mb-4">
          <input type="checkbox" class="form-check-input" id="allowEmailCheck1" @change="togglePrivacy" v-model="allowUse">
          <label class="form-check-label" for="allowEmailCheck1">Allow buyers to send me notifications through dbid.
          <br/><span class="text-muted"><small>Uncheck to store encrypted - you'll need to log in to check for sales!</small></span></label>
        </div>
      </form>
    </div>
  </div>
  <div class="row mb-3">
    <div class="col-md-12">
      <form v-on:submit.prevent="" class="needs-validation" novalidate>
        <div class="form-group mb-4">
          <input type="email" :style="(showCode) ? 'border: 1pt solid red;' : 'border: 1pt solid green;'" class="form-control" id="vc-email" placeholder="email address" v-model="newEmail" required>
        </div>
        <button v-if="!showCode" class="btn btn-primary btn-sm"><a @click="checkEmailForm($event)">Send Code</a></button>
      </form>
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
</div>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Notifications",
  components: {
  },
  props: {
  },
  data() {
    return {
      auxiliaryProfile: null,
      errors: [],
      enterCodeMessage: "We just sent a 6 digit code to this address please copy it into the filed below when it arrives.",
      showCode: false,
      allowUse: true,
      code: null,
      oldEmailAddress: null,
      newEmail: null,
      loading: true
    };
  },
  mounted() {
    let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
    this.auxiliaryProfile = myProfile.auxiliaryProfile;
    this.oldEmailAddress = this.auxiliaryProfile.emailAddress;
    this.newEmail = this.auxiliaryProfile.emailAddress.email;
    this.loading = false;
  },
  computed: {
    validEmailInfo() {
      let validity = this.$store.getters["myAccountStore/getProfileValidity"];
      return validity.emailValid;
    },
  },
  methods: {
    cancel: function() {
      this.$emit("cancelAddress");
    },
    upload: function(emailAddress) {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      myProfile.auxiliaryProfile.emailAddress = emailAddress;
      this.$store.dispatch("myAccountStore/updateAuxiliaryProfile", myProfile.auxiliaryProfile)
        .then(auxiliaryProfile => {
          this.$notify({type: 'success', title: 'Email Address', text: 'Notifications updated.'});
          this.showCode = false;
          this.$emit("saveEmail", auxiliaryProfile.emailAddress);
        })
        .catch(() => {
          this.$notify({type: 'success', title: 'Notifications', text: 'Error updating email.'});
        });
    },
    checkCode: function() {
      let emailAddress = {
        email: this.newEmail,
        allowUse: this.allowUse,
        code: this.code,
        verified: false,
      };
      this.$store.dispatch("contentStore/sendCheckEmailCode", emailAddress).then((response) => {
        if (response) {
          emailAddress.verified = true;
          this.upload(emailAddress);
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
        allowUse: this.allowUse,
        code: null,
        verified: false,
      };
      this.$notify({type: 'info', title: 'Email Update', text: 'Code sent - please check your email.'});
      this.$store.dispatch("contentStore/sendVerifyEmail", email).then((response) => {
        this.showCode = true;
      });
    },
    togglePrivacy() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      myProfile.auxiliaryProfile.emailAddress.allowUse = this.allowUse;
      this.upload(myProfile.auxiliaryProfile.emailAddress);
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
  }
};
</script>
<style>

</style>
<style scoped>
</style>
