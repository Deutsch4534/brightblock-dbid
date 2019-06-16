<template>
<mdb-col @click.native="show(0)" v-if="isImage">
  <mdb-view hover>
    <img class="inplay-image img-fluid mb-4" width="100%" :src="mediaObject[0].dataUrl" :alt="altText">
    <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
  </mdb-view>
</mdb-col>
<video id="video-item" controls width="100%" v-else>
  <source type="video/mp4" :src="mediaObject[1].dataUrl">
</video>
</template>

<script>
import { mdbView, mdbCol, mdbMask } from 'mdbvue';
import collaborationService from "@/services/collaborationService";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MediaContainer",
  components: {
    mdbView, mdbCol, mdbMask
  },
  props: ["mediaObject", "altText"],
  data() {
    return {
    };
  },
  mounted() {
  },
  computed: {
    isImage: function() {
      let type = this.mediaObject[0].type;
      return type.indexOf("image/") > -1 && type.indexOf("image/cover") === -1;
    },
    isVideo: function() {
      return this.mediaObject[1].type.indexOf("video/") > -1;
    }
  },
  methods: {
  }
};
</script>
<style scoped>
</style>
