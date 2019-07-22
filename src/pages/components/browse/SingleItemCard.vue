<template>
<mdb-card v-if="item && item.id" cascade class="m-0 p-0 bg-card" style="max-width: 300px; border-radius: 10px; background-color: #eceff1;">
  <mdb-view hover cascade>
    <router-link :to="itemUrl">
      <img style="max-height: 200px; min-height: 200px; width: 100%; border-top-left-radius: 10px; border-top-right-radius: 10px; border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;" :src="itemImage"  :alt="item.title"/>
      <mdb-mask flex-center style="max-width: 100%;" waves overlay="white-slight"></mdb-mask>
    </router-link>
  </mdb-view>
  <mdb-card-body class="text-center" cascade >
    <div class="d-flex align-items-center align-content-between flex-column" style="min-height: 100px;">
      <div class=""><mdb-card-title><strong><router-link :to="itemUrl"><description-container :text="item.title" :limit="20" :morable="false" style="color: #445544;font-size: 1.4rem;"/></router-link></strong></mdb-card-title></div>
      <mdb-card-text v-if="debugMode">{{item.updated}}</mdb-card-text>
      <mdb-card-text v-if="debugMode" class="text-danger">{{item.owner}}</mdb-card-text>
      <mdb-card-text v-if="debugMode">{{item.searchWords}}</mdb-card-text>
      <mdb-card-text v-if="debugMode">{{item.keywords}}</mdb-card-text>
      <div class="mb-auto" v-if="debugMode"><mdb-card-text><description-container :text="item.description" :limit="4" :morable="true" class="text-muted" style="font-size: 1.1rem;"/></mdb-card-text></div>
      <div class="mt-auto"><buyers-information :item="item" action="details" :myProfile="myProfile"/></div>
    </div>
  </mdb-card-body>
  <mdb-card-footer>
    <div v-if="sellingAuction" class="d-flex justify-content-between text-dark" style="font-size: 1.1rem;">
      <div class="text-muted">
        <router-link :to="itemUrl" title="show bidding details"><i class="far fa-clock" :class="(countdown === 'bidding ended' ? 'text-danger' : 'text-success')"></i> <span style="line-height: 0.5rem; font-size: 0.8rem;">{{countdown}}</span></router-link>
      </div>
      <div>
        <router-link v-if="myItem" class="mr-2" :to="itemUrl" title="show buy now details"><i class="far fa-eye"></i></router-link>
        <router-link :to="myItemEditUrl" title="edit item"><i class="far fa-edit"></i></router-link>
      </div>
    </div>
    <div v-else class="d-flex justify-content-between text-dark" style="font-size: 1.1rem;">
      <router-link v-if="myItem" class="mr-2" :to="itemUrl" title="show buy now details"><i class="far fa-eye"></i></router-link>
      <router-link :to="myItemEditUrl" title="edit item"><i class="far fa-edit"></i></router-link>
    </div>
  </mdb-card-footer>
</mdb-card>
</template>

<script>
import moment from "moment";
import DescriptionContainer from "../utils/DescriptionContainer";
import ItemImageListView from "../myItem/ItemImageListView";
import BuyersInformation from "../selling/BuyersInformation";
import ItemPosted from "../myItem/ItemPosted";
import { mdbContainer, mdbRow, mdbCol, mdbCard, mdbCardImage, mdbCardHeader, mdbCardBody, mdbCardTitle, mdbCardText, mdbCardFooter, mdbCardUp, mdbCardAvatar, mdbCardGroup, mdbBtn, mdbView, mdbMask, mdbIcon } from 'mdbvue';
import utils from "@/services/utils";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SingleItemCard",
  components: {
    DescriptionContainer, ItemImageListView, BuyersInformation, ItemPosted,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbCard,
    mdbCardImage,
    mdbCardHeader,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbCardFooter,
    mdbCardUp,
    mdbCardAvatar,
    mdbCardGroup,
    mdbBtn,
    mdbView,
    mdbMask,
    mdbIcon
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    },
    myProfile: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  data() {
    return {
      image: require("@/assets/img/thumb_pre.png"),
    };
  },
  mounted() {},
  methods: {
  },
  computed: {
    countdown() {
      let serverTime = this.$store.getters["serverTime"];
      let timeLeft = utils.dt_Offset(serverTime, this.item.saleData.biddingEnds, true);
      if (!timeLeft) {
        return "bidding ended";
      }
      return timeLeft;
    },
    itemUrl() {
      return `/items/${this.item.id}`;
    },
    sellingAuction() {
      if (this.item.saleData.soid === 2 && this.item.saleData.reserve > 0 && this.item.saleData.increment > 0) {
        return true;
      }
    },
    myItemEditUrl() {
      return `/my-items/update/${this.item.id}`;
    },
    myItem() {
      return this.item && this.myProfile.username === this.item.owner;
    },
    itemImage() {
      if (this.item && this.item.images && this.item.images.length > 0) {
        return this.item.images[0].dataUrl;
      }
      return this.image;
    },
    updated() {
      return moment(this.item.updated).format("LLLL");
    },
    debugMode() {
      return this.$store.state.constants.debugMode;
    },
  }
};
</script>
<style scoped>
.card {
  border: none;
  border-radius: 20px;
  background-color: blue;
  padding: 0;
}
</style>
