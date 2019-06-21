<template>
<loading-view v-if="loading" :loadingMessage="loadingMessage"/>
<div v-else>
<contact-section :featureMessage="featureMessage" v-if="!enabled"/>
<mdb-container fluid class="bg-light flex-1 py-5" v-else>
  <mdb-container class="py-3 py-md-4" v-if="!enabled">
    <mdb-row>
      <div class="col-12 bg-main">
        <contact-section :featureMessage="featureMessage"/>
      </div>
    </mdb-row>
  </mdb-container>
  <mdb-container class="py-3 py-md-4" v-else>
    <div class="row">
      <div class="col-md-12">
        <mdb-row>
          <h2 class="h2-responsive mb-5">Radicle Galleries</h2>
        </mdb-row>
        <mdb-row>
          <div class="col-12">
            <p><router-link to="/gallery/upload">Create a Radicle Gallery</router-link></p>
          </div>
        </mdb-row>
        <div class="row">
          <single-gallery v-for="(gallery, index) of galleries" :key="index" :gallery="gallery" :context="'my-galleries'"/>
        </div>
      </div>
    </div>
  </mdb-container>
</mdb-container>
</div>
</template>

<script>
import MyArtworksList from "./components/myArtwork/MyArtworksList";
import { mdbContainer, mdbRow,  mdbCard,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbCardImage,
    mdbMask,
    mdbIcon,
    mdbView,
    mdbBtn } from 'mdbvue';
import { mdbNavbar, mdbNavbarNav, mdbNavItem } from "mdbvue";
import SingleGallery from "./components/gallery/SingleGallery";
import ContactSection from "@/pages/components/help/ContactSection";
import LoadingView from "@/views/components/utils/LoadingView";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyGalleries",
  bodyClass: "index-page",
  components: {
    LoadingView,
    ContactSection,
    SingleGallery,
    MyArtworksList,
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
    mdbBtn, mdbNavbar, mdbNavbarNav, mdbNavItem
  },
  data() {
    return {
      enabled: false,
      galleries: null,
      featureMessage: "Please drop us a note about about partnering with us to run your own Radicle Gallery.",
      loadingMessage: "Loading Radicle Galleries please wait...",
      loading: true,
    };
  },
  mounted() {
    this.$store.dispatch("galleryStore/fetchMyGalleries").then((myGalleries) => {
      this.$store.dispatch("myAccountStore/fetchMyAccount").then((myProfile) => {
        if (myProfile) {
          this.enabled = myProfile.showAdmin;
          this.galleries = myGalleries;
          this.loading = false;
        } else {
          this.loadingMessage = "Please login.";
        }
      });
    });
  },
  methods: {
  },
  computed: {
    //galleries() {
  //    return this.$store.getters["galleryStore/getMyGalleries"];
    //},
  }
};
</script>
<style scoped>
.active {
  background-color: #fff;
  font-weight: 300;
}
</style>
