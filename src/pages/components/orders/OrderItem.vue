<template>
<div class="container bg-card p-3 text-center" role="status" v-if="loading">
  <div class="container spinner-border text-center" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
<div class="row" v-else>
  <div class="col-12" v-if="asset.status === 3">
    <div v-if="eternal || !purchaseExpired">
      <payment-details :eternal="eternal" :asset="asset" :validFor="validFor"/>
    </div>
    <div v-else>
      <payment-expired :assetHash="assetHash" :itemId="itemId"/>
    </div>
  </div>
  <div class="col-12" v-else-if="asset.status > 3">
    <confirmation-details :debugMode="debugMode" :assetHash="assetHash" :purchaseCycle="purchaseCycle" @paySeller="paySeller"/>
  </div>
  <div class="col-12" v-else-if="purchased">
    Purchase successful - the item has been transferred to your storage.
    <br/>
    <router-link class="btn btn-primary btn-md waves-effect waves-light" :to="myItemUrl">manage item</router-link>
  </div>
  <div class="col-12" v-else>
    <payment-expired :assetHash="assetHash" :itemId="item.id"/>
  </div>
</div>
</template>

<script>
import { mdbBtn } from "mdbvue";
import PaymentDetails from "./PaymentDetails";
import PaymentExpired from "./PaymentExpired";
import ConfirmationDetails from "./ConfirmationDetails";
import OrderDetails from "./OrderDetails";
import moment from "moment";
import utils from "@/services/utils";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "OrderItem",
  components: {
    mdbBtn,
    OrderDetails,
    ConfirmationDetails,
    PaymentDetails, PaymentExpired
  },
  props: {
    debugMode: false,
    myProfile: null,
    assetHash: null,
    item: null
  },
  data() {
    return {
      loading: true,
      eternal: true,
      showConfirmationDetails: false,
      validFor: 3600,
      myPaymentInterval: null,
      purchaseExpired: false
    };
  },
  beforeDestroy() {
    if (this.myPaymentInterval) {
      clearInterval(this.myPaymentInterval);
    }
  },
  mounted() {
    this.$store.dispatch("assetStore/lookupAssetByHash", this.assetHash).then(asset => {
      if (asset) {
        if (asset.status === -1) {
          //this.$router.push("/items/" + this.item.id);
          //return;
        }
        if (asset.status === 3) {
          let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
          this.startCountdown();
          if (this.paymentExpired(purchaseCycle) < 0) {
            this.$emit("cancelOrder", this.assetHash);
            return;
          }
        } else if (asset && asset.status === 7) {
          this.$store.dispatch("myItemStore/transferItemToBuyer", asset).then((asset) => {
            this.$notify({type: 'success', title: 'Item Transferred', text: 'Item transferred to your storage.'});
          });
        }
        this.loading = false;
      } else {
        console.log("Order id but no order?");
      }
    });
  },
  methods: {
    startCountdown() {
      let $self = this;
      let asset = $self.$store.getters["assetStore/getAssetByHash"]($self.assetHash);
      let purchaseCycle = $self.$store.getters["assetStore/getCurrentPurchaseCycleByHash"]($self.assetHash);
      if (!purchaseCycle) {
        return;
      }
      let countdown = setInterval(function() {
        if (!purchaseCycle) {
          clearInterval(countdown);
          return;
        }
        if (asset.status !== 3 || purchaseCycle.buyer.chainData.txid) {
          clearInterval(countdown);
        }
        if (purchaseCycle.buyer.chainData.txid) {
          clearInterval(countdown);
        } else {
          let now = moment({}).valueOf();
          //let diff = (now - purchaseCycle.created) / 1000;
          let diff = 3600 - ((now - purchaseCycle.created) / 1000);
          $self.validFor = diff; // $self.paymentExpired(purchaseCycle);
          let expired = $self.validFor < 0;
          if (expired) {
            $self.purchaseExpired = true;
            clearInterval(countdown);
          }
        }
      }, 1000);
    },
    paymentExpired(purchaseCycle) {
      let now = moment({}).valueOf();
      let diff = now - purchaseCycle.created;
      return (100 - ((diff) / 1000));
    },
    paySeller() {
      let $self = this;
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      if (!purchaseCycle.seller.chainData.txid) {
        this.$store.dispatch("assetStore/paySeller", asset).then((asset) => {
          if (asset) {
            this.$notify({type: 'success', title: 'Payment Sent', text: 'Payment has been forwarded.'});
            if (asset && asset.status === 7) {
              this.$store.dispatch("myItemStore/transferItemToBuyer", asset).then((asset) => {
                this.$notify({type: 'success', title: 'Item Transferred', text: 'Item transferred to your storage.'});
              });
            }
          }
        });
      }
    }
  },
  computed: {
    purchaseCycle() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      return purchaseCycle;
    },
    asset() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      if (asset) {
        return asset;
      }
      return {};
    },
    myItemUrl() {
      return `/my-items/${this.item.id}`;
    },
    purchased() {
      return this.item && this.myProfile.username === this.item.owner;
    },
    itemId() {
        if (this.item) return this.item.id;
    }
  }
};
</script>
<style scoped>
.order-header {
  text-transform: capitalise;
  font-weight: bold;
  font-size: 2.0em;
  border-bottom: 1pt solid #ccc;
  padding: 5px;
  margin-bottom: 5px;
}
.media-image {
  width: 20%;
}
.subtitle,
.card-body p {
  color: #000!important;
}
</style>
