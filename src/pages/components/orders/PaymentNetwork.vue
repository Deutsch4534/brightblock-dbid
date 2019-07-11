<template>
<div class="d-flex flex-column align-items-center p-4">
  <h4 class="h4-responsive text-muted mb-4">Select payment option</h4>
  <div class="mb-3" style="width: 300px;"><button style="text-transform: capitalize;" class="btn btn-block btn-success" @click="chooseNetwork('bitcoin')"><span class="d-flex justify-content-between"><span>Bitcoin - on chain</span> <i class="ml-5 fas fa-angle-right"></i></span></button></div>
  <div class="mb-3" style="width: 300px;"><button style="text-transform: capitalize;" class="btn btn-block btn-success" @click="chooseNetwork('lightning')"><span class="d-flex justify-content-between"><span>Bitcoin - Lightning network</span> <i class="ml-5 fas fa-angle-right"></i></span></button></div>
  <p class="text-muted">if your not a power user see this <a href="https://blog.bitrefill.com/top-11-lightning-network-wallets-bitrefill-328b5465b1b4" target="_blank"><u>list of lightning wallets</u></a></p>
  <div class="mb-3" style="width: 300px;"><button style="text-transform: capitalize;" class="btn btn-block btn-outline-success" @click="chooseNetwork('stacks')"><span class="d-flex justify-content-between"><span>Stacks - (STX)</span> <i class="ml-5 fas fa-angle-right"></i></span></button></div>
  <p class="text-muted">Coming soon! Native utility token on the <a href="https://stackstoken.com/" target="_blank"><u>Blockstack network.</u></a></p>
</div>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: "PaymentNetwork",
  components: {
  },
  props: {
    validFor: "",
    eternal: true,
    assetHash: null
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
    chooseNetwork(network) {
      this.$emit("chooseNetwork", network);
    },
  }
};
</script>
<style scoped>
</style>
