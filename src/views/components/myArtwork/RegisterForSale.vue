<template>
<mdb-card-body v-if="!loading">
  <form class="needs-validation py-5 form-transparent" novalidate @submit.prevent="checkForm" id="setPriceForm">
  <mdb-card-text>

      <div class="form-group mb-3" :key="errors.length">
        <mdb-alert color="danger" v-if="errors.length" :key="errors.length" class="w-100">
          <h4 class="alert-heading h6">Please correct the following error(s):</h4>
          <hr>
          <ul class="list-unstyled small">
            <li v-for="(error) in errors" :key="error" v-bind:error="error">{{ error }}</li>
          </ul>
        </mdb-alert>
      </div>

      <div v-if="isAuctions">
        <div class="row">
          <div class="col-12">
            <h6>Where to sell this item?</h6>
          </div>
        </div>
        <div class="form-row mb-4">
          <div class="col-6">
            <mdb-btn type="button" color="white" size="md" class="btn-rounded btn-block"
                     value="direct" v-model="mySalePlace" @click.native="mySalePlace = 'marketplace'" :active="mySalePlace === 'marketplace'" required>
              Radicle Marketplace
            </mdb-btn>
          </div>
          <div class="col-6">
            <mdb-btn type="button" color="white" size="md" class="btn-rounded btn-block"
                     value="auction" v-model="mySalePlace" @click.native="mySalePlace = 'auctionplace'" :active="mySalePlace === 'auctionplace'" required>
              Auction
            </mdb-btn>
          </div>
        </div>
      </div>
      <div v-else><h4 class="mb-5">Radicle Marketplace Item</h4></div>

      <div>
        <div class="row">
          <div class="col-12">
            <h6>How to sell this item?</h6>
          </div>
        </div>
        <div class="form-row mb-4">
          <div class="col-6">
            <mdb-btn type="button" color="white" size="md" class="btn-rounded btn-block"
                     value="direct" v-model="mySaleType" @click.native="mySaleType = 'direct'" :active="mySaleType === 'direct'" required>
              Buy Now (Fixed Price)
            </mdb-btn>
          </div>
          <div class="col-6">
            <mdb-btn type="button" color="white" size="md" class="btn-rounded btn-block"
                     value="auction" v-model="mySaleType" @click.native="mySaleType = 'auction'" :active="mySaleType === 'auction'" required>
              Via Bidding
            </mdb-btn>
          </div>
        </div>
      </div>

      <div v-if="mySaleType === 'direct'">
        <div class="form-row">
          <div class="col-md-12">
            <mdb-popover trigger="click" :options="{placement: 'top'}">
              <div class="popover">
                <div class="popover-header">Amount {{currencySymbol}}</div>
                <div class="popover-body">
                  Your artwork will sell for this amount in fiat currency and converted to bitcoin at time of sale.
                </div>
              </div>
              <a @click.prevent="" slot="reference">Amount {{currencySymbol}}</a>
            </mdb-popover>
            <input type="number" class="form-control" id="vc-amount" placeholder="Fixed value of artwork" v-model="amount" required >
            <div class="invalid-feedback">
              Please enter the amount!
            </div>
            <p>{{valueInBitcoin(amount)}} Btc / {{valueInEther(amount)}} Eth</p>
          </div>
        </div>
      </div>
      <div v-else>
      <div class="form-row" v-if="isAuctions && mySalePlace === 'auctionplace'">
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
      <div class="form-row">
        <div class="col-md-12">
          <mdb-popover trigger="click" :options="{placement: 'top'}">
            <div class="popover">
              <div class="popover-header">Reserve {{currencySymbol}}</div>
              <div class="popover-body">
                Your artwork will not sell for less than this amount.
              </div>
            </div>
            <a @click.prevent="" slot="reference">Reserve {{currencySymbol}}</a>
          </mdb-popover>
          <input type="number" class="form-control" id="vc-reserve" step="1" placeholder="Reserve price" v-model="reserve" required min="1">
          <div class="invalid-feedback">
            Please enter the reserve!
          </div>
          <p>{{valueInBitcoin(reserve)}} Btc / {{valueInEther(reserve)}} Eth</p>
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
          <input type="number" class="form-control" id="vc-openingBid" step="1" placeholder="Opening bid" v-model="openingBid" required min="0">
          <div class="invalid-feedback">
            Please enter the opening bid!
          </div>
          <p>{{valueInBitcoin(openingBid)}} Btc / {{valueInEther(openingBid)}} Eth</p>
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
          <input type="number" class="form-control" id="vc-increment" step="1" placeholder="increment value" v-model="increment" required min="1">
          <div class="invalid-feedback">
            Bidding increment is required.
          </div>
          <p>
            {{valueInBitcoin(increment)}} Btc / {{valueInEther(increment)}} Eth
          </p>
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
          <datetime type="datetime" v-model="biddingEnds" input-id="biddingEnds" input-class="form-control bg-transparent">
            <input id="biddingEnds">
          </datetime>
          <div class="invalid-feedback">
            Please enter the bidding end time!
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-md-12">
        <mdb-popover trigger="click" :options="{placement: 'top'}">
          <div class="popover">
            <div class="popover-header">Currency</div>
            <div class="popover-body">
              The artwork will be sold for the amount of bitcoin that is equivalent to the
              sale value in the Fiat currency you set here.
            </div>
          </div>
          <a @click.prevent="" slot="reference">Select Currency {{currency}} <mdb-icon far icon="question-circle" /></a>
        </mdb-popover>
        <div class="form-row">
          <select id="vc-currency" class="form-control browser-default custom-select" v-model="currency" minlength="3" required>
            <option v-for="(value, key) in fiatRates" :key="key" :value="key" v-bind:value="key">{{ key }}</option>
          </select>
          <div class="invalid-feedback">
            Please select the currency!
          </div>
          <p class="">{{conversionMessage}}</p>
        </div>
      </div>
    </div>

    </mdb-card-text>
    <div class="row">
      <div class="col-md-6">
        <mdb-btn color="btn btn-block teal lighten-1" size="md">Save</mdb-btn>
      </div>
      <div class="col-md-6">
        <a class="btn btn-block teal lighten-1 btn-md text-white" @click.prevent="removeFromSale()">Reset</a>
      </div>
    </div>
  </form>
