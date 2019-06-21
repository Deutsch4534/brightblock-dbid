<template>
<div class="mdb-lightbox" v-if="isImage">
  <mdb-carousel showControls :interval="false" showIndicators> <!-- :interval="1000"  -->
    <mdb-carousel-item img v-for="(image, index) in item.images" :key="index" :src="image.dataUrl" mask="light" :alt="item.title">
      <a @click.prevent="show(0)"><mdb-carousel-caption :text="item.title"></mdb-carousel-caption></a>
    </mdb-carousel-item>
  </mdb-carousel>
  <mdb-lightbox
    :visible="visible"
    :imgs="images"
    :index="index"
  @hide="handleHide"></mdb-lightbox>
</div>
<div class="view overlay z-depth-1-half" style="max-width: 500px;" v-else>
  <media-container :mediaObject="item.images" :altText="item.title" class="inline-block"/>
</div>
</template>

<script>
import moment from "moment";
import { mdbLightbox, mdbCarousel, mdbCarouselItem, mdbCarouselCaption } from 'mdbvue';
import MediaContainer from "@/views/components/utils/MediaContainer";

export default {
  name: "ItemImageListView",
  components: {
    MediaContainer,
    mdbCarouselItem,
    mdbCarousel,
    mdbCarouselCaption,
    mdbLightbox
  },
  props: {
    item: null,
  },
  data() {
    return {
      current: 0,
      visible: false,
      index: 0,
    };
  },
  mounted() {},
  methods: {
    show(index) {
      this.index = index;
      this.visible = true;
    },
    handleHide() {
      this.visible = false;
    }
  },
  computed: {
    getImage: function() {
      try {
        return this.item.images[0].dataUrl;
      } catch (e) {
        return;
      }
    },
    images() {
      let images = [];
      images.push(this.item.images[0].dataUrl);
      return images;
    },
    isImage: function() {
      try {
        return this.item.images[0].type.indexOf("image") > -1;
      } catch (e) {
        return true;
      }
    }
  }
};
</script>
<style scoped>
</style>
