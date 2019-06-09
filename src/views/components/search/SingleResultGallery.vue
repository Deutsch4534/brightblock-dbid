<template>
<div class="article-figure overlay view">
    <img :src="coverImage" alt="help me" class="article-figure">
    <div class="mask bg-dark">
      <div class="white-text" style="font-weight: 400">
        {{gallery.title}}
        <br/><span class="small">by: {{shortName(gallery.owner)}}</span>
        <a @click.prevent="heartThis" :class="hearted ? 'text-danger' : ''"><mdb-icon far icon="heart"/></a>
      </div>
    </div>
</div>
</template>

<script>
import { mdbIcon, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbView, mdbMask } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SingleResultGallery",
  components: {
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
    gallery: {
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
      hearted: false,
      missingImage: require("@/assets/img/missing/artwork-missing.jpg")
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
    coverImage() {
      if (this.gallery.coverImage) {
        return this.gallery.coverImage.dataUrl;
      }
      return this.missingImage;
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
