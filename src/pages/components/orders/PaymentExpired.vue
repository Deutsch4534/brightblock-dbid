<template>
<div class="row">
  <div class="col-md-12 pt-3">
    Purchase has expired for this order placed on <br/> {{purchaseCycleEnded()}}
    <br/>
    <a @click.prevent="returnToArtwork"><u>Return to artwork page</u></a>
  </div>
  <div class="col-md-12">
  </div>
</div>
</template>

<script>
import moment from "moment";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "PaymentExpired",
  components: {
  },
  props: {
    assetHash: null,
    artworkId: null
  },
  data() {
    return {
    };
  },
  mounted() {

  },
  computed: {
    artworkUrl() {
      return `/artworks/${this.artworkId}`;
    }
  },
  methods: {
    purchaseCycleEnded() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      return moment(purchaseCycle.created).format();
    },
    returnToArtwork() {
      this.$store.dispatch("assetStore/cancelPurchase", this.assetHash).then((asset) => {
        this.$router.push("/artworks/" + this.artworkId);
      })
    }
  }
};
</script>
