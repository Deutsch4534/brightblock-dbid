<template>
<div id="my-app-element" v-if="loaded">
  <contact-section/>
</div>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';
import ContactSection from "./components/splash/ContactSection";

const STORE_NAMESPACE = 'landingPage/home';

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
    this.$prismic.client.getSingle("index-page").then(document => {
      this.$store.commit("contentStore/mainContent", document.data);
      let content = this.$store.state.contentStore.content["index-page"];
      this.loaded = true;
    });
  }
};
</script>

<style>
.contact-section >>> p { color: #EFF1F2; }
</style>
