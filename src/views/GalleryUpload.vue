<template>
<div class="container-fluid bg-light flex-1">
  <div class="container mt-5" v-if="loading">
    <p v-html="loadingMessage"></p>
  </div>
  <div v-else>
    <gallery-upload-form v-if="enabled" :myProfile="myProfile" :formTitle="'Radicle Galleries'"/>
    <contact-section v-else :featureMessage="featureMessage" v-else class="black-text"/>
  </div>
</div>
</template>

<script>
import GalleryUploadForm from "./components/gallery/GalleryUploadForm";
import ContactSection from "./components/splash/ContactSection";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "GalleryUpload",
  bodyClass: "index-page",
  components: {
    GalleryUploadForm,
    ContactSection
  },
  data() {
    return {
      myProfile: null,
      loading: true,
      enabled: false,
      featureMessage: "Get in touch about how to start a gallery on Radicle.",
      loadingMessage: "Please wait while we load peer data."
    };
  },
  mounted() {
    this.$store.dispatch("galleryStore/fetchMyGalleries").then((galleries) => {
      if (galleries && galleries.length > 3) {
        this.$router.push("/gallery/update/" + galleries[0].galleryId);
      } else {
        this.$store.dispatch("myAccountStore/fetchMyAccount").then((profile) => {
          this.myProfile = profile;
          this.enabled = true;
          this.loading = false;
        });
      }
    });
  },
  computed: {},
  methods: {}
};
</script>
