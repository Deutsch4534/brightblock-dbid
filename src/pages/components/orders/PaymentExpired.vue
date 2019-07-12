<template>
<div class="row">
  <div class="col-md-12 pt-3">
    Purchase has expired for this order placed on
    <br/> {{purchaseCycleEnded()}}
    <br/>
    <a @click.prevent="cancelOrder()"><u>Cancel Order</u></a>
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
    itemId: null
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
    purchaseCycleEnded() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      return moment(purchaseCycle.created).format();
    },
    cancelOrder() {
      this.$store.dispatch("assetStore/cancelPurchase", this.assetHash);
      this.$router.push("/items/" + this.itemId);
    },
  }
};
</script>
