<template>
<div>
  <h2 class="title">Bitcoin Data</h2>
  <div class="row">
    <div class="col-md-2">Chain:</div>
    <div class="col-md-10">{{ bitcoinState.chain }}</div>
  </div>
  <div class="row">
    <div class="col-md-2">lightning:</div>
    <div class="col-md-10">{{ lightningConfig }}</div>
  </div>
  <div class="row">
    <div class="col-md-2">Blocks:</div>
    <div class="col-md-10">{{ bitcoinState.blocks }}</div>
  </div>
  <h3>Bitcoin Get Address</h3>
  <div class="row">
    <div class="col-md-4">Get a payment address:</div>
    <div class="col-md-8"><mdb-btn class="btn teal lighten-1" @click="getAddress">get address</mdb-btn></div>
    <div class="col-md-12">{{invoicePR}}</div>
  </div>
  <div class="row">
    <div class="col-md-4">&nbsp;</div>
    <div class="col-md-8"><div v-for="address in addresses" :key="address">{{address}}</div></div>
    <div class="col-md-8"><div v-for="paymentRequest in paymentRequests" :key="paymentRequest">{{paymentRequest}}</div></div>
  </div>
  <h3>Check Bitcoin Address</h3>
  <div class="row">
    <div class="col-md-12">Check address is valid on network {{bitcoinState.chain}}:</div>
  </div>
  <div class="row form-inline">
    <div class="form-group mb-2">
      <input type="text" class="form-control" placeholder="bitcoin address" v-model="bitcoinAddress" />
    </div>
    <mdb-btn class="btn teal lighten-1" @click="checkAddress">check address</mdb-btn>
  </div>
  <div class="row">
    <div class="col-md-12">{{checkAddressResult}}</div>
  </div>

</div>
</template>

<script>
import bitcoinService from "@/services/bitcoinService";
import { mdbContainer, mdbRow, mdbCol, mdbInput, mdbTextarea, mdbBtn, mdbIcon, mdbModal, mdbModalHeader, mdbModalBody, mdbModalFooter } from 'mdbvue';

export default {
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbInput,
    mdbTextarea,
    mdbBtn,
    mdbIcon,
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
    mdbModalFooter
  },
  data() {
    return {
      addresses: [],
      paymentRequests: [],
      asset: null,
      bitcoinAddress: null,
      checkAddressResult: null
    };
  },
  mounted() {
  },
  methods: {
    getAddress() {
      let artwork = {
        id: 12344567890,
        title: "unknown artwork by nobody",
        owner: "mike.personal.id",
        artist: "mike.personal.id",
        artwork: [
          {dataUrl: "unknown artwork by nobody"}
        ],
        saleData: {
          fiatCurrency: "EUR",
          amount: 0.5
        }
      };
      let $self = this;
      this.$store.dispatch("assetStore/initialiseAsset", artwork).then(asset => {
        this.$store.dispatch("assetStore/initialisePayment", {asset: asset, artwork: artwork}).then(asset => {
          this.asset = asset;
          _.forEach(asset.purchaseCycles, function(purchaseCycle) {
            $self.addresses.push(purchaseCycle.paymentAddress);
            $self.paymentRequests.push(purchaseCycle.buyer.chainData.paymentRequest);
          })
        });
      });
    },
    checkAddress() {
      if (!this.bitcoinAddress) {
        this.checkAddressResult = "enter a bitcoin address..";
        return;
      }
      bitcoinService.checkAddress({address: this.bitcoinAddress}).then(result => {
        if (!result) {
          this.checkAddressResult = "invalid bitcoin address..";
        } else {
          this.checkAddressResult = (result.address !== null) + " - " + result.label;
        }
      })
        .catch(error => {
          console.log(error);
          this.checkAddressResult = "incorrect bitcoin address..";
        });
    }
  },
  computed: {
    bitcoinState() {
      let state = this.$store.getters["assetStore/getBitcoinConfig"];
      if (!state) {
        state = {};
      }
      return state;
    },
    lightningConfig() {
      let lightningConfig = this.$store.getters["assetStore/getLightningConfig"];
      return lightningConfig;
    },
    invoicePR() {
      if (this.asset) {
        let invoice = this.asset.purchaseCycles[0].buyer.chainData;
        return invoice.paymentRequest_;
      }
    },
    invoicePR() {
      return this.$store.getters["assetStore/getLightningConfig"];
    }
  }
};
</script>
