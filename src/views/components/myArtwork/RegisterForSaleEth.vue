<template>
  <mdb-card-body>
    <p v-if="canAuction"><router-link :to="registerForAuctionUrl()" class="inline-block"><mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light">Sell in auction...</mdb-btn></router-link></p>
    <mdb-card-text>
      <form @submit.prevent="setPrice">
        <p v-if="errors.length" :key="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error.id">{{ error.message }}</li>
          </ul>
        </p>
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
        <select class="browser-default custom-select" v-model="currency">
          <option v-for="(value, key) in fiatRates" :key="key" :value="key" v-bind:value="key">{{ key }}</option>
        </select>
        <p class="">
          {{conversionMessage}}
        </p>
        <div class="invalid-feedback">
          Please select the currency!
        </div>

        <label for="validationCustom01">Amount {{currencySymbol}}</label>
        <input type="number" class="form-control" id="validationCustom01" step="1" placeholder="Sale value of artwork" v-model="amount" required>
        <div class="invalid-feedback">
          Please enter the amount!
        </div>
        <p>Note: set the value to 0 to remove from sale.</p>
        <p class="hint">
          {{valueInBitcoin}} Btc / {{valueInEther}} Eth
        </p>
      </form>
    </mdb-card-text>
    <div class="rounded-bottom lighten-3 p-3">
      <mdb-btn color="white" @click="closeModal" size="md">Cancel</mdb-btn>
      <mdb-btn color="white" @click="setPrice" size="md">Save</mdb-btn>
    </div>
  </mdb-card-body>
</template>

<script>
import notify from "@/notify";
import ethereumService from "@/services/ethereumService";
import moneyUtils from "@/services/moneyUtils";
import { mdbPopover, mdbIcon, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "RegisterForSale",
  components: {
    mdbCardBody,
    mdbPopover,
    mdbIcon,
    mdbCardTitle,
    mdbCardText,
    mdbBtn
  },
  props: {
    fiatRates: {
      type: Object,
      default() {
        return {};
      }
    },
    artwork: {
      type: Object,
      default() {
        return {
          saleData: {
            amount: 0,
            currency: GBP
          }
        };
      }
    },
  },
  data() {
    return {
      errors: [],
      showModal: true,
      message: null,
      currency: null,
      amount: 0,
      from: "/my-artworks",
      saleType: "direct"
    };
  },
  mounted() {
    this.currency = this.artwork.saleData.fiatCurrency;
    this.amount = this.artwork.saleData.amount;
    if (this.$route.query.from && this.$route.query.from === "auctions") {
      this.from = "/my-auctions/manage/" + this.$route.query.auctionId;
    }
  },
  computed: {
    canAuction() {
      let auctions = this.$store.getters["myAuctionsStore/myAuctionsFuture"];
      let cs = this.$store.getters["myArtworksStore/canSell"](this.artwork.id);
      return cs && auctions && auctions.length > 0;
    },
    auctions() {
      return this.$store.getters["myAuctionsStore/myAuctionsFuture"];
    },

    valueInBitcoin() {
      let fiatRate = this.$store.getters["conversionStore/getFiatRate"](this.currency);
      return moneyUtils.valueInBitcoin(this.currency, this.amount, fiatRate);
    },

    valueInEther() {
      let fiatRate = this.$store.getters["conversionStore/getFiatRate"](this.currency);
      let ethToBtc = this.$store.getters["conversionStore/getCryptoRate"]("eth_btc");
      return moneyUtils.valueInEther(this.currency, amount, fiatRate, ethToBtc);
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
    validate: function() {
      this.errors = [];
    },

    closeModal: function() {
      this.$router.push(this.from);
    },

    setPrice: function() {
      let artwork = this.artwork;
      this.validate(artwork.saleData);
      if (this.errors.length > 0) {
        return;
      }

      artwork.saleData.soid = 1;
      artwork.status = this.$store.state.constants.statuses.artwork.PURCHASE_ENABLED;
      artwork.saleData.amount = Number(this.amount);
      if (artwork.saleData.amount === 0) {
        artwork.saleData.soid = 0;
        artwork.status = this.$store.state.constants.statuses.artwork.NOT_SELLING;
      }
      artwork.saleData.reserve = 0;
      artwork.saleData.increment = 0;
      artwork.saleData.fiatCurrency = this.currency;
      let fiatRates = this.$store.getters["conversionStore/getFiatRates"];
      artwork.saleData.initialRateBtc = fiatRates[this.currency]["15m"];
      let ethToBtc = this.$store.getters["conversionStore/getCryptoRate"](
        "eth_btc"
      );
      artwork.saleData.initialRateEth = ethToBtc;
      let fiatRate = this.$store.getters["conversionStore/getFiatRate"](this.currency);
      let ethToBtc = this.$store.getters["conversionStore/getCryptoRate"]("eth_btc");
      artwork.saleData.amountInEther = moneyUtils.valueInEther(this.currency, artwork.saleData.amount, fiatRate, ethToBtc);
      artwork.saleData.auctionId = null;

      let $self = this;
      let fb = this.$store.state.constants.featureBitcoin;

      if (fb) {
        this.message =
          "Setting Price: Blockchain called - saving data changes...";
        $self.$store.dispatch("myArtworksStore/updateArtwork", {artwork: artwork, updateProvData: false})
          .then(() => {
            notify.info({
              title: "Register Artwork.",
              text: "Your user storage has been updated."
            });
            $self.closeModal();
          });
      } else {
        this.setPriceEthereum(artwork);
      }
    },

    setPriceEthereum: function(artwork) {
      this.message =
        "Setting Price: Please confirm the transaction in your wallet...";
      let priceData = {
        itemIndex: artwork.bcitem.itemIndex,
        amountInWei: moneyUtils.valueInWei(
          artwork.saleData.fiatCurrency,
          artwork.saleData.amount
        )
      };
      ethereumService.setPriceOnChain(
        priceData,
        function(result) {
          artwork.bcitem.setPriceTxId = result.txId;
          artwork.bcitem.status = "price-set";
          $self.$store.commit("myArtworksStore/addMyArtwork", artwork);
          $self.message =
            "Setting Price: Blockchain called - saving data changes...";
          $self.$store.dispatch("myArtworksStore/updateArtwork", {artwork: artwork, updateProvData: false})
            .then(() => {
              notify.info({
                title: "Register Artwork.",
                text: "Your user storage has been updated."
              });
              $self.closeModal();
            });
        },
        function(error) {
          notify.error({
            title: "Register Artwork.",
            text: "Error setting price for your item. <br>" + error.message
          });
        }
      );
    },
    registerForAuctionUrl() {
      let a = this.$store.getters["myArtworksStore/myArtwork"](this.artwork.id);
      let id = this.artwork.id;
      let r = a.saleData ? a.saleData.reserve : 0;
      let i = a.saleData ? a.saleData.increment : 0;
      let c = a.saleData ? a.saleData.fiatCurrency : "EUR";
      let aid = -1;
      if (a.saleData && a.saleData.auctionId) {
        aid = a.saleData.auctionId;
      }
      return `/my-artwork/register-for-auction/${id}/${aid}/${r}/${i}/${c}`;
    }
  }
};
</script>
