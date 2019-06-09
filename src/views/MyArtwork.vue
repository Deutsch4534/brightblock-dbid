<template>
<mdb-container fluid class=" flex-1 pt-5">
  <mdb-container class="bg-white mt-5 p-3" v-if="loading">
    <div>Loading artwork - please wait...</div>
  </mdb-container>
  <my-artwork-manage :artwork="artwork" :asset="asset" :myProfile="myProfile" @reload="reload" v-else/>
</mdb-container>
</template>

<script>
import MyArtworkManage from "./components/myArtwork/MyArtworkManage";
import { mdbContainer, mdbRow,  mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, mdbCardImage, mdbMask, mdbIcon, mdbView, mdbBtn } from 'mdbvue';
import utils from "@/services/utils";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtwork",
  bodyClass: "index-page",
  components: {
    MyArtworkManage,
    mdbContainer,
    mdbRow,
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
  data() {
    return {
      artwork: null,
      asset: null,
      myProfile: {},
      loading: true
    };
  },
  created() {
    let artworkId = Number(this.$route.params.artworkId);
    this.$store.dispatch("myArtworksStore/fetchMyArtwork", artworkId).then((artwork) => {
      if (!artwork) {
        this.$router.push("/my-artworks");
        return;
      }
      this.artwork = artwork;
      this.$store.dispatch("myAccountStore/fetchMyAccount").then(myProfile => {
        this.myProfile = myProfile;
        let assetHash = utils.buildBitcoinHash(artwork);
        this.$store.dispatch("assetStore/lookupAssetByHash", assetHash).then(asset => {
          if (asset) {
            this.asset = asset;
            this.loading = false;
          } else {
            this.$store.dispatch("assetStore/initialiseAsset", artwork).then(asset => {
              this.asset = asset;
              this.loading = false;
            });
          }
        });
      });
    });
  },
  methods: {
    reload: function() {
      this.artwork = this.$store.getters["myArtworksStore/myArtwork"](this.artwork.id);
    }
  },
};
</script>
