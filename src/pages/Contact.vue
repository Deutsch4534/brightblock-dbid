<template>
<div id="my-app-element" class="bg-main container-fluid pt-5 mb-5" v-if="loaded">
  <contact-section class="bg-card"/>
</div>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';
import ContactSection from "./components/help/ContactSection";

export default {
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    ContactSection
  },
  name: "Contact",
  data() {
    return {
      loaded: false
    };
  },
  mounted() {
    let content = this.$store.state.contentStore.content["main-content"];
    if (!content) {
      this.$prismic.client.getSingle("main-content").then(document => {
        this.$store.commit("contentStore/mainContent", document.data);
      });
    }
    this.loaded = true;
  }
};
</script>

<style>
.contact-section >>> p { color: #EFF1F2; }
</style>
