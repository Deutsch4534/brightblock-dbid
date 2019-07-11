<template>
<div>
<div class="row">
  <div class="col-2">
    <!--Featured image-->
    <img style="max-height: 100px; max-width: 100%; border-top-left-radius: 10px; border-top-right-radius: 10px; border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;" :src="item.images[0].dataUrl"  :alt="item.title"/>
  </div>
  <div class="col-10">
    <div class="row pb-1">
      <div class="col-2"><b>Order</b></div>
      <div class="col-1"><b>%</b></div>
      <div class="col-2"><b>{{purchaseCycle.currency}}</b></div>
      <div class="col-2"><b>BTC</b></div>
    </div>
    <div class="row pb-1" v-if="showDetails">
      <div class="col-2">Seller</div>
      <div class="col-1"></div>
      <div class="col-2">{{purchaseCycle.seller.amountFiat}}</div>
      <div class="col-2">{{purchaseCycle.seller.amountBitcoin}}</div>
    </div>
    <div class="row pb-1" v-for="(row, index) in purchaseCycle.residuals" :key="index" v-if="showDetails & isNotArtist">
      <div class="col-2" v-html="fetchLabel(row.label)" style="text-transform: capitalize;"></div>
      <div class="col-1">{{row.rate}}</div>
      <div class="col-2">{{row.amountFiat}}</div>
      <div class="col-2">{{row.amountBitcoin}}</div>
    </div>
    <div class="row pb-1" v-if="showDetails">
      <div class="col-2">Platform</div>
      <div class="col-1">{{purchaseCycle.platform.rate}}</div>
      <div class="col-2">{{purchaseCycle.platform.amountFiat}}</div>
      <div class="col-2">{{purchaseCycle.platform.amountBitcoin}}</div>
    </div>
    <div class="row">
      <div class="col-3"><b>Total</b></div>
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
