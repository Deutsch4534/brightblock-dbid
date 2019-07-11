<template>
<div>
  <div class="row mb-4">
    <div class="col-md-12 text-capitalize" v-if="address.line1">
      {{address.line1}}
    </div>
    <div class="col-md-12 text-capitalize" v-if="address.line2">
      {{address.line2}}
    </div>
    <div class="col-md-12 text-capitalize" v-if="address.line3">
      {{address.line3}}
    </div>
    <div class="col-md-12 text-capitalize" v-if="address.city">
      {{address.city}}
    </div>
    <div class="col-md-12 text-capitalize" v-if="address.region">
      {{address.region}}
    </div>
    <div class="col-md-12 text-uppercase" v-if="address.postcode">
      {{address.postcode}}
    </div>
  </div>
</div>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: "AddressView",
  components: {
  },
  props: {
    address: null,
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  computed: {
  },
  methods: {
  }
};
</script>
<style>

</style>
<style scoped>
</style>
