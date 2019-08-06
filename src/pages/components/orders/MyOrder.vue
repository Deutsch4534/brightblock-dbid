<template>
<div id="my-app-element" class="mt-4">
  <div class="bg-card mb3">
    <order-details v-if="activeTab !== 'buyer-info'" class="p-3 mx-5" :item="item" :purchaseCycle="purchaseCycle" style="background-color:  #bdbdbd;"/>
    <mdb-navbar expand="medium" color="light" style="min-height: 54px;" class="mx-5">
      <mdb-navbar-toggler>
        <mdb-navbar-brand color="text-grey">
          <span style="font-weight: 500;">
            <span v-if="iamseller">Selling: {{item.title}}</span>
            <span v-else>Buying: {{item.title}}</span>
          </span>
        </mdb-navbar-brand>
        <mdb-navbar-nav right class="">
          <router-link v-if="iamseller" class="nav-link navbar-link btn" to="/my-selling">Back</router-link>
          <router-link v-else class="nav-link navbar-link btn" to="/my-buying">Back</router-link>
          <span v-if="!iamseller && asset.status < 4"><a class="nav-link navbar-link btn" @click.prevent="cancelOrder(assetHash)">Cancel Order</a></span>
        </mdb-navbar-nav>
      </mdb-navbar-toggler>
    </mdb-navbar>
    <div class="bg-light mb-5 p-4">
      <!--
      <div class="d-flex justify-content-center">
        <div class="d-flex justify-content-center text-capitalize">
          <h4>{{networkName}}&nbsp;<span class="text-danger">{{bitcoinConfig.chain}}</span>&nbsp;network</h4>
        </div>
      </div>
      -->
      <div class="p-4" v-if="activeTab === 'payment-expired'">
        <payment-expired :assetHash="asset.assetHash" :itemId="item.id"/>
      </div>
      <div class="p-4" v-else-if="activeTab === 'payment-details'">
        <payment-details :eternal="true" :network="network" :assetHash="asset.assetHash" :validFor="validFor" @chooseNetwork="chooseNetwork"/>
      </div>
      <div class="p-4" v-else-if="activeTab === 'payment-network'">
        <payment-network @chooseNetwork="chooseNetwork"/>
      </div>
      <div class="p-4" v-else-if="activeTab === 'confirmation-details-state4'">
        <confirmation-details-state4 :assetHash="asset.assetHash" :item="item"/>
      </div>
      <div class="p-4" v-else-if="activeTab === 'confirmation-details-state5'">
        <confirmation-details-state5 :assetHash="asset.assetHash" :item="item" @paySeller="paySeller"/>
      </div>
      <div class="p-4" v-else-if="activeTab === 'confirmation-details-state6'">
        <confirmation-details-state6 :assetHash="asset.assetHash"/>
      </div>
      <div class="p-4" v-else-if="activeTab === 'confirmation-details-state7'">
        <confirmation-details-state7 :assetHash="asset.assetHash"/>
      </div>
      <div class="p-4" v-else-if="activeTab === 'buyer-info'">
        <settings-tabs :tabList="tabList" :myProfile="myProfile"/>
      </div>
      <div class="p-4" v-else-if="activeTab === 'shipping-expired'">
        <shipping-expired :assetHash="asset.assetHash" :itemId="item.id"/>
      </div>
      <div class="p-4" v-else-if="activeTab === 'shipping-waiting'">
        <shipping-waiting :assetHash="asset.assetHash"/>
      </div>
      <div class="p-4" v-else-if="activeTab === 'shipping-required'">
        <shipping-required  :myProfile="myProfile" :assetHash="asset.assetHash"/>
      </div>
      <div class="p-4" v-else-if="activeTab === 'seller-settling'">
        <seller-settling  :myProfile="myProfile" :assetHash="asset.assetHash"/>
      </div>
      <div class="p-4" v-else-if="activeTab === 'seller-settled'">
        <seller-settled  :myProfile="myProfile" :assetHash="asset.assetHash"/>
      </div>
    </div>
    <mdb-footer fluid color="blue-grey" class="font-small py-2 m-0">
      <div class="d-flex justify-content-center">Thank you for using dbid!</div>
    </mdb-footer>
  </div>
