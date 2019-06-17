<template>
  <mdb-container fluid class="bg-dark flex-1 py-5">
    <mdb-container class="py-5">
      <mdb-row>
        <single-artist :artist="artist" class="col-sm-12 col-md-4 col-lg-3 mb-3 artist-page"/>
        <div class="col-sm-12 col-md-8 col-lg-9 pl-5 pb-3">
          <h2 class="text-white pb-3">All artworks</h2>
          <div id="artist-all-artworks" class="bg-dark flex-1">
            <div class="row article">
              <single-result v-for="(artwork, index) of artworks" :key="index" :artwork="artwork" class="result-item"/>
            </div>
          </div>
        </div>
      </mdb-row>
    </mdb-container>
  </mdb-container>
</template>

<script>
import ArtistDetails from './components/artists/ArtistDetails'
import { mdbContainer, mdbRow } from 'mdbvue';
import SingleArtist from './components/artists/SingleArtist'
import SingleResult from "./components/search/SingleResult";
import artworkSearchService from "@/services/artworkSearchService";

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Artist',
  components: {
    SingleResult,
    SingleArtist,
    ArtistDetails,
    mdbContainer,
    mdbRow,
  },
  data () {
    return {
    }
  },
  created () {
    this.username = this.$route.params.artistId
    document.title = "Art by " + this.username + " at dbid.io";
    if (this.$store.state.constants.featureBitcoin) {
      artworkSearchService.newQuery(this.$store, {field: "artist", query: this.username});
    }
  },
  mounted () {
  },
  computed: {
    artist () {
      let profile = this.$store.getters['userProfilesStore/getProfile'](this.username);
      if (!profile) {
        profile = {};
      }
      if (!profile.avatarUrl) {
        profile.avatarUrl = require("@/assets/img/faces/avatar.jpg");
      }
      return profile;
    },
    artworks () {
      return this.$store.getters['artworkSearchStore/getArtworksByArtist'](this.username);
    },
  },
  methods: {
  }
}
</script>
<style scoped>
.article {
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  justify-content: flex-start;
}

</style>
