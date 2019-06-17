<template>
<div class="row mb-5">
  <div class="col-12">
    <div class="row">
      <div class="col-md-6 col-sm-8">
        <order-details :purchaseCycle="purchaseCycle"/>
      </div>
      <div class="col-md-3 col-sm-6" v-if="asset.status === 3">
        <div v-if="!purchaseExpired">
          <div>
            Pay using: <a @click.prevent="toggleNetwork()"><b><u>{{network}}</u></b></a>
          </div>
          <payment-details-btc v-if="network === 'bitcoin'" :paymentUri="bitcoinUri" :validFor="validFor"/>
          <payment-details-lnd v-else :paymentUri="lightningUri" :validFor="validFor"/>
        </div>
        <div v-else>
          <payment-expired :assetHash="assetHash" :itemId="itemId"/>
        </div>
      </div>
      <div class="col-md-3 col-sm-6" v-else-if="asset.status > 3">
        <confirmation-details :debugMode="debugMode" :assetHash="assetHash" :purchaseCycle="purchaseCycle" @paySeller="paySeller"/>
      </div>
      <div class="col-md-3 col-sm-6" v-else-if="purchased">
        Purchase successful - the item has been transferred to your storage.
        <br/>
        <router-link :to="myItemUrl" class="inline-block">
          <mdb-btn class="btn teal lighten-1" size="sm" waves-light>manage item</mdb-btn>
        </router-link>
      </div>
      <div class="col-md-3 col-sm-6" v-else>
        <payment-expired :assetHash="assetHash" :itemId="itemId"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mdbBtn } from "mdbvue";
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import PaymentDetailsBtc from "./PaymentDetailsBtc";
import PaymentDetailsLnd from "./PaymentDetailsLnd";
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
    PaymentDetailsBtc, PaymentDetailsLnd, PaymentExpired
  },
  props: {
    debugMode: false,
    myProfile: null,
    assetHash: null
  },
  data() {
    return {
      loading: true,
      network: "bitcoin",
      showConfirmationDetails: false,
      bitcoinUri: null,
      lightningUri: null,
      item: null,
      validFor: 100,
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
        let itemId = Number(asset.assetId.split("_::_")[1]);
        this.$store.dispatch("itemSearchStore/fetchItem", itemId).then((item) => {
          this.item = item;
          if (asset.status === -1) {
            //this.$router.push("/items/" + this.item.id);
            //return;
          }
          if (asset.status === 3) {
            let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
            if (this.paymentExpired(purchaseCycle) < 0) {
              this.$store.dispatch("assetStore/cancelPurchase", asset.assetHash);
            } else {
              this.startCountdown();
              this.bitcoinUri = bitcoinService.getBitcoinUri(asset);
              this.lightningUri = bitcoinService.getLightningUri(asset);
            }
          } else if (asset && asset.status === 7) {
            this.$store.dispatch("myItemStore/transferItemToBuyer", asset).then((asset) => {
              this.$notify({type: 'success', title: 'Item Transferred', text: 'Item transferred to your storage.'});
            });
          }
          this.loading = false;
        });
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
          $self.validFor = $self.paymentExpired(purchaseCycle);
          let expired = $self.validFor < 0;
          if (expired) {
            $self.purchaseExpired = true;
            clearInterval(countdown);
          }
        }
      }, 5000);
    },
    paymentExpired(purchaseCycle) {
      let now = moment({}).valueOf();
      let diff = now - purchaseCycle.created;
      return (100 - ((diff) / 1000));
    },
    toggleNetwork() {
      if (this.network === "bitcoin") {
        this.network = "lightning";
      } else {
        this.network = "bitcoin";
      }
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
