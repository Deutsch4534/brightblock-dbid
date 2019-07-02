<template>
<div v-if="!loading">
  <!-- shipping address -->
  <div class="row">
    <div class="col-md-12">
      <h4 class="text-capitalize">Shipping Address</h4>
    </div>
  </div>
  <div class="row">
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
      address: null,
      loading: true
    };
  },
  mounted() {
    let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
    this.auxiliaryProfile = myProfile.auxiliaryProfile;
    this.address = this.auxiliaryProfile.shippingAddress;
    this.loading = false;
  },
  computed: {
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
    upload: function(data) {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      myProfile.auxiliaryProfile.shippingAddress = data;
      this.$store.dispatch("myAccountStore/updateAuxiliaryProfile", myProfile.auxiliaryProfile)
        .then(auxiliaryProfile => {
          this.$emit("saveAddress", auxiliaryProfile.shippingAddress);
          this.$notify({type: 'success', title: 'Shipping Address', text: 'Shipping address saved.'});
        })
        .catch(() => {
          this.$notify({type: 'success', title: 'Address Information', text: 'Error updating seller information.'});
        });
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
        this.upload(this.address);
      }
    }
  }
};
</script>
<style>

</style>
<style scoped>
</style>
