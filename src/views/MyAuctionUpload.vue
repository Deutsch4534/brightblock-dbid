<template>
<loading-view v-if="loading" :loadingMessage="loadingMessage"/>
<div v-else>
  <contact-section :featureMessage="featureMessage" v-if="!enabled"/>
  <mdb-container fluid class="" v-else>
    <mdb-container class="py-3 py-md-4">
      <my-auction-upload-form v-if="enabled" :mode="'upload'"/>
    </mdb-container>
  </mdb-container>
</div>
</template>

<script>
import MyAuctionUploadForm from "./components/auction/MyAuctionUploadForm";
import ContactSection from "@/views/components/splash/ContactSection";
import LoadingView from "@/views/components/utils/LoadingView";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyAuctionUpload",
  bodyClass: "index-page",
  components: {
    MyAuctionUploadForm,
    LoadingView,
    ContactSection,
  },
  data() {
    return {
      enabled: false,
      auctionId: null,
      featureMessage: "Please drop us a note about registering as an artist.",
      loadingMessage: "Loading Radicle upload art form please wait...",
      loading: true
    };
  },
  created() {
    this.$store.dispatch("myAccountStore/fetchMyAccount").then((myProfile) => {
      if (myProfile) {
        this.enabled = myProfile.showAdmin;
      }
      this.loading = false;
    });
  },
  computed: {},
  methods: {}
};
</script>
