]<template>
<div class="container-fluid bg-light flex-1 py-5">
  <mdb-container class="py-3 py-md-4">
    <div class="row"><div class="col-md-12" v-html="loadingMessage"></div></div>
  </mdb-container>
</div>
</template>

<script>
import {mdbContainer } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "AddressForm",
  components: {
    mdbContainer
  },
  props: ["loadingMessage"],
  data() {
    return {
    };
  },
  mounted() {},
  computed: {},
  methods: {}
};
</script>

<style scoped>
</style>
