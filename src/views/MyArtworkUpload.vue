<template>
<loading-view v-if="loading" :loadingMessage="loadingMessage"/>
<div v-else>
  <contact-section :featureMessage="featureMessage" v-if="!enabled"/>
  <mdb-container fluid class="bg-light" v-else>
    <mdb-container class="py-3 py-md-4">
      <my-artwork-upload-form :formTitle="'Upload Artwork'" :mode="'upload'"/>
    </mdb-container>
  </mdb-container>
</div>
</template>

<script>
import MyArtworkUploadForm from "./components/myArtwork/MyArtworkUploadForm";
import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';
import ContactSection from "@/pages/components/help/ContactSection";
import LoadingView from "@/views/components/utils/LoadingView";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtworkUpload",
  bodyClass: "index-page",
  components: {
    MyArtworkUploadForm,
    ContactSection,
    LoadingView,
    mdbContainer, mdbRow, mdbCol
  },
  data() {
    return {
      enabled: false,
      featureMessage: "Please drop us a note about registering as an artist.",
      loadingMessage: "Loading Radicle upload art form please wait...",
      loading: true
    };
  },
  mounted() {
    this.$store.dispatch("myAccountStore/fetchMyAccount").then((myProfile) => {
      if (myProfile) {
        if (!myProfile.publicKeyData || !myProfile.publicKeyData.bitcoinAddress) {
          this.$router.push("/profile/update?from=upload-artwork");
        // } else {
          // this.enabled = myProfile.showAdmin;
        }
        this.loading = false;
        this.enabled = true;
      }
    });
  },
  computed: {},
  methods: {}
};
</script>
