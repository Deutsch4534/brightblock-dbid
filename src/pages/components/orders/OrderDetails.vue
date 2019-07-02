<template>
<div class="row p-4">
  <div class="col-5">
    <!--Featured image-->
    <item-image-list-view :item="item"/>
  </div>
  <div class="col-7">
    <div class="row pb-3">
      <div class="col-3"><b>Order</b></div>
      <div class="col-2"><b>%</b></div>
      <div class="col-2"><b>{{purchaseCycle.currency}}</b></div>
      <div class="col-2"><b>BTC</b></div>
    </div>
    <div class="row pb-3" v-if="showDetails">
      <div class="col-3">Seller</div>
      <div class="col-2"></div>
      <div class="col-2">{{purchaseCycle.seller.amountFiat}}</div>
      <div class="col-2">{{purchaseCycle.seller.amountBitcoin}}</div>
    </div>
    <div class="row pb-3" v-for="(row, index) in purchaseCycle.residuals" :key="index" v-if="showDetails & isNotArtist">
      <div class="col-3" v-html="fetchLabel(row.label)" style="text-transform: capitalize;"></div>
      <div class="col-2">{{row.rate}}</div>
      <div class="col-2">{{row.amountFiat}}</div>
      <div class="col-2">{{row.amountBitcoin}}</div>
    </div>
    <div class="row pb-3" v-if="showDetails">
      <div class="col-3">Platform</div>
      <div class="col-2">{{purchaseCycle.platform.rate}}</div>
      <div class="col-2">{{purchaseCycle.platform.amountFiat}}</div>
      <div class="col-2">{{purchaseCycle.platform.amountBitcoin}}</div>
    </div>
    <div class="row pb-3">
      <div class="col-5"><b>Total</b></div>
      <div class="col-2"><b>{{purchaseCycle.buyer.amountFiat}}</b></div>
      <div class="col-2"><b>{{purchaseCycle.buyer.amountBitcoin}}</b></div>
    </div>
    <!--
    <div class="row">
      <div class="col-12"><a class="teal-text darken-3" @click.prevent="showDetails = !showDetails"><span v-if="!showDetails">show more details</span><span v-else>show less</span></a></div>
    </div>
    -->
  </div>
</div>
</template>

<script>
import moment from "moment";
import _ from "lodash";
import ItemImageListView from "@/pages/components/myItem/ItemImageListView";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "OrderDetails",
  components: {
    ItemImageListView
  },
  props: {
    purchaseCycle: {},
    item: null
  },
  data() {
    return {
      showDetails: true,
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
