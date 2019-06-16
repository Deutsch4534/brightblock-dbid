<template>
  <mdb-card class="bg-transparent mb-5">
    <mdb-view hover>
      <router-link :to="myItemUrl" class="inline-block">
        <mdb-card-image :src="getImage" :alt="item.title" v-if="isImage"></mdb-card-image>
        <mdb-mask flex-center waves overlay="white-slight" v-if="isImage"></mdb-mask>
        <media-container :mediaObject="item.images" :altText="item.title" class="inline-block" v-else/>
      </router-link>
    </mdb-view>
    <mdb-card-body class="px-0 pb-2 mb-0">
      <mdb-card-title class="subtitle">
        <h5><router-link :to="myItemUrl" class="inline-block">
          {{item.title}}
        </router-link></h5>
      </mdb-card-title>
      <mdb-card-text>
        <selling-options :item="item" v-if="sellingStatus === 'unsold'"/>
        <description-overflow :text="item.description"/>
        <p>by {{artistProfile.name}}, 11/08/2018 <br/>
        <span v-if="item.bitcoinTx">registered</span>
        <span v-else>not registered</span>
        </p>
      </mdb-card-text>
    </mdb-card-body>
    <div class="card-buttons d-flex align-items-end justify-content-start flex-nowrap">
      <!--
      <router-link :to="registerUrl" class="inline-block" v-if="canRegister">
        <mdb-btn rounded color="white" size="sm" class="mx-0 waves-light">Register</mdb-btn>
      </router-link>
      <router-link :to="registerUrl" class="inline-block" v-else>
        <mdb-btn rounded color="white" size="sm" class="mx-0 waves-light" v-if="item.bitcoinTx">CoA</mdb-btn>
      </router-link>
      <router-link :to="registerForSaleUrl" class="inline-block">
        <mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light" v-if="canSell">Sell</mdb-btn>
      </router-link>
      <a @click="deleteItem(item.id)" class="inline-block">
        <mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light" v-if="debugMode">Delete</mdb-btn>
      </a>
      <router-link :to="editUrl" class="inline-block">
        <mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light" v-if="editable">Edit</mdb-btn>
      </router-link>
      <router-link :to="myItemUrl" class="inline-block">
        <mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light">Open</mdb-btn>
      </router-link>
      -->
    </div>
  </mdb-card>
</template>

<script>
import SellingOptions from "./SellingOptions";
import { mdbContainer, mdbRow, mdbCol, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbMask, mdbIcon, mdbView, mdbBtn } from 'mdbvue';
import moment from "moment";
import DescriptionOverflow from "@/views/components/utils/DescriptionOverflow";
import MediaContainer from "@/views/components/utils/MediaContainer";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MySingleItem",
  components: {
    MediaContainer, SellingOptions,
    DescriptionOverflow,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbCard,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbCardImage,
    mdbMask,
    mdbIcon,
    mdbView,
    mdbBtn
  },
  props: {
    sellingStatus: "sold",
    item: {
      type: Object,
      default() {
        return {};
      }
    },
    width: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    deleteItem(id) {
      this.$store.dispatch("myItemStore/deleteMyItem", id);
    }
  },
  computed: {
    editable() {
      return this.$store.getters["myItemStore/editable"](this.item.id);
    },
    isImage: function() {
      try {
        return this.item.images[0].type.indexOf("image") > -1;
      } catch (e) {
        return true;
      }
    },
    getImage: function() {
      try {
        return this.item.images[0].dataUrl;
      } catch (e) {
        return;
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
      return this.$store.getters["myItemStore/canSell"](this.item.id);
    },
    canRegister() {
      let canRegister = this.$store.getters["myItemStore/canRegister"](
        this.item.id
      );
      return canRegister && !this.sold;
    },
    artistProfile() {
      let profile = this.$store.getters["userProfilesStore/getProfile"](
        this.item.artist
      );
      return profile ? profile : {};
    },
    ownerProfile() {
      return this.$store.getters["userProfilesStore/getProfile"](
        this.item.owner
      );
    },
    editUrl() {
      return `/my-item/update/${this.item.id}`;
    },
    myItemUrl() {
      return `/my-items/${this.item.id}`;
    },
    registerUrl() {
      return `/my-item/register/${this.item.id}`;
    },
    registerForSaleUrl() {
      let a = this.$store.getters["myItemStore/myItem"](this.item.id);
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
