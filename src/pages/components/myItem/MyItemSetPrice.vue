<template>
<div class="row">
  <div class="col-lg-5 col-xl-4 mb-4">
    <item-image-list-view :item="item"/>
  </div>
  <div class="col-lg-7 col-xl-7 ml-xl-4 mb-4">
    <item-action-links :item="item" :itemAction="'set-price'" :asset="asset" :buttonMode="false"/>
    <form class="needs-validation pt-3 form-transparent bg-card p-2" novalidate @submit.prevent="checkForm" id="setPriceForm">
      <div class="form-group mb-3" :key="errors.length">
        <mdb-alert color="danger" v-if="errors.length" :key="errors.length" class="w-100">
          <h6 class="alert-heading">Please correct the following;</h6>
          <hr>
          <ul class="list-unstyled small">
            <li v-for="(error) in errors" :key="error" v-bind:error="error">{{ error }}</li>
          </ul>
        </mdb-alert>
      </div>

      <div v-if="isAuctions">
        <div class="form-row">
          <div class="col-4">
            <mdb-btn type="button" color="white" size="md" class="btn-rounded btn-block"
                     value="direct" v-model="mySalePlace" @click.native="mySalePlace = 'marketplace'" :active="mySalePlace === 'marketplace'" required>
              Radicle Marketplace
            </mdb-btn>
          </div>
          <div class="offset-1 col-4">
            <mdb-btn type="button" color="white" size="md" class="btn-rounded btn-block"
                     value="auction" v-model="mySalePlace" @click.native="mySalePlace = 'auctionplace'" :active="mySalePlace === 'auctionplace'" required>
              Auction
            </mdb-btn>
          </div>
        </div>
      </div>
      <div v-else class="mb-3">
        <h4 v-if="mySaleType === 'direct'">Sell via: buy now</h4>
        <h4 v-if="mySaleType === 'auction'">Sell via: bidding</h4>
      </div>

      <div class="d-flex justify-content-between mb-4">
        <mdb-btn type="button" color="white" size="sm" class="btn-rounded btn-block mr-3"
                 value="direct" v-model="mySaleType" @click.native="mySaleType = 'direct'" :active="mySaleType === 'direct'" required>
          Buy Now (Fixed Price)
        </mdb-btn>
        <mdb-btn type="button" color="white" size="sm" class="btn-rounded btn-block ml-3"
                 value="auction" v-model="mySaleType" @click.native="mySaleType = 'auction'" :active="mySaleType === 'auction'" required>
          Via Bidding
        </mdb-btn>
      </div>

      <div v-if="mySaleType === 'direct'">
        <div class="col-md-12">
          <mdb-popover trigger="click" :options="{placement: 'top'}">
            <div class="popover">
              <div class="popover-header">Amount {{currencySymbol}}</div>
              <div class="popover-body">
                Your item will sell for this amount in fiat currency and converted to bitcoin at time of sale.
              </div>
            </div>
            <a @click.prevent="" slot="reference">Amount {{currencySymbol}}</a>
          </mdb-popover>
          <input type="number" step="0.01" class="form-control" id="vc-amount" placeholder="Fixed value of item" v-model="amount" required >
          <div class="invalid-feedback">
            Please enter the amount!
          </div>
          <p class="d-flex justify-content-end text-muted small mt-1">{{valueInBitcoin(amount)}} Btc / {{valueInEther(amount)}} Eth</p>
        </div>
      </div>
      <div v-else>
      <div class="d-flex" v-if="isAuctions && mySalePlace === 'auctionplace'">
        <div class="col-md-12">
          <mdb-popover trigger="click" :options="{placement: 'top'}">
            <div class="popover">
              <div class="popover-header">Select Auction</div>
              <div class="popover-body">
                Add this item to an auction that you have set up and that have not yet finished.
              </div>
            </div>
            <a @click.prevent="" slot="reference">Select Auction</a>
          </mdb-popover>
          <select id="vc-auctionid" class="form-control browser-default custom-select" v-model="auctionId" name="auctionId" min="1" required>
            <option v-for="(auction,key) in auctions" :key="key" :value="auction.auctionId">{{ auction.title }}</option>
          </select>
          <div class="invalid-feedback">
            Please select the auction!
          </div>
        </div>
      </div>

      <div class="col-md-12">
        <mdb-popover trigger="click" :options="{placement: 'top'}">
          <div class="popover">
            <div class="popover-header">Reserve {{currencySymbol}}</div>
            <div class="popover-body">
              Your item will not sell for less than this amount.
            </div>
          </div>
          <a @click.prevent="" slot="reference">Reserve {{currencySymbol}}</a>
        </mdb-popover>
        <input type="number" step="0.01" class="form-control" id="vc-reserve" placeholder="Reserve price" v-model="reserve" required min="1">
        <div class="invalid-feedback">
          Please enter the reserve!
        </div>
        <p class="d-flex justify-content-end text-muted small mt-1">{{valueInBitcoin(reserve)}} Btc / {{valueInEther(reserve)}} Eth</p>
      </div>
      <div class="col-md-12">
        <mdb-popover trigger="click" :options="{placement: 'top'}">
          <div class="popover">
            <div class="popover-header">Opening Bid {{currencySymbol}}</div>
            <div class="popover-body">
              Bidding on this item starts at this amount.
            </div>
          </div>
          <a @click.prevent="" slot="reference">Opening Bid {{currencySymbol}}</a>
        </mdb-popover>
        <input type="number" step="0.01" class="form-control" id="vc-openingBid" placeholder="Opening bid" v-model="openingBid" required min="0">
        <div class="invalid-feedback">
          Please enter the opening bid!
        </div>
        <p class="d-flex justify-content-end text-muted small mt-1">{{valueInBitcoin(openingBid)}} Btc / {{valueInEther(openingBid)}} Eth</p>
      </div>
      <div class="col-md-12">
        <mdb-popover trigger="click" :options="{placement: 'top'}">
          <div class="popover">
            <div class="popover-header">Increment {{currencySymbol}}</div>
            <div class="popover-body">
              The amount the value increases by after a bid is placed.
            </div>
          </div>
          <a @click.prevent="" slot="reference">Increment {{currencySymbol}}</a>
        </mdb-popover>
        <input type="number" step="0.01" class="form-control" id="vc-increment" placeholder="increment value" v-model="increment" required min="1">
        <div class="invalid-feedback">
          Bidding increment is required.
        </div>
        <p class="d-flex justify-content-end text-muted small mt-1">{{valueInBitcoin(increment)}} Btc / {{valueInEther(increment)}} Eth</p>
      </div>

      <div class="col-md-12">
        <mdb-popover trigger="click" :options="{placement: 'top'}">
          <div class="popover">
            <div class="popover-header">Bidding Ends</div>
            <div class="popover-body">
              Bidding ends at this time.
            </div>
          </div>
          <a @click.prevent="" slot="reference">Bidding Ends</a>
        </mdb-popover>
        <datetime type="datetime" v-model="biddingEnds" input-id="biddingEnds" input-class="form-control bg-transparent mb-5">
          <input id="biddingEnds">
        </datetime>
        <div class="invalid-feedback">
          Please enter the bidding end time!
        </div>
      </div>
    </div>

    <div class="col-md-12">
      <mdb-popover trigger="click" :options="{placement: 'top'}">
        <div class="popover">
          <div class="popover-header">Currency</div>
          <div class="popover-body">
            The item will be sold for the amount of bitcoin that is equivalent to the
            sale value in the Fiat currency you set here.
          </div>
        </div>
        <a @click.prevent="" slot="reference">Select Currency {{currency}} <mdb-icon far icon="question-circle" /></a>
      </mdb-popover>
      <select id="vc-currency" class="form-control browser-default custom-select" v-model="currency" minlength="3" required>
        <option v-for="(value, key) in fiatRates" :key="key" :value="key" v-bind:value="key">{{ key }}</option>
      </select>
      <div class="invalid-feedback">
        Please select the currency!
      </div>
      <p class="d-flex justify-content-end text-muted small mt-1">{{conversionMessage}}</p>
    </div>

    <div class="d-flex justify-content-start">
      <button class="btn btn-primary btn-sm mr-4">Save</button>
      <button class="btn btn-primary btn-sm" @click.prevent="removeFromSale()">Reset</button>
    </div>
  </form>
  </div>
