<template>
<mdb-container fluid class="bg-light flex-1 px-5">
  <send-message v-if="showModal" :modal="showModal" @closeModal="closeModal" :recipient="artwork.owner"/>
  <mdb-container class="mt-5 p-3" v-if="loading">
    <div>Loading artwork - please wait...</div>
  </mdb-container>
  <mdb-container v-else>
    <mdb-row class="mdb-lightbox py-5">
      <mdb-col col="12" md="7" @click.native="show(0)">
        <mdb-view hover>
          <img class="inplay-image img-fluid mb-4" width="100%" :src="artwork.image" :alt="artwork.title" v-if="isImage">
          <media-container :mediaObject="artwork.artwork" :altText="artwork.title" v-else/>
          <mdb-mask flex-center waves overlay="white-slight" v-if="isImage"></mdb-mask>
        </mdb-view>
      </mdb-col>
      <mdb-col col="11" md="5" class="pl-md-3">
        <div class="row pl-md-3">
          <mdb-col md="11">
            <h2>{{artwork.title}}</h2>
          </mdb-col>
          <mdb-col md="1">
            <be-social :myPageUrl="myPageUrl" :artist="artist.name"/>
          </mdb-col>
          <mdb-col col="12">
            <p><router-link :to="artistUrl()"><u>{{artist.name}}</u></router-link></p>
            <p class="mb-1">
              {{artwork.dimensions}}
              <br/>
              <description-overflow :text="artwork.description"/>
            </p>
            <!--
            <div>
              <a title="message seller" @click.prevent="showModal = !showModal"><mdb-icon far icon="envelope" /></a>
            </div>
            -->
            <div v-if="showAuction">
              <router-link :to="auctionUrl"><u>artwork selling in auction</u></router-link>
            </div>
            <div v-else>
              <buy-artwork-form-btc v-if="!showAuction && isNotBeingBought && showBuyOptions && isRegisteredAndPriceSet" :artwork="artwork" :asset="asset" :myProfile="myProfile"/>
              <div v-if="!isNotBeingBought || !isRegisteredAndPriceSet">
                <button :disabled="true" class="btn teal darken-1">not for sale</button>
                <router-link to="/gallery">
                  <button class="btn teal lighten-1">continue browsing</button>
                </router-link>
              </div>
            </div>
          </mdb-col>
        </div>
      </mdb-col>
    </mdb-row>
  </mdb-container>
  <mdb-lightbox
  :visible="visible"
  :imgs="images"
  :index="index"
  @hide="handleHide"></mdb-lightbox>
</mdb-container>
</template>

<script>
import AboutArtwork from "./components/artwork/AboutArtwork";
import BuyArtworkFormBtc from "./components/artwork/BuyArtworkFormBtc";
import artworkSearchService from "@/services/artworkSearchService";
import notify from "@/notify";
import moneyUtils from "@/services/moneyUtils";
import utils from "@/services/utils";
import { Sticky } from 'mdbvue';
import { mdbIcon, mdbMask, mdbView, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from 'mdbvue';
import { mdbLightbox, mdbContainer, mdbCol, mdbRow } from 'mdbvue';
import moment from "moment";
import DescriptionOverflow from "@/views/components/utils/DescriptionOverflow";
import BeSocial from "@/views/components/utils/BeSocial";
import SendMessage from "@/views/components/utils/SendMessage";
import MediaContainer from "@/views/components/utils/MediaContainer";
import bitcoinService from "brightblock-lib/src/services/bitcoinService";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Artwork",
  directives: {
    'sticky': Sticky
  },
  bodyClass: "index-page",
  components: {
    MediaContainer,DescriptionOverflow,BeSocial,SendMessage,
    BuyArtworkFormBtc,
    AboutArtwork,
    mdbLightbox,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbIcon,
    mdbMask,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn,
    mdbView
  },
  data() {
    return {
      artwork: {
        image: require("@/assets/img/missing/artwork-missing.jpg"),
        saleData: {},
      },
      myProfile: {},
      showBuyOptions: false,
      showAuction: true,
      visible: false,
      index: 0,
      loading: true,
      showModal: false,
      asset: null
    };
  },
  mounted() {
    this.artworkId = Number(this.$route.params.artworkId);
    this.myProfile = this.$store.getters["myAccountStore/getMyProfile"];
    let $self = this;
    artworkSearchService.newQuery(this.$store, {field: "id", query: this.artworkId}, function(artwork) {
      if (artwork) {
        $self.artwork = artwork;
        let assetHash = utils.buildBitcoinHash($self.artwork);
        $self.$store.dispatch("assetStore/lookupAssetByHash", assetHash).then(asset => {
          if (asset) {
            $self.asset = asset;
          } else {
            $self.$store.dispatch("assetStore/initialiseAsset", artwork).then(asset => {
              $self.asset = asset;
            });
          }
        });
      }
      $self.loading = false;
      $self.loadView();
    });
  },
  computed: {
    artist() {
      let artwork = this.artwork;
      if (artwork.artist) {
        return this.$store.getters["userProfilesStore/getProfile"](artwork.artist);
      }
      return {name: ""};
    },
    isImage: function() {
      try {
        return this.artwork.artwork[0].type.indexOf("image/cover") === -1;
      } catch (e) {
        return true;
      }
    },
    images() {
      let images = [];
      images.push(this.artwork.image);
      return images;
    },
    isNotBeingBought() {
      return this.artwork.status !== this.$store.state.constants.statuses.artwork.PURCHASE_BEGUN;
    },
    created() {
      if (this.artwork.created) {
        return moment(this.artwork.created).format("DD/MMM/YYYY");
      }
      return moment(this.artwork.id).format("DD/MMM/YYYY");
    },
    keywords() {
      if (this.artwork.keywords) {
        let keys = this.artwork.keywords.split(",");
        return keys.join(" ");
      }
      return "";
    },
    aboutArtwork() {
      let artwork = this.artwork;
      let artist = this.$store.getters["userProfilesStore/getProfile"](
        artwork.artist
      );
      let owner = this.$store.getters["userProfilesStore/getProfile"](
        artwork.owner
      );
      return {
        artist: artist,
        owner: owner,
        title: artwork.title,
        keywords: artwork.keywords,
        year: artwork.year,
        image: artwork.image
      };
    },
    myPageUrl() {
      let pathname = encodeURI("https://radicle.art" + location.pathname);
      return pathname;
    },
    isRegisteredAndPriceSet() {
      return this.artwork.bitcoinTx && this.artwork.saleData.amount > 0;
    },
    auctionUrl() {
      return `/online-auction/${this.artwork.saleData.auctionId}`;
    },
    artworks() {
      let artwork = this.artwork;
      return this.$store.getters["artworkSearchStore/getArtworksByArtist"](
        artwork.artist
      );
    }
  },
  methods: {
    loadView () {
      document.title = "Artwork at Radicle: " + this.artwork.title;
      this.showBuyOptions = true;
      // check for redirect to auctions...
      if (this.artwork.saleData.salePlace !== "marketplace" && this.artwork.saleData.auctionId && this.artwork.saleData.auctionId > -1) {
        // this.$router.push("/online-auction/" + artwork.saleData.auctionId);
        this.showAuction = true;
      } else {
        this.showAuction = false;
      }
      this.loading = false;
    },
    artistUrl () {
      let artwork = this.artwork;
      return '/artists/' + artwork.artist;
    },
    closeModal: function() {
      this.showModal = false;
    },
    show(index) {
      this.index = index;
      this.visible = true;
    },
    handleHide() {
      this.visible = false;
    }
  }
};
</script>
<style>
.view img {
  width: 100%;
}
</style>
