<template>
<div>
  <div class="row mb-4">
    <div class="col-md-12">
      <mdb-popover trigger="click" :options="{placement: 'top'}">
        <div class="popover">
          <div class="popover-header">
            {{addressTitle}}
          </div>
          <div class="popover-body">{{addressBlurb}}</div>
        </div>
        <a @click.prevent="" slot="reference">
          {{addressTitle}} <mdb-icon far icon="question-circle" />
        </a>
      </mdb-popover>
    </div>
  </div>
  <form class="needs-validation py-1" novalidate @submit.prevent=checkForm($event) id="addressForm">
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
      <input type="text" class="form-control" id="vline5" placeholder="Region" v-model="address.region" @change="addressChange">
    </div>
    <div class="col-md-6">
      <input type="text" class="form-control" id="vline6" placeholder="Zip or postcode*" v-model="address.postcode" @change="addressChange" required>
    </div>
  </div>
  <div class="row mb-4">
    <div class="col-md-12">
      <a @click="checkForm($event)"><mdb-btn size="sm" type="submit" class="btn teal lighten-1">save</mdb-btn></a>
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
  props: ["address", "addressTitle", "addressBlurb"],
  data() {
    return {
      errors: [],
    };
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    addressChange: function() {
      // this.$emit("addressUpdate", this.address);
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
