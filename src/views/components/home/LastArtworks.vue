<template>
<div class="row">
  <last-artwork v-for="(artwork, index) in artworks" :key="index" :artwork="artwork" class="col-sm-6 col-lg-4"/>
</div>
</template>

<script>
import chunk from "lodash/chunk";
import LastArtwork from "./LastArtwork";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "LastArtworks",
  components: { LastArtwork },
  props: {
    artworks: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    artworksChunked() {
      return chunk(this.artworks, 3);
    }
  }
};
</script>
<style scoped>
  >>> .h2-responsive.subtitle {
    font-size: 1rem!important;
    margin-bottom: 0.25rem;
  }
</style>
