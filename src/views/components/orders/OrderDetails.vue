<template>
<div class="container mb-5">
  <div class="row py-3">
    <div class="col-2"><b>Order</b></div>
    <div class="col-4"></div>
    <div class="col-2"><b>Rate</b></div>
    <div class="col-2"><b>{{purchaseCycle.currency}}</b></div>
    <div class="col-2"><b>BTC</b></div>
  </div>
  <div class="row py-3" v-if="showDetails">
    <div class="col-2">Seller</div>
    <div class="col-4">{{purchaseCycle.seller.did}}</div>
    <div class="col-2"></div>
    <div class="col-2">{{purchaseCycle.seller.amountFiat}}</div>
    <div class="col-2">{{purchaseCycle.seller.amountBitcoin}}</div>
  </div>
  <div class="row" v-for="(row, index) in purchaseCycle.residuals" :key="index" v-if="showDetails & isNotArtist">
    <div class="col-2" v-html="fetchLabel(row.label)" style="text-transform: capitalize;"></div>
    <div class="col-4">{{row.did}}</div>
    <div class="col-2">{{row.rate}}</div>
    <div class="col-2">{{row.amountFiat}}</div>
    <div class="col-2">{{row.amountBitcoin}}</div>
  </div>
  <div class="row py-3" v-if="showDetails">
    <div class="col-2">Platform</div>
    <div class="col-4"></div>
    <div class="col-2">{{purchaseCycle.platform.rate}}</div>
    <div class="col-2">{{purchaseCycle.platform.amountFiat}}</div>
    <div class="col-2">{{purchaseCycle.platform.amountBitcoin}}</div>
  </div>
  <div class="row">
    <div class="col-8"><b>Total</b></div>
    <div class="col-2"><b>{{purchaseCycle.buyer.amountFiat}}</b></div>
    <div class="col-2"><b>{{purchaseCycle.buyer.amountBitcoin}}</b></div>
  </div>
  <div class="row">
    <div class="col-12"><a class="teal-text darken-3" @click.prevent="showDetails = !showDetails"><span v-if="!showDetails">show more details</span><span v-else>show less</span></a></div>
  </div>
</div>
</template>

<script>
import moment from "moment";
import myArtworksService from "@/services/myArtworksService";
import _ from "lodash";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "OrderDetails",
  components: {
  },
  props: {
    purchaseCycle: {},
  },
  data() {
    return {
      showDetails: false,
    };
  },
  mounted() {
  },
  computed: {
    isNotArtist() {
      let seller = this.purchaseCycle.seller.did;
      _.forEach(this.purchaseCycle.residuals, function(res){
        if (res.label.indexOf("creator") > -1) {
          return seller !== res.did;
        }
      })
      return false;
    },
  },
  methods: {
    fetchLabel(lbe) {
      if (lbe) {
        return lbe.split("_::_")[2];
      }
    },
  }
};
</script>
