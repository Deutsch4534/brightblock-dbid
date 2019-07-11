<template>
<div id="my-app-element" class="my-4 container">
  <mdb-navbar expand="medium" color="success" style="min-height: 54px;" dark>
    <mdb-navbar-toggler>
      <mdb-navbar-brand>
        <span style="font-weight: 500">
          Order: {{item.title}}
        </span>
      </mdb-navbar-brand>
      <mdb-navbar-nav right class="text-light">
        <a v-if="activeTab === 'buyer-info'" class="nav-link navbar-link btn btn-primary" @click.prevent="buyerInfo = !buyerInfo">Back</a>
        <a v-else class="nav-link navbar-link btn btn-primary" @click.prevent="buyerInfo = !buyerInfo">Buyer Info <i class="fas fa-check text-success ml-2" v-if="validAddressInfo"></i><i class="fas fa-times text-danger ml-2" v-else></i></a>
        <a v-if="assetStatus === 3" class="nav-link navbar-link btn btn-primary" @click.prevent="cancelOrder(assetHash)">Cancel Order</a>
      </mdb-navbar-nav>
    </mdb-navbar-toggler>
  </mdb-navbar>
  <div class="bg-card mb5">
    <order-details v-if="activeTab !== 'buyer-info'" class="p-3" :item="item" :purchaseCycle="purchaseCycle" style="background-color:  #bdbdbd;"/>
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
      <confirmation-details-state4 :assetHash="asset.assetHash" :purchaseCycle="purchaseCycle" @notifySeller="notifySeller"/>
    </div>
    <div class="p-4" v-else-if="activeTab === 'confirmation-details-state5'">
      <confirmation-details-state5 :assetHash="asset.assetHash" :item="item" :purchaseCycle="purchaseCycle" @paySeller="paySeller" @notifySeller="notifySeller"/>
    </div>
    <div class="p-4" v-else-if="activeTab === 'confirmation-details-state6'">
      <confirmation-details-state6 :assetHash="asset.assetHash" :purchaseCycle="purchaseCycle"/>
    </div>
    <div class="p-4" v-else-if="activeTab === 'confirmation-details-state7'">
      <confirmation-details-state7 :assetHash="asset.assetHash" :purchaseCycle="purchaseCycle"/>
    </div>
    <div class="" v-else-if="activeTab === 'buyer-info'">
      <settings-tabs :tabList="tabList" :myProfile="myProfile"/>
    </div>
    <div class="" v-else-if="activeTab === 'shipping-waiting'">
      <shipping-waiting :assetHash="asset.assetHash"/>
    </div>
    <div class="p-5" v-else-if="activeTab === 'shipping-required'">
      <shipping-required  :myProfile="myProfile" :assetHash="asset.assetHash"/>
    </div>
  </div>
</div>
</template>

<script>
import QRCode from "qrcode";
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import moment from "moment";
import ShippingWaiting from "@/pages/components/orders/ShippingWaiting";
import ShippingRequired from "@/pages/components/orders/ShippingRequired";
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

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyOrder",
  components: {
    ShippingRequired, ShippingWaiting,
    ConfirmationDetailsState7, ConfirmationDetailsState6, ConfirmationDetailsState4, ConfirmationDetailsState5,
    PaymentExpired, PaymentDetails, PaymentNetwork, SettingsTabs, OrderDetails,
    mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem
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
    if (this.myProfile.username === purchaseCycle.buyer.did) {
      this.whoami = "buyer";
      this.$store.dispatch("myAccountStore/addRelationship", purchaseCycle.seller.did);
    } else if (this.myProfile.username === purchaseCycle.seller.did) {
      this.whoami = "seller";
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
    purchaseCycle() {
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.assetHash);
      return purchaseCycle;
    },
    asset() {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      return asset;
    },
    activeTab() {
      let activeTab = "buyer-info";
      if (this.buyerInfo) {
        return "buyer-info";
      }
      if (this.purchaseExpired) {
        return "payment-expired";
      }
      let validity = this.$store.getters["myAccountStore/getProfileValidity"];
      if (!validity.emailValid || !validity.shippingValid) {
        return "buyer-info";
      }
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.asset.assetHash);
      let purchaseCycle = this.$store.getters["assetStore/getCurrentPurchaseCycleByHash"](this.asset.assetHash);
      if (this.whoami === "seller") {
        if (asset.status < 5) {
          if (purchaseCycle.confirmations < 3) {
            return "shipping-waiting";
          } else {
            return "shipping-required";
          }
        } else if (asset.status === 5) {
          if (purchaseCycle.confirmations < 3) {
            return "shipping-waiting";
          } else {
            return "shipping-required";
          }
        }
        return "shipping-confirmation";
      } else {
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
    notifySeller(sellerMessage) {
      let asset = this.$store.getters["assetStore/getAssetByHash"](this.assetHash);
      let text = sellerMessage;
      if (!sellerMessage) {
        text = "One of your items on dbid.io has been sold: <br/><br/>" + this.item.title + "<br/><br/>please login <a href=\"https://dbid.io/my-orders/" + this.assetHash + "\">here for shipping details.</a>";
      }
      let data = {
        text: text,
        asset: this.asset
      };
      this.$store.dispatch("assetStore/notifySeller", data).then((result) => {
        this.$notify({type: 'success', title: 'Message Sent', text: 'Message has been sent to the seller.'});
      });
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
  font-size: 0.7rem;
  padding: 4px 10px;
  margin: 2px 3px;
  text-transform: capitalize;
}
</style>