</div>
</template>

<script>
import QRCode from "qrcode";
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import moment from "moment";
import SellerSettling from "@/pages/components/orders/SellerSettling";
import SellerSettled from "@/pages/components/orders/SellerSettled";
import ShippingWaiting from "@/pages/components/orders/ShippingWaiting";
import ShippingRequired from "@/pages/components/orders/ShippingRequired";
import ShippingExpired from "@/pages/components/orders/ShippingExpired";
import OrderDetails from "@/pages/components/orders/OrderDetails";
import PaymentExpired from "@/pages/components/orders/PaymentExpired";
import PaymentDetails from "@/pages/components/orders/PaymentDetails";
import PaymentNetwork from "@/pages/components/orders/PaymentNetwork";
import SettingsTabs from "@/pages/components/user-settings/SettingsTabs";
import { mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem } from 'mdbvue';
import ConfirmationDetailsState5 from "@/pages/components/orders/ConfirmationDetailsState5";
import ConfirmationDetailsState4 from "@/pages/components/orders/ConfirmationDetailsState4";
import ConfirmationDetailsState6 from "@/pages/components/orders/ConfirmationDetailsState6";
import ConfirmationDetailsState7 from "@/pages/components/orders/ConfirmationDetailsState7";
import { mdbFooter, mdbContainer, mdbRow, mdbCol } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyOrder",
  components: {
    ShippingRequired, ShippingWaiting,SellerSettling,SellerSettled,
    ShippingExpired, ConfirmationDetailsState7, ConfirmationDetailsState6, ConfirmationDetailsState4, ConfirmationDetailsState5,
    PaymentExpired, PaymentDetails, PaymentNetwork, SettingsTabs, OrderDetails,
    mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem,
    mdbFooter, mdbContainer, mdbRow, mdbCol
  },
  props: {
    item: null,
    assetHash: null,
    myProfile: null,
  },
  data() {
    return {
      network: null,
      loading: true,
      whoami: "nobody",
      purchaseExpired: false,
      validFor: 300,
      buyerInfo: false,
      tabList: ["notifications", "shipping", "payments"]
    };
  },
  mounted() {
    this.$store.dispatch("assetStore/subscribeAssetPurchaseNews", this.myProfile);
    let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
    let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
    if (purchaseCycle.bidding) {
      let meWon = this.$store.getters["assetStore/isMeWon"]({username: this.myProfile.username, assetHash: this.assetHash});
      if (meWon) {
        this.whoami = "buyer";
      }
    } else {
      if (this.myProfile.username === purchaseCycle.buyer.did) {
        this.whoami = "buyer";
        this.$store.dispatch("myAccountStore/addRelationship", purchaseCycle.seller.did);
      } else if (this.myProfile.username === purchaseCycle.seller.did) {
        this.whoami = "seller";
      }
    }
    if (this.whoami === "nobody") {
      this.$notify({type: 'warn', title: 'Purchasing', text: 'Sending m you back home as you don\'t belong here.'});
      this.$router.push("/");
      return;
    }
    if (asset.status === 3) {
      if (this.paymentExpired() < 0) {
        this.$emit("cancelOrder", this.assetHash);
        return;
      } else {
        this.startCountdown();
      }
    } else if (asset && asset.status === 7) {
      this.$store.dispatch("myItemStore/transferItemToBuyer", asset).then((asset) => {
        this.$notify({type: 'success', title: 'Item Transferred', text: 'Item transferred to your storage.'});
      });
    }
  },
  computed: {
    iamseller() {
      return this.whoami === "seller";
    },
    bitcoinConfig() {
      let bitcoinConfig = this.$store.getters["assetStore/getBitcoinConfig"];
      if (!bitcoinConfig) {
        bitcoinConfig = {
          chain: "unknown"
        }
      }
      return bitcoinConfig;
    },
    networkName() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      if (purchaseCycle.buyer.chainData.bitcoinMethod) {
        return "Bitcoin";
      } else if (purchaseCycle.buyer.chainData.lightningMethod) {
        return "Lightning";
      }
      return "";
    },
    purchaseCycle() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      return purchaseCycle;
    },
    purchaseCycle() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      return purchaseCycle;
    },
    asset() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset;
    },
    activeTab() {
      if (this.whoami === "nobody") {
        return "";
      }

      let asset = this.$store.getters["assetStore/getAssetByHash"](this.asset.assetHash);
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.asset.assetHash);
      let activeTab = "buyer-info";
      if (this.buyerInfo) {
        return "buyer-info";
      }
      let validity = this.$store.getters["myAccountStore/getProfileValidity"];
      if (!validity.emailValid || !validity.shippingValid) {
        return "buyer-info";
      }
      if (this.whoami === "seller") {
        if (purchaseCycle.expired) {
          return "shipping-expired";
        }
        if (asset.status < 5) {
          if (purchaseCycle.buyer.chainData.confirmations < 3) {
            return "shipping-waiting";
          } else {
            return "shipping-required";
          }
        } else if (asset.status === 5) {
          return "shipping-required";
        } else if (asset.status === 6) {
          return "seller-settling";
        } else if (asset.status === 7) {
          return "seller-settled";
        }
        return "shipping-confirmation";
      } else {
        if (purchaseCycle.expired) {
          return "payment-expired";
        }
        if (asset.status === 3) {
          if (this.paymentExpired() < 0) {
            return "payment-expired";
          }
          if (!this.network) {
            return "payment-network";
          }
          return "payment-details";
        } else if (asset.status === 4) {
          return "confirmation-details-state4";
        } else if (asset.status === 5) {
          return "confirmation-details-state5";
        } else if (asset.status === 6) {
          return "confirmation-details-state6";
        } else if (asset.status === 7) {
          return "confirmation-details-state7";
        }
      }
      return activeTab;
    },
    assetStatus() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.asset.assetHash);
      if (asset) {
        return asset.status;
      }
      return -1;
    },
    validAddressInfo() {
      let validity = this.$store.getters["myAccountStore/getProfileValidity"];
      return validity.emailValid && validity.shippingValid && validity.bitcoinValid;
    },
  },
  methods: {
    cancelOrder() {
      this.$store.dispatch("assetStore/cancelPurchase", this.asset.assetHash);
      this.$router.push("/items/" + this.item.id);
    },
    cancelOrderSeller() {
      this.$notify({type: 'warn', title: 'Purchase Order', text: 'Only the buyer can cancel at this stage.'});
    },
    paymentExpired() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.asset.assetHash);
      let now = moment({}).valueOf();
      let diff = now - purchaseCycle.created;
      return (100 - ((diff) / 1000));
      //return diff < 0;
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
    },
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
        if (purchaseCycle.expired) {
          clearInterval(countdown);
        }
        if (purchaseCycle.buyer.chainData.txid) {
          clearInterval(countdown);
        } else {
          let now = moment({}).valueOf();
          //let diff = (now - purchaseCycle.created) / 1000;
          let diff = 300 - ((now - purchaseCycle.created) / 1000);
          $self.validFor = diff; // $self.paymentExpired(purchaseCycle);
          let expired = $self.validFor < 0;
          if (expired) {
            asset = $self.$store.getters["assetStore/getAssetByHash"]($self.assetHash);
            if (asset.status === 3) {
              $self.purchaseExpired = true;
            }
            clearInterval(countdown);
          }
        }
      }, 1000);
    },
    chooseNetwork(network) {
      if (network === "stacks") {
        this.$notify({type: 'warn', title: 'Network', text: 'We are not quite ready for for payment in stacks - stay tuned!'});
      } else {
        this.network = network;
      }
    },
  }
};
</script>
<style scoped>
.btn {
  font-size: 1.1rem;
  padding: 4px 10px;
  margin: 2px 3px;
  text-transform: capitalize;
}
</style>
