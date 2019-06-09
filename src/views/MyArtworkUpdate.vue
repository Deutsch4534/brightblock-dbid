<template>
<div class="container-fluid bg-light flex-1 py-5" v-if="loading">
  <div>Loading artwork - please wait...</div>
</div>
<div class="container-fluid bg-light flex-1 py-5" v-else>
  <my-artwork-upload-form :artworkId="artworkId" :mode="'update'" :formTitle="'Update Artwork'"/>
</div>
</template>

<script>
import MyArtworkUploadForm from "./components/myArtwork/MyArtworkUploadForm";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtworkUpdate",
  bodyClass: "index-page",
  components: {
    MyArtworkUploadForm
  },
  data() {
    return {
      loading: true,
    };
  },
  created() {
    this.artworkId = Number(this.$route.params.artworkId);
    this.$store.dispatch("myAccountStore/fetchMyAccount").then((myProfile) => {
      if (myProfile) {
        if (!myProfile.publicKeyData || !myProfile.publicKeyData.bitcoinAddress) {
          this.$router.push("/profile/update?from=upload-artwork");
        } else {
          this.enabled = true; // myProfile.showAdmin;
        }
      }
      this.loading = false;
    });
  },
  computed: {},
  methods: {}
};
</script>
