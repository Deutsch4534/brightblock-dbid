<template>
<div class="article-figure overlay view">
  <router-link class="" :to="buyNowUrl">
    <img :src="artwork.image" alt="help me" class="article-figure" v-if="isImage">
    <media-container :mediaObject="artwork.artwork" class="article-figure" :altText="artwork.title" v-else/>
    <div class="mask bg-dark">
      <div class="white-text" style="font-weight: 400">
        {{artwork.title}}
        <br/><span class="small">by: {{shortName(artwork.artist)}}</span>
        <selling-options-for-search :artwork="artwork"/>
        <a @click.prevent="heartThis" :class="hearted ? 'text-danger' : ''"><mdb-icon far icon="heart"/></a>
      </div>
    </div>
  </router-link>
</div>


<!--
<router-link class="grid-item" :to="buyNowUrl">
  <mdb-view>
    <mdb-card-image :src="artwork.image" :alt="artwork.title" style="height: auto;"></mdb-card-image>
    <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
  </mdb-view>
</router-link>
  <mdb-card class="bg-transparent mb-4 w-100">
    <mdb-card-body class="px-0">
      <router-link :to="buyNowUrl">
        <mdb-card-title class="h2-responsive subtitle">{{artwork.title}}</mdb-card-title>
      </router-link>
      <mdb-card-text>
        <span class="small">by: {{shortName(artwork.artist)}}</span>
        <selling-options-for-search :artwork="artwork"/>
      </mdb-card-text>
      <mdb-card-text v-if="debugMode">of: {{shortName(artwork.owner)}}</mdb-card-text>
    </mdb-card-body>
  </mdb-card>
-->
</template>

<script>
import SellingOptionsForSearch from "./SellingOptionsForSearch";
import { mdbIcon, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbView, mdbMask } from 'mdbvue';
import MediaContainer from "@/views/components/utils/MediaContainer";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SingleResult",
  components: {
    MediaContainer,
    SellingOptionsForSearch,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbView,
    mdbMask,
    mdbIcon
  },
  props: {
    artwork: {
      type: Object,
      default() {
        return {};
      }
    },
    width: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      hearted: false
    };
  },
  methods: {
    shortName(bsname) {
      if (!bsname) {
        return "";
      }
      let user = this.$store.getters["userProfilesStore/getProfile"](bsname);
      if (user && user.name) {
        return user.name;
      }
      return bsname.split(".")[0];
    },
    heartThis() {
      this.hearted = !this.hearted;
      console.log("how social?");
    }
  },
  computed: {
    debugMode() {
      return this.$store.state.constants.debugMode;
    },
    isImage: function() {
      try {
        return this.artwork.artwork[0].type.indexOf("image/cover") === -1;
      } catch (e) {
        return true;
      }
    },
    buyNowUrl() {
      return `/artworks/${this.artwork.id}`;
    },
  }
};
</script>
<style scoped>
.article-figure {
  display: flex;
  height: 25vh;
  width: auto;
  margin: 0 5px 30px 5px;
  font-size: 0.8rem;
}

.mask {
  padding: 20px;
}

.mask:hover {
  opacity: 0.75;
}

.subtitle {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.subtitle,
.card-body p {
  color: white!important;
}
</style>
