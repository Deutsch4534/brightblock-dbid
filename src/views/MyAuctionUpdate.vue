<template>
<div class="container-fluid bg-light flex-1 py-5" v-if="loading">
  <div>Loading auction - please wait...</div>
</div>
<div class="container-fluid bg-light flex-1" v-else>
  <my-auction-upload-form v-if="enabled" :auctionId="auctionId" :mode="'update'"/>
</div>
</template>

<script>
import MyAuctionUploadForm from "./components/auction/MyAuctionUploadForm";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyAuctionUpload",
  bodyClass: "index-page",
  components: {
    MyAuctionUploadForm
  },
  data() {
    return {
      enabled: false,
      auctionId: null,
      featureMessage: 'Get in touch about running <a href="mailto:mjoecohen@gmail.com">auctions</a>.',
      loading: true
    };
  },
  created() {
    this.auctionId = Number(this.$route.params.auctionId);
    this.$store.dispatch("myAccountStore/fetchMyAccount").then((myProfile) => {
      if (myProfile) {
        this.enabled = myProfile.showAdmin;
      }
      if (this.enabled) {
        this.auctionId = Number(this.$route.params.auctionId);
        this.$store.dispatch("myAuctionsStore/fetchMyAuction", this.auctionId).then(auction => {
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    });
  },
  computed: {},
  methods: {}
};
</script>
