<template>
<div id="my-app-element" v-if="loaded">
  <!-- Contact section  -->
  <mdb-container fluid class="bg-main">
    <mdb-container class="text-light contact-section">
      <news-section class="text-light"/>
    </mdb-container>
  </mdb-container>
</div>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';
import NewsSection from "./components/splash/NewsSection";

export default {
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    NewsSection
  },
  name: "NewsSignup",
  data() {
    return {
      loaded: false
    };
  },
  mounted() {
    this.$prismic.client.getSingle("index-page").then(document => {
      this.$store.commit("contentStore/indexPage", document.data);
      let content = this.$store.state.contentStore.content["index-page"];
      this.loaded = true;
    });
  }
};
</script>

<style>
.contact-section >>> p { color: #EFF1F2; }
</style>
