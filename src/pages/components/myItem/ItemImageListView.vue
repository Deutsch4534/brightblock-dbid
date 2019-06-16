<template>
<div class="view overlay z-depth-1-half" style="max-width: 500px;">
  <img :src="getImage" :alt="item.title" v-if="isImage" class="img-fluid rounded">
  <a v-if="isImage"><div class="mask waves-effect waves-light"></div></a>
  <media-container :mediaObject="item.images" :altText="item.title" class="inline-block" v-else/>
</div>
</template>

<script>
import moment from "moment";

export default {
  name: "ItemImageListView",
  components: {
  },
  props: {
    item: null,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
  },
  computed: {
    getImage: function() {
      try {
        return this.item.images[0].dataUrl;
      } catch (e) {
        return;
      }
    },
    isImage: function() {
      try {
        return this.item.images[0].type.indexOf("image/cover") === -1;
      } catch (e) {
        return true;
      }
    }
  }
};
</script>
<style scoped>
  .subtitle,
  .card-body p {
    color: #000!important;
    font-size: 0.9em;
  }
</style>
