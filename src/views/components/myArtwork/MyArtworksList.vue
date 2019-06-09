<template>
<div class="row">
  <my-single-artwork v-for="(artwork, index) of artworks" :key="index" :artwork="artwork" class="col-sm-6 col-md-4 col-lg-4"/>
</div>
</template>

<script>
import MySingleArtwork from "./MySingleArtwork";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtworksList",
  components: { MySingleArtwork },
  props: {
    sellingStatus: null,
    artworks: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
  }
};
</script>
