<template>
  <mdb-container fluid class="bg-light flex-1 py-5">
    <mdb-container class="py-3 py-md-4">
    <mdb-row v-if="noartworks">
      <div class="col-8 offset-4 mb-5">
        <p class="h1-responsive mb-5">No artworks found in your portfolio!</p>
        <p><router-link to="/my-artwork/upload" class="btn btn-white btn-sm btn-rounded ripple-parent">Upload Artwork</router-link> to get started...</p>
      </div>
    </mdb-row>
    <div class="row" v-else>
      <div class="col-md-3">
        <mdb-navbar class="blue lighten-5">
          <mdb-navbar-nav nav vertical>
            <mdb-nav-item><h5>My Artworks</h5></mdb-nav-item>
            <mdb-nav-item href="#" :class="(showNav === 1) ? 'active' : ''" v-if="numberArtworksUnsold > 0"><span @click.prevent="showNav = 1">{{numberArtworksUnsold}} Unsold</span></mdb-nav-item>
            <mdb-nav-item href="#" :class="(showNav === 2) ? 'active' : ''" v-if="numberArtworksSold > 0"><span @click.prevent="showNav = 2">{{numberArtworksSold}} Sold</span></mdb-nav-item>
            <mdb-nav-item href="#" :class="(showNav === 3) ? 'active' : ''" v-if="numberArtworksSelling > 0"><span @click.prevent="showNav = 3">{{numberArtworksSelling}} Selling</span></mdb-nav-item>
            <mdb-nav-item href="#" :class="(showNav === 4) ? 'active' : ''" v-if="numberArtworksBuying > 0"><span @click.prevent="showNav = 4">{{numberArtworksBuying}} Buying</span></mdb-nav-item>
            <hr/>
            <mdb-nav-item href="#" :class="(showNav === 5) ? 'active' : ''" v-if="numberArtworksRegistered > 0"><span @click.prevent="showNav = 5">{{numberArtworksRegistered}} Registered</span></mdb-nav-item>
            <mdb-nav-item href="#" :class="(showNav === 6) ? 'active' : ''" v-if="numberArtworksUnregistered > 0"><span @click.prevent="showNav = 6">{{numberArtworksUnregistered}} Not Registered</span></mdb-nav-item>
          </mdb-navbar-nav>
        </mdb-navbar>
      </div>
      <div class="col-md-9">
        <mdb-row>

          <div class="col-12" v-if="showNav === 1">
            <h2 class="h2-responsive mb-5">Unsold</span></h2>
            <my-artworks-list :artworks="unsold" />
          </div>

          <div class="col-12" v-if="showNav === 2">
            <h2 class="h2-responsive mb-5">Sold</span></h2>
            <my-artworks-list :artworks="sold"/>
          </div>

          <div class="col-12" v-if="showNav === 3">
            <h2 class="h2-responsive mb-5">Selling</h2>
            <my-artworks-list :artworks="selling"/>
          </div>

          <div class="col-12" v-if="showNav === 4">
            <h2 class="h2-responsive mb-5">Buying</h2>
            <my-artworks-list :artworks="buying"/>
          </div>

          <div class="col-12" v-if="showNav === 5">
            <h2 class="h2-responsive mb-5">Registered</h2>
            <my-artworks-list :artworks="registered"/>
          </div>

          <div class="col-12" v-if="showNav === 6">
            <h2 class="h2-responsive mb-5">Not Registered</h2>
            <my-artworks-list :artworks="unregistered"/>
          </div>

        </mdb-row>
      </div>
    </div>
    </mdb-container>
  </mdb-container>
</template>

<script>
import MyArtworksList from "./components/myArtwork/MyArtworksList";
import { mdbContainer, mdbRow,  mdbCard,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbCardImage,
    mdbMask,
    mdbIcon,
    mdbView,
    mdbBtn } from 'mdbvue';
import { mdbNavbar, mdbNavbarNav, mdbNavItem } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtworks",
  bodyClass: "index-page",
  components: {
    MyArtworksList,
    mdbContainer,
    mdbRow,
     mdbCard,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbCardImage,
    mdbMask,
    mdbIcon,
    mdbView,
    mdbBtn, mdbNavbar, mdbNavbarNav, mdbNavItem
  },
  data() {
    return {
      showNav: 1,
    };
  },
  created() {
    this.$store.dispatch("myArtworksStore/fetchMyArtworks");
  },
  methods: {},
  computed: {
    unsold() {
      return this.$store.getters["myArtworksStore/unsold"];
    },
    selling() {
      return this.$store.getters["myArtworksStore/selling"];
    },
    sold() {
      return this.$store.getters["myArtworksStore/sold"];
    },
    buying() {
      return this.$store.getters["myArtworksStore/buying"];
    },
    registered() {
      return this.$store.getters["myArtworksStore/registered"](true);
    },
    unregistered() {
      return this.$store.getters["myArtworksStore/registered"](false);
    },
    numberArtworksRegistered() {
      return this.$store.getters["myArtworksStore/registered"](true).length;
    },
    numberArtworksUnregistered() {
      return this.$store.getters["myArtworksStore/registered"](false).length;
    },
    numberArtworksBuying() {
      return this.$store.getters["myArtworksStore/buying"].length;
    },
    numberArtworksSelling() {
      return this.$store.getters["myArtworksStore/selling"].length;
    },
    numberArtworksSold() {
      return this.$store.getters["myArtworksStore/numberArtworksSold"];
    },
    numberArtworksUnsold() {
      return this.$store.getters["myArtworksStore/numberArtworksUnsold"];
    },
    noartworks() {
      return (this.$store.getters["myArtworksStore/numberArtworksUnsold"] + this.$store.getters["myArtworksStore/numberArtworksSold"]) === 0;
    }
  }
};
</script>
<style scoped>
.active {
  background-color: #fff;
  font-weight: 300;
}
</style>
