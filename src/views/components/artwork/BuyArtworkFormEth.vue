<template>
  <div>
    <!-- TODO: Connect currency buttons to conditionally display price next to button -->
    <div>
      {{fiatMessage}} <mdb-btn size="sm" color="white" rounded>EUR</mdb-btn>
      {{btcMessage}} <mdb-btn size="sm" color="white" rounded>BTC</mdb-btn>
      {{ethMessage}} <mdb-btn size="sm" color="white" rounded>ETH</mdb-btn>
    </div>
    <div class="d-flex align-items-center justify-content-start pt-5">
      <p v-html="fiatMessage" class="inline-block mb-0"></p>
      <p v-html="ethMessage" class="inline-block mb-0"></p>
      <p v-html="btcMessage" class="inline-block mb-0"></p>
    </div>
    <div class="row">
      <div class="col-12 mt-3">
        <mdb-btn @click="buyArtwork()" :disabled="!purchaseState.canBuy" type="submit" size="md" class="btn teal lighten-1">Buy Artwork</mdb-btn>
      </div>
    </div>
    <div class="w-100"></div>
  </div>
</template>

<script>
import { mdbIcon, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "BuyArtworkFormEth",
  components: {
    mdbIcon,
    mdbBtn
  },
  props: {
    purchaseState: {},
    artwork: {
      type: Object,
      default() {
        return {
          bcitem: {}
        };
      }
    }
  },
  methods: {
    buyArtwork() {
      this.$emit("buy");
    }
  },
  computed: {
    fiatMessage() {
      try {
        return (this.artwork.bcitem.fiatCurrencySymbol + " " + this.artwork.bcitem.priceInFiat);
      } catch (e) {
        return "";
      }
    },
    ethMessage() {
      try {
        return this.artwork.bcitem.priceInEth;
      } catch (e) {
        return "";
      }
    },
    btcMessage() {
      try {
        return this.artwork.bcitem.priceInBtc;
      } catch (e) {
        return "";
      }
    }
  }
};
</script>
