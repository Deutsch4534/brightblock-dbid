<template>
  <mdb-container fluid class="bg-dark flex-1 py-5">
    <mdb-container class="py-3 py-md-4">
      <mdb-row>
        <mdb-col col="12">
          <h1 class="h1-responsive mb-5">Artists</h1>
        </mdb-col>
      </mdb-row>
      <mdb-row>
        <single-artist v-for="(artist, index) of artists" :key="index" :artist="artist" class="single-artist col-sm-6 col-md-4 col-lg-3 mb-3 d-flex"/>
      </mdb-row>
    </mdb-container>
  </mdb-container>
</template>

<script>
import SingleArtist from './components/artists/SingleArtist'
import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';
import artworkSearchService from "@/services/artworkSearchService";

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Artists',
  components: {
    SingleArtist,
    mdbContainer,
    mdbRow,
    mdbCol
  },
  data () {
    return {
    }
  },

  mounted () {
    if (this.$store.state.constants.featureBitcoin) {
      artworkSearchService.newQuery(this.$store, {field: "title", query: "*"});
    }
    document.title = "All artists at dbid.io";
  },
  computed: {
    artists () {
      return this.$store.getters['userProfilesStore/getProfiles']
      // return this.$store.getters['artworkSearchStore/getArtistsPage']
    },
  },
  methods: {
    updateFilters (filters) {
      this.filters = filters
    },
    loadMore () {
      //
    }
  }
}
</script>
<style scoped>
h1 {
  margin-bottom: 0.25rem;
  color: white;
}
</style>
