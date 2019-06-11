<template>
<div class="row mb-5" v-if="!loading">
  <div class="col-12">
    <div class="row order-header">
      <div class="col-md-9 col-sm-12">
        <h2 style="text-transform: capitalize;">{{artwork.title}}</h2>
      </div>
      <div class="col-md-3">
      </div>
    </div>
    <div class="row">
      <div class="col-md-3 col-sm-4">
        <img class="img-fluid" :src="artwork.image" :alt="artwork.title">
      </div>
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
          <payment-expired :assetHash="assetHash" :artworkId="artworkId"/>
        </div>
      </div>
      <div class="col-md-3 col-sm-6" v-else-if="asset.status > 3">
        <confirmation-details :debugMode="debugMode" :assetHash="assetHash" :purchaseCycle="purchaseCycle" @paySeller="paySeller"/>
      </div>
      <div class="col-md-3 col-sm-6" v-else-if="purchased">
        Purchase successful - the artwork has been transferred to your storage.
        <br/>
        <router-link :to="myArtworkUrl" class="inline-block">
          <mdb-btn class="btn teal lighten-1" size="sm" waves-light>manage artwork</mdb-btn>
        </router-link>
      </div>
      <div class="col-md-3 col-sm-6" v-else>
        <payment-expired :assetHash="assetHash" :artworkId="artworkId"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mdbBtn, mdbContainer } from "mdbvue";
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import artworkSearchService from "@/services/artworkSearchService";
import myArtworksService from "@/services/myArtworksService";
import PaymentDetailsBtc from "./PaymentDetailsBtc";
import PaymentDetailsLnd from "./PaymentDetailsLnd";
import PaymentExpired from "./PaymentExpired";
import ConfirmationDetails from "./ConfirmationDetails";
import OrderDetails from "./OrderDetails";
import moment from "moment";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "OrderItem",
  components: {
    mdbBtn, mdbContainer,
    OrderDetails,
    ConfirmationDetails,
    PaymentDetailsBtc, PaymentDetailsLnd, PaymentExpired
  },
  props: {
    assetHash: null,
    debugMode: false,
    myProfile: null
  },
  data() {
    return {
      loading: true,
      network: "bitcoin",
      showConfirmationDetails: false,
      bitcoinUri: null,
      lightningUri: null,
      artwork: null,
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
        let artworkId = Number(asset.assetId.split("_::_")[1]);
        let $self = this;
        artworkSearchService.newQuery(this.$store, {field: "id", query: artworkId}, function(artwork) {
          $self.artwork = artwork;
          if (asset.status === -1) {
            //$self.$router.push("/artworks/" + artwork.id);
            //return;
          }
          if (asset.status === 3) {
            let purchaseCycle = $self.$store.getters["assetStore/getCurrentPurchaseCycleByHash"]($self.assetHash);
            if ($self.paymentExpired(purchaseCycle) < 0) {
              $self.$store.dispatch("assetStore/cancelPurchase", asset.assetHash);
            } else {
              $self.startCountdown();
              $self.bitcoinUri = bitcoinService.getBitcoinUri(asset);
              $self.lightningUri = bitcoinService.getLightningUri(asset);
            }
          } else if (asset && asset.status === 7) {
            $self.$store.dispatch("myArtworksStore/transferArtworkToBuyer", asset).then((asset) => {
              $self.$notify({type: 'success', title: 'Artwork Transferred', text: 'Artwork transferred to your storage.'});
            });
          }

          $self.loading = false;
        });
      } else {
        console.log("Order id but no order?");
      }
    })
  },
  methods: {
    startCountdown() {
      let $self = this;
      let countdown = setInterval(function() {
        let purchaseCycle = $self.$store.getters["assetStore/getCurrentPurchaseCycleByHash"]($self.assetHash);
        let asset = $self.$store.getters["assetStore/getAssetByHash"]($self.assetHash);
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
              this.$store.dispatch("myArtworksStore/transferArtworkToBuyer", asset).then((asset) => {
                this.$notify({type: 'success', title: 'Artwork Transferred', text: 'Artwork transferred to your storage.'});
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
      return asset;
    },
    myArtworkUrl() {
      if (this.artwork) return `/my-artworks/${this.artwork.id}`;
    },
    purchased() {
      return this.myProfile.username === this.artwork.owner;
    },
    artworkId() {
        if (this.artwork) return this.artwork.id;
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