</div>
</template>

<script>
import notify from "@/notify";
import moment from "moment";
import ethereumService from "@/services/ethereumService";
import moneyUtils from "@/services/moneyUtils";
import { mdbPopover, mdbIcon, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import { mdbBtnGroup, mdbContainer, mdbRow, mdbCol, mdbAlert } from 'mdbvue';
import { Datetime } from 'vue-datetime'
import ItemImageListView from "./ItemImageListView";
import ItemActionLinks from "./ItemActionLinks";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyItemSetPrice",
  components: {
    ItemImageListView, ItemActionLinks, mdbCardBody,
    mdbPopover,
    mdbIcon,
    mdbCardTitle,
    mdbCardText,
    mdbContainer,
    mdbBtn,
    mdbBtnGroup,
    mdbRow,
    mdbCol,
    mdbAlert,
    datetime: Datetime,
  },
  props: ["item", "asset", "saleType", "allowChange"],
  data() {
    return {
      errors: [],
      mySaleType: "direct",
      mySalePlace: "marketplace",
      loading: true,
      auctionId: -1,
      amount: 0,
      reserve: 0,
      increment: 0,
      openingBid: 0,
      currency: "EUR",
      biddingEnds: null,
    };
  },
  mounted() {
    this.$store.dispatch("myAuctionsStore/fetchMyAuctions").then(() => {
      this.loading = false;
    });
    if (this.item.saleData.fiatCurrency) {
      this.currency = this.item.saleData.fiatCurrency;
    }
    // this.mySaleType = (this.item.saleData.soid === 2) ? 'direct'  : 'auction',
    this.auctionId = this.item.saleData.auctionId;
    if (this.item.saleData.soid === 2) {
      this.mySaleType = "auction";
    }
    this.auctionId = this.item.saleData.auctionId;
    this.amount = this.item.saleData.amount;
    this.reserve = this.item.saleData.reserve;
    this.increment = this.item.saleData.increment;
    this.openingBid = (this.item.saleData.openingBid) ? this.item.saleData.openingBid : 0;
    if (this.item.saleData.biddingEnds) {
      this.biddingEnds = moment(this.item.saleData.biddingEnds).format();
    } else {
      let dd = moment({}).add(2, "weeks");
      dd.hour(10);
      dd.minute(0);
      this.biddingEnds = dd.add(2, "days").format();
    }
  },
  computed: {
    canAuction() {
      let auctions = this.$store.getters["myAuctionsStore/myAuctionsFuture"];
      let cs = this.$store.getters["myItemStore/canSell"](this.item.id);
      return cs && auctions && auctions.length > 0;
    },

    isSelling() {
      return this.item.saleData.soid > 0;
    },

    fiatRates() {
      return this.$store.getters["conversionStore/getFiatRates"];
    },

    auctions() {
      try {
        return this.$store.getters["myAuctionsStore/myAuctionsFuture"];
      } catch (e) {
        return [];
      }
    },

    isAuctions() {
      try {
        return this.$store.getters["myAuctionsStore/myAuctionsFuture"].length > 0;
      } catch (e) {
        return false;
      }
    },

    conversionMessage() {
      let fiatRate = this.$store.getters["conversionStore/getFiatRate"](this.currency);
      let ethToBtc = this.$store.getters["conversionStore/getCryptoRate"]("eth_btc");
      return moneyUtils.conversionMessage(this.currency, fiatRate, ethToBtc);
    },

    currencySymbol() {
      let fiatRate = this.$store.getters["conversionStore/getFiatRate"](this.currency);
      return fiatRate["symbol"];
    }
  },
  methods: {
    valueInBitcoin(amount) {
      let fiatRate = this.$store.getters["conversionStore/getFiatRate"](this.currency);
      return moneyUtils.valueInBitcoin(amount, fiatRate);
    },
    valueInEther(amount) {
      let fiatRate = this.$store.getters["conversionStore/getFiatRate"](this.currency);
      let ethToBtc = this.$store.getters["conversionStore/getCryptoRate"]("eth_btc");
      return moneyUtils.valueInEther(this.currency, amount, fiatRate, ethToBtc);
    },

    removeFromSale: function() {
      let item = this.item;
      item.status = this.$store.state.constants.statuses.item.NOT_SELLING;
      item.saleData.soid = 0;
      item.saleData.amount = this.amount = 0;
      item.saleData.reserve = this.reserve = 0;
      item.saleData.openingBid = this.openingBid = 0;
      item.saleData.increment = this.increment = 0;
      item.saleData.auctionId = this.auctionId = null;
      /**
      this.$emit("registerSaleInfo", {operation: "start", amount: this.amount, currency: this.currency});
      let $self = this;
      $self.$store.dispatch("myItemStore/updateItem", {item: item, updateProvData: false})
        .then(() => {
          $self.$emit("registerSaleInfo", {operation: "done"});
        });
      **/
    },

    upload: function() {
      let item = this.item;
      if (this.mySaleType === "direct") {
        item.saleData.soid = 1;
      } else {
        item.saleData.soid = 2;
      }
      item.status = this.$store.state.constants.statuses.item.PURCHASE_ENABLED;
      item.saleData.salePlace = this.mySalePlace;
      item.saleData.amount = Number(this.amount);
      item.saleData.reserve = Number(this.reserve);
      item.saleData.increment = Number(this.increment);
      item.saleData.openingBid = Number(this.openingBid);
      item.saleData.biddingEnds = moment(this.biddingEnds).valueOf();
      item.saleData.auctionId = Number(this.auctionId);
      if (this.mySalePlace === "marketplace") {
        item.saleData.auctionId = null;
      }
      item.saleData.fiatCurrency = this.currency;
      let fiatRates = this.$store.getters["conversionStore/getFiatRates"];
      item.saleData.initialRateBtc = fiatRates[this.currency]["15m"];
      let ethToBtc = this.$store.getters["conversionStore/getCryptoRate"]("eth_btc");
      item.saleData.initialRateEth = ethToBtc;

      let fiatRate = this.$store.getters["conversionStore/getFiatRate"](this.currency);
      item.saleData.amountInEther = moneyUtils.valueInEther(this.currency, item.saleData.amount, fiatRate, ethToBtc);

      this.$notify({type: 'warning', title: 'Set Price', text: 'Setting price - please wait...'});
      this.$store.dispatch("myItemStore/updateItem", {item: item, updateProvData: false})
        .then(() => {
          this.$notify({type: 'success', title: 'Set Price', text: 'Price information set.'});
        });
    },
    checkForm(event) {
      if (event) {
        event.preventDefault();
        event.target.classList.add('was-validated');
      }
      this.errors = [];
      if (!this.currency) {
        this.errors.push("Please select a fiat currency.");
      }
      if (this.mySaleType === "direct") {
        if (!this.amount || this.amount.length === 0) {
          this.errors.push("Amount is required.");
        }
      } else {
        if (this.reserve === 0) {
          this.errors.push("Reserve is required.");
        }
        if (moment(this.biddingEnds).isBefore(moment({}))) {
          this.errors.push("End date before now.");
        }
        if (this.mySalePlace === "auctionplace" && !this.auctionId || this.auctionId === -1) {
          this.errors.push("Please indicate an auction.");
        }
        if (this.increment === 0) {
          this.errors.push("Increment is required.");
        }
      }
      if (this.errors.length > 0) {
        return false;
      } else {
        this.upload();
      }
    }
  }
};
</script>
