<template>
  <mdb-card class="bg-transparent mb-4 w-100">
    <router-link class="grid-item" :to="artworkUrl">
      <mdb-card-image :src="artwork.image" :alt="artwork.title"></mdb-card-image>
    </router-link>
    <mdb-card-body class="px-0">
      <mdb-card-title class="h2-responsive subtitle">{{artwork.title}}<br /><span class="small">by: {{artwork.artist}}</span></mdb-card-title>
      <mdb-card-text v-if="debugMode">{{artwork.bcitem.itemIndex}}, Owner: {{artwork.owner}}</mdb-card-text>
      <mdb-card-text><description-overflow :text="artwork.description"/></mdb-card-text>
    </mdb-card-body>
  </mdb-card>
</template>

<script>

import { mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText } from 'mdbvue';
import DescriptionOverflow from "@/views/components/utils/DescriptionOverflow";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "LastArtwork",
  components: {
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    DescriptionOverflow
  },
  props: {
    artwork: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      image: require("@/assets/img/faces/avatar.jpg"),
      responsive: false
    };
  },
  mounted() {
    this.onResponsiveInverted();
    window.addEventListener("resize", this.onResponsiveInverted);
  },
  methods: {
    onResponsiveInverted() {
      if (window.innerWidth < 600) {
        this.responsive = true;
      } else {
        this.responsive = false;
      }
    }
  },
  computed: {
    artworkUrl() {
      return `/artworks/${this.artwork.id}`;
    },
    debugMode() {
      return this.$store.getters["isDebugMode"];
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
  }
};
</script>
<style scoped>
  .subtitle {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
  .subtitle,
  .card-body p {
    color: #000!important;
  }
</style>
