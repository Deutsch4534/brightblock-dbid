<template>
  <mdb-card class="bg-transparent mb-5">
    <mdb-view hover>
      <router-link :to="myArtworkUrl" class="inline-block">
        <mdb-card-image :src="artwork.image" :alt="artwork.title" v-if="isImage"></mdb-card-image>
        <mdb-mask flex-center waves overlay="white-slight" v-if="isImage"></mdb-mask>
        <media-container :mediaObject="artwork.artwork" :altText="artwork.title" class="inline-block" v-else/>
      </router-link>
    </mdb-view>
    <mdb-card-body class="px-0 pb-2 mb-0">
      <mdb-card-title class="subtitle">
        <h5><router-link :to="myArtworkUrl" class="inline-block">
          {{artwork.title}}
        </router-link></h5>
      </mdb-card-title>
      <mdb-card-text>
        <selling-options :artwork="artwork" v-if="sellingStatus === 'unsold'"/>
        <description-overflow :text="artwork.description"/>
        <p class="artwork-caption" v-if="debugMode && artwork">{{artwork.bcitem}}</p>
        <p>by {{artistProfile.name}}, 11/08/2018 <br/>
        <span v-if="artwork.bitcoinTx">registered</span>
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
        <mdb-btn rounded color="white" size="sm" class="mx-0 waves-light" v-if="artwork.bitcoinTx">CoA</mdb-btn>
      </router-link>
      <router-link :to="registerForSaleUrl" class="inline-block">
        <mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light" v-if="canSell">Sell</mdb-btn>
      </router-link>
      <a @click="deleteArtwork(artwork.id)" class="inline-block">
        <mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light" v-if="debugMode">Delete</mdb-btn>
      </a>
      <router-link :to="editUrl" class="inline-block">
        <mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light" v-if="editable">Edit</mdb-btn>
      </router-link>
      <router-link :to="myArtworkUrl" class="inline-block">
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
  name: "MySingleArtwork",
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
    artwork: {
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
    deleteArtwork(id) {
      this.$store.dispatch("myArtworksStore/deleteMyArtwork", id);
    }
  },
  computed: {
    editable() {
      return this.$store.getters["myArtworksStore/editable"](this.artwork.id);
    },
    isImage: function() {
      try {
        return this.artwork.artwork[0].type.indexOf("image/cover") === -1;
      } catch (e) {
        return true;
      }
    },
    created() {
      if (this.artwork.created) {
        return moment(this.artwork.created).format("YYYY-MM-DD");
      }
      return moment(this.artwork.id).format("DD/MMM/YYYY");
    },
    debugMode() {
      return this.$store.state.constants.debugMode;
    },
    canSell() {
      return this.$store.getters["myArtworksStore/canSell"](this.artwork.id);
    },
    canRegister() {
      let canRegister = this.$store.getters["myArtworksStore/canRegister"](
        this.artwork.id
      );
      return canRegister && !this.sold;
    },
    artistProfile() {
      let profile = this.$store.getters["userProfilesStore/getProfile"](
        this.artwork.artist
      );
      return profile ? profile : {};
    },
    ownerProfile() {
      return this.$store.getters["userProfilesStore/getProfile"](
        this.artwork.owner
      );
    },
    editUrl() {
      return `/my-artwork/update/${this.artwork.id}`;
    },
    myArtworkUrl() {
      return `/my-artworks/${this.artwork.id}`;
    },
    registerUrl() {
      return `/my-artwork/register/${this.artwork.id}`;
    },
    registerForSaleUrl() {
      let a = this.$store.getters["myArtworksStore/myArtwork"](this.artwork.id);
      let id = this.artwork.id;
      if (this.artwork.saleData || !this.artwork.saleData.soid) {
        let amount = 0;
        let currency = "EUR";
        return `/my-artwork/register-for-sale/${id}/${amount}/${currency}`;
      } else if (this.artwork.saleData.soid <= 1) {
        let amount = a.saleData ? a.saleData.amount : 0;
        let currency = a.saleData ? a.saleData.fiatCurrency : "EUR";
        return `/my-artwork/register-for-sale/${id}/${amount}/${currency}`;
      } else if (this.artwork.saleData.soid === 2) {
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
