<template>
<mdb-card cascade class="m-0 p-0" style="max-width: 300px; border-radius: 10px; background-color: #eceff1;">
  <mdb-view hover cascade>
    <a href="#!">
      <img style="max-height: 200px; width: 100%; border-top-left-radius: 10px; border-top-right-radius: 10px; border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;" :src="item.images[0].dataUrl"  :alt="item.title"/>
      <mdb-mask flex-center style="max-width: 100%;" waves overlay="white-slight"></mdb-mask>
    </a>
  </mdb-view>
  <mdb-card-body class="text-center" cascade style="min-height: 10vh;">
    <mdb-card-title class="" style="color: #666;"><strong><router-link :to="itemUrl">{{item.title}}</router-link></strong></mdb-card-title>
    <mdb-card-text><description-container :text="item.description"/></mdb-card-text>
  </mdb-card-body>
  <mdb-card-body class="text-center" cascade style="min-height: 10vh;">
    <buyers-information :item="item" action="details" :myProfile="myProfile"/>
  </mdb-card-body>
  <mdb-card-footer>
    <div class="d-flex justify-content-between text-dark" style="font-size: 1.1rem;">
      <div><router-link :to="itemUrl"><i class="far fa-plus-square"></i></router-link></div>
      <div><router-link :to="itemUrl"><i class="far fa-eye mr-2"></i></router-link></div>
    </div>
  </mdb-card-footer>
</mdb-card>
<!--
<mdb-card class="brown lighten-4">
  <mdb-card-image :src="item.images[0].dataUrl" :alt="item.title" class=""></mdb-card-image>
  <mdb-card-body>
    <mdb-card-title><router-link :to="itemUrl">{{item.title}}</router-link></mdb-card-title>
    <mdb-card-text><description-container :text="item.description"/></mdb-card-text>
    <buyers-information :item="item" action="details" :myProfile="myProfile"/>
  </mdb-card-body>
</mdb-card>
-->
</template>

<script>
import moment from "moment";
import DescriptionContainer from "../utils/DescriptionContainer";
import ItemImageListView from "../myItem/ItemImageListView";
import BuyersInformation from "../selling/BuyersInformation";
import ItemPosted from "../myItem/ItemPosted";
import { mdbContainer, mdbRow, mdbCol, mdbCard, mdbCardImage, mdbCardHeader, mdbCardBody, mdbCardTitle, mdbCardText, mdbCardFooter, mdbCardUp, mdbCardAvatar, mdbCardGroup, mdbBtn, mdbView, mdbMask, mdbIcon } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SingleItem",
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
    };
  },
  mounted() {},
  methods: {
  },
  computed: {
    itemUrl() {
      return `/items/${this.item.id}`;
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