</mdb-card-body>
</template>

<script>
import notify from "@/notify";
import moment from "moment";
import ethereumService from "@/services/ethereumService";
import moneyUtils from "@/services/moneyUtils";
import { mdbPopover, mdbIcon, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import { mdbBtnGroup, mdbContainer, mdbRow, mdbCol, mdbAlert } from 'mdbvue';
import { Datetime } from 'vue-datetime'

// noinspection JSUnusedGlobalSymbols
export default {
  name: "RegisterForSale",
  components: {
    mdbCardBody,
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
  props: ["artwork", "saleType", "allowChange"],
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
    if (this.artwork.saleData.fiatCurrency) {
      this.currency = this.artwork.saleData.fiatCurrency;
    }
    // this.mySaleType = (this.artwork.saleData.soid === 2) ? 'direct'  : 'auction',
    this.auctionId = this.artwork.saleData.auctionId;
    if (this.artwork.saleData.soid === 2) {
      this.mySaleType = "auction";
    } else {
      this.mySaleType = this.saleType;
    }
    this.auctionId = this.artwork.saleData.auctionId;
    this.amount = this.artwork.saleData.amount;
    this.reserve = this.artwork.saleData.reserve;
    this.increment = this.artwork.saleData.increment;
    this.openingBid = (this.artwork.saleData.openingBid) ? this.artwork.saleData.openingBid : 0;
    if (this.artwork.saleData.biddingEnds) {
      this.biddingEnds = moment(this.artwork.saleData.biddingEnds).format();
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
      let cs = this.$store.getters["myArtworksStore/canSell"](this.artwork.id);
      return cs && auctions && auctions.length > 0;
    },

    isSelling() {
      return this.artwork.saleData.soid > 0;
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
      return moneyUtils.valueInBitcoin(this.currency, amount, fiatRate);
    },
    valueInEther(amount) {
      let fiatRate = this.$store.getters["conversionStore/getFiatRate"](this.currency);
      let ethToBtc = this.$store.getters["conversionStore/getCryptoRate"]("eth_btc");
      return moneyUtils.valueInEther(this.currency, amount, fiatRate, ethToBtc);
    },

    removeFromSale: function() {
      let artwork = this.artwork;
      artwork.status = this.$store.state.constants.statuses.artwork.NOT_SELLING;
      artwork.saleData.soid = 0;
      artwork.saleData.amount = this.amount = 0;
      artwork.saleData.reserve = this.reserve = 0;
      artwork.saleData.openingBid = this.openingBid = 0;
      artwork.saleData.increment = this.increment = 0;
      artwork.saleData.auctionId = this.auctionId = null;
      /**
      this.$emit("registerSaleInfo", {operation: "start", amount: this.amount, currency: this.currency});
      let $self = this;
      $self.$store.dispatch("myArtworksStore/updateArtwork", {artwork: artwork, updateProvData: false})
        .then(() => {
          $self.$emit("registerSaleInfo", {operation: "done"});
        });
      **/
    },

    upload: function() {
      let artwork = this.artwork;
      if (this.mySaleType === "direct") {
        artwork.saleData.soid = 1;
      } else {
        artwork.saleData.soid = 2;
      }
      artwork.status = this.$store.state.constants.statuses.artwork.PURCHASE_ENABLED;
      artwork.saleData.salePlace = this.mySalePlace;
      artwork.saleData.amount = Number(this.amount);
      artwork.saleData.reserve = Number(this.reserve);
      artwork.saleData.increment = Number(this.increment);
      artwork.saleData.openingBid = Number(this.openingBid);
      artwork.saleData.biddingEnds = moment(this.biddingEnds).valueOf();
      artwork.saleData.auctionId = Number(this.auctionId);
      if (this.mySalePlace === "marketplace") {
        artwork.saleData.auctionId = null;
      }
      artwork.saleData.fiatCurrency = this.currency;
      let fiatRates = this.$store.getters["conversionStore/getFiatRates"];
      artwork.saleData.initialRateBtc = fiatRates[this.currency]["15m"];
      let ethToBtc = this.$store.getters["conversionStore/getCryptoRate"]("eth_btc");
      artwork.saleData.initialRateEth = ethToBtc;

      let fiatRate = this.$store.getters["conversionStore/getFiatRate"](this.currency);
      artwork.saleData.amountInEther = moneyUtils.valueInEther(this.currency, artwork.saleData.amount, fiatRate, ethToBtc);

      this.$emit("registerSaleInfo", {operation: "start", amount: this.amount, currency: this.currency});
      let $self = this;
      $self.$store.dispatch("myArtworksStore/updateArtwork", {artwork: artwork, updateProvData: false})
        .then(() => {
          $self.$emit("registerSaleInfo", {operation: "done"});
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
