<template>
    <mdb-card class="bg-transparent mb-5 w-100">
      <router-link class="grid-item" :to="artistUrl">
        <mdb-view hover>
          <mdb-card-image :src="avatar" :alt="artist.name" class="img-square"></mdb-card-image>
          <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
        </mdb-view>
      </router-link>
      <mdb-card-body class="px-0">
        <mdb-card-title class="text-white">{{artist.name}}</mdb-card-title>
      </mdb-card-body>
    </mdb-card>
</template>

<script>
import { mdbTestimonial, mdbContainer, mdbRow, mdbCol, mdbCard, mdbCardBody, mdbCardUp, mdbAvatar, mdbIcon, mdbCardImage, mdbCardTitle, mdbCardText, mdbView, mdbMask } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SingleArtist',
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbCard,
    mdbCardBody,
    mdbCardUp,
    mdbAvatar,
    mdbIcon,
    mdbCardImage,
    mdbCardTitle,
    mdbCardText,
    mdbTestimonial,
    mdbView,
    mdbMask
  },
  props: {
    artist: {
      type: Object,
      avatarUrl: require("@/assets/img/faces/avatar.jpg"),
    }
  },
  computed: {
    artistUrl () {
      return '/artists/' + this.artist.username
    },
    avatar () {
      if (this.artist.avatarUrl) {
        return this.artist.avatarUrl;
      }
      return require("@/assets/img/faces/avatar.jpg");
    }
  }
}
</script>
<style scoped>
  .subtitle,
  .card-body p {
    color: #000!important;
  }
</style>
