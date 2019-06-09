<template>
<div class="container mt-5">
  <div class="row">
    <div class="col-md-12 ">
    <mdb-media tag="div">
      <img v-if="auction.logo" class="img-fluid d-flex mr-3" style="width: 100px; border-radius: 20px;" :src="auction.logo.dataUrl" alt="auction.logo.name" />
      <mdb-media-body>
        <h5 class="mt-0 mb-2 font-weight-bold">{{auction.title}}</h5>
        <p>{{auction.description}}</p>
        <p class="">{{message}} - <router-link to="/online-auctions"><u>back to auctions</u></router-link>.</p>
      </mdb-media-body>
    </mdb-media>
    </div>
  </div>
</div>
</template>

<script>
import { mdbMedia, mdbMediaBody, mdbMediaImage, mdbContainer } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "AuctionFinished",
  components: {
    mdbMedia,
    mdbMediaBody,
    mdbMediaImage,
    mdbContainer
  },
  props: ["auction", "reason"],
  data() {
    return {
      messageFinished: "The auction has finished",
      messageEmpty: "The catalogue is being prepared",
    };
  },
  methods: {
  },
  computed: {
    message() {
      if (this.reason === "finished") {
        return this.messageFinished;
      } else {
        return this.messageEmpty;
      }
    }
  }
};
</script>
<style scoped>
.inplay-image  img {
    position: relative;
    display: block;
    width: 100%;
}
</style>
