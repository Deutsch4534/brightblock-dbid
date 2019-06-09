<template>
<loading-view v-if="loading" :loadingMessage="loadingMessage"/>
<mdb-container fluid class="main bg-dark flex-1 py-5" v-else>
  <mdb-container class="py-3 py-md-4">
    <mdb-row v-if="!galleryId">
      <mdb-col col="12">
        <h1 class="h1-responsive mb-5">Radicle Gallery</h1>
      </mdb-col>
    </mdb-row>
    <mdb-media tag="div" v-else>
      <mdb-media tag="div">
        <img v-if="gallery.coverImage" class="img-fluid d-flex mr-3" style="width: 100px; border-radius: 20px;" :src="gallery.coverImage.dataUrl" alt="gallery.coverImage.name" />
        <mdb-media-body>
          <h5 class="mt-0 mb-2 font-weight-bold text-white">{{gallery.title}}</h5>
          <p class="text-white">{{gallery.description}}</p>
        </mdb-media-body>
      </mdb-media>
    </mdb-media>
    <mdb-row class="article">
      <single-result v-for="(artwork, index) of artworks" :key="index" :artwork="artwork" class="result-item"/>
    </mdb-row>
  </mdb-container>
</mdb-container>
</template>

<script>
import SingleResult from "./components/search/SingleResult";
import artworkSearchService from "@/services/artworkSearchService";
import { mdbCard, mdbCol, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from 'mdbvue';
import { mdbContainer, mdbRow } from 'mdbvue';
import { mdbMedia, mdbMediaBody, mdbMediaImage } from 'mdbvue';
import LoadingView from "@/views/components/utils/LoadingView";
import SingleGallery from "./components/gallery/SingleGallery";

export default {
  components: {
    mdbContainer,
    mdbCol,
    mdbRow,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn, mdbMedia, mdbMediaBody, mdbMediaImage,
    // SingleAuction,
    // LastArtwork,
    SingleResult,
    LoadingView,
    SingleGallery
  },
  name: "home",
  bodyClass: "index-page",
  props: {
    image: {
      type: String,
      default: require("@/assets/img/missing/artwork-missing.jpg")
    },
    signup: {
      type: String,
      default: require("@/assets/img/missing/artwork-missing.jpg")
    }
  },
  data() {
    return {
      galleryId: null,
      gallerist: null,
      gallery: null,
      loadingMessage: "Loading galleries please wait...",
      loading: true,
    };
  },
  mounted() {
    this.galleryId = Number(this.$route.params.galleryId);
    this.gallerist = this.$route.params.gallerist;
    this.doMount();
  },
  watch: {
    '$route' (to, from) {
      this.galleryId = Number(this.$route.params.galleryId);
      this.doMount();
    }
  },
  methods: {
    doMount() {
      if (this.galleryId) {
        this.$store.dispatch("galleryStore/fetchGallery", {gallerist: this.gallerist, galleryId: this.galleryId}).then((gallery) => {
          // loading online gallery
          if (gallery) {
            this.gallery = gallery;
            this.$store.dispatch("artworkSearchStore/fetchArtworkByGallery", {gallerist: gallery.owner, galleryId: this.galleryId}).then((artworks) => {
            });
            document.title = gallery.title + " at radicle.art";
            this.loading = false;
          } else {
            this.loadingMessage = "Gallery is currently offline.";
          }
        });
      } else {
        artworkSearchService.newQuery(this.$store, {field: "title", query: "*"});
        document.title = "Galleries at radicle.art";
        this.loading = false;
      }
    },
  },
  computed: {
    artworks() {
      return this.$store.getters["artworkSearchStore/getBitcoinResults"];
    }
  }
};
</script>
<style scoped>
.main {
  min-height: 100vh;
}
.article {
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  justify-content: flex-start;
}
@media (max-width: 900px) {
  .article {
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    justify-content: center;
  }
}

@media all and (min-width: 991px) {
  .btn-container {
    display: flex;
  }
}
</style>
<style scoped>
h1 {
  margin-bottom: 0.25rem;
  color: white;
}
.card-body p,
.subtitle {
    color: white!important;
}
</style>
