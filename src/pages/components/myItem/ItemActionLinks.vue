<template>
<div>
<div class="d-flex justify-content-start">
  <div class="mr-auto"><router-link :to="myItemUrl" title="Open item"><strong>{{item.title}}</strong></router-link></div>
</div>
<div class="d-flex justify-content-end my-3">
  <div>
    <div v-if="buttonMode">
      <router-link :to="registerUrl" class="btn btn-primary btn-md waves-effect waves-light" v-if="canRegister">Register</router-link>
      <router-link :to="registerUrl" class="btn btn-primary btn-md waves-effect waves-light" v-else>Registered</router-link>
      <router-link :to="coaUrl" class="btn btn-primary btn-md waves-effect waves-light" v-if="canCertificate">Certification</router-link>
      <router-link :to="registerForSaleUrl" class="btn btn-primary btn-md waves-effect waves-light" v-if="canSell">Sell</router-link>
      <a @click="deleteItem(item.id)" class="btn btn-primary btn-md waves-effect waves-light" v-if="debugMode">Delete</a>
      <router-link :to="editUrl" class="btn btn-primary btn-md waves-effect waves-light" v-if="editable">Edit</router-link>
      <router-link :to="myItemUrl" class="btn btn-primary btn-md waves-effect waves-light">Open</router-link>
    </div>
    <div v-else class="text-nowrap">
      <router-link :to="editUrl" title="Edit item" class="text-primary border-right px-1" :class="itemAction === 'update' ? 'bg-danger' : ''" v-if="editable"><i class="fas fa-pencil-alt"></i></router-link>
      <router-link :to="registerForSaleUrl" title="Set price" class="text-primary border-right px-1" v-if="canSell"><i class="fas fa-gavel"></i></router-link>
      <router-link :to="registerUrl" title="Register on blockchain" class="text-primary border-right px-1" v-if="canRegister"><i class="far fa-registered"></i></router-link>
      <router-link :to="registerUrl" title="Registered on blockchain" class="text-primary border-right px-1" v-else><i class="far fa-registered"></i></router-link>
      <router-link :to="coaUrl" title="certificate of authenticity" class="text-primary border-right px-1" v-if="canCertificate"><i class="fas fa-certificate"></i></router-link>
      <a @click="deleteItem(item.id)" title="Delete item" class="text-primary border-right px-1" v-if="debugMode"><i class="far fa-trash-alt"></i></a>
      <router-link :to="myItemUrl" title="Open item" class="text-primary border-right px-1"><i class="far fa-folder-open"></i></router-link>
      <mdb-popover trigger="click" :options="{placement: 'top'}">
        <div class="popover">
          <div class="popover-header">
            Item Management
          </div>
          <div class="popover-body">
            <p>dBid tools allow you to easily manage your listings;</p>
            <ul>
              <li><i class="fas fa-pencil-alt"></i> - update item details</li>
              <li><i class="fas fa-gavel"></i> - set buy now / bidding data</li>
              <li><i class="far fa-registered"></i> - register ownership on the blockchain</li>
              <li><i class="fas fa-certificate"></i> - generate certificates of authenticity</li>
              <li><i class="far fa-folder-open"></i> - open item management page</li>
            </ul>
          </div>
        </div>
        <a @click.prevent="" slot="reference" class="text-primary px-1"><i class="far fa-question-circle"></i></h3></a>
      </mdb-popover>
    </div>
  </div>
</div>
</div>
</template>

<script>
import moment from "moment";
import utils from "@/services/utils";
import { mdbPopover } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ItemActionLinks",
  components: {
    mdbPopover
  },
  props: {
    item: null,
    asset: null,
    buttonMode: false,
    itemAction: null
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    deleteItem() {
      this.$emit("delete");
    },
  },
  computed: {
    editable() {
      return this.$store.getters["myItemStore/editable"](this.item.id);
    },
    deletable() {
      return this.$store.getters["myItemStore/editable"](this.item.id);
    },
    bitcoinAddress() {
      if (this.myProfile.publicKeyData) {
        return this.myProfile.publicKeyData.bitcoinAddress;
      }
    },
    created() {
      if (this.item.created) {
        return moment(this.item.created).format("YYYY-MM-DD");
      }
      return moment(this.item.id).format("DD/MMM/YYYY");
    },
    debugMode() {
      return this.$store.state.constants.debugMode;
    },
    canSell() {
      return true;
    },
    canRegister() {
      let assetHash = utils.buildBitcoinHash(this.item);
      return this.asset && this.asset.assetHash === assetHash && !this.asset.assetRegistrationTx;
    },
    canCertificate() {
      return this.item.bitcoinTx;
    },
    editUrl() {
      return `/my-items/update/${this.item.id}`;
    },
    myItemUrl() {
      return `/my-items/${this.item.id}`;
    },
    coaUrl() {
      return `/my-item/coa/${this.item.id}`;
    },
    registerUrl() {
      return `/my-item/register/${this.item.id}`;
    },
    registerForSaleUrl() {
      return `/my-item/set-price/${this.item.id}`;
      /**
      let id = this.item.id;
      if (this.item.saleData || !this.item.saleData.soid) {
        let amount = 0;
        let currency = "EUR";
        return `/my-item/register-for-sale/${id}/${amount}/${currency}`;
      } else if (this.item.saleData.soid <= 1) {
        let amount = a.saleData ? a.saleData.amount : 0;
        let currency = a.saleData ? a.saleData.fiatCurrency : "EUR";
        return `/my-item/register-for-sale/${id}/${amount}/${currency}`;
      } else if (this.item.saleData.soid === 2) {
        let r = a.saleData ? a.saleData.reserve : 0;
        let i = a.saleData ? a.saleData.increment : 0;
        let c = a.saleData ? a.saleData.fiatCurrency : "EUR";
        let aid = -1;
        if (a.saleData && a.saleData.auctionId) {
          aid = a.saleData.auctionId;
        }
        return `/my-item/register-for-auction/${id}/${aid}/${r}/${i}/${c}`;
      }
      **/
    }
  }
};
</script>
<style scoped>
  .subtitle,
  .card-body p {
    color: #000!important;
    font-size: 0.9em;
  }
</style>
