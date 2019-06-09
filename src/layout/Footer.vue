<template>
<!-- Footer -->
  <footer class="container text-black page-footer pb-5 mb-5">
      <mdb-row class="d-flex flex-row text-center align-items-center px-3">
        <mdb-col col="12" class="mb-3">
          <span class=""><router-link to="/about">How It Works</router-link></span>
          <br/>
          <span class=""><router-link to="/contact">Contact</router-link></span>
          <br/>
          <span class=""><router-link to="/news-signup">News</router-link></span>
        </mdb-col>
        <!--
        <mdb-col col="12" class="my-5">
          <span class=""><router-link to="/topic/terms">Terms of Service</router-link></span>
          <br/>
          <span class=""><router-link to="/topic/privacy">Privacy Policy</router-link></span>
        </mdb-col>
        -->
        <mdb-col col="12">
          <span class="">Connect</span>
          <br/>
          <span class="mr-3"><a href="https://medium.com/@radicleart" target="_blank" rel="noreferrer"><mdb-icon fab icon="medium" /></a></span>
          <span class="mx-5"><a href="https://twitter.com/radicleart" target="_blank" rel="noreferrer"><mdb-icon fab icon="twitter" /></a></span>
          <span class="mr-3"><a href="https://github.com/radicleart/brightblock-oam" target="_blank" rel="noreferrer"><mdb-icon fab icon="github" /></a></span>
            <!--
            <span class="mr-3"><a href="https://www.facebook.com/radicleart" target="_blank" rel="noreferrer"><mdb-icon fab icon="facebook" /></a></span>
            <span class="mr-3"><a href="https://www.instagram.com/radicleart/" target="_blank" rel="noreferrer"><mdb-icon fab icon="instagram" /></a></span>
            <span><router-link to="/index">HOW IT WORKS</router-link></span>
            -->
          </div>
        </mdb-col>
      </mdb-row>
  </footer>
  <!-- Footer -->
</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbIcon } from 'mdbvue';

export default {
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbIcon
  },
  props: {
    backgroundColor: String,
    type: String
  },
  data() {
    return {
      year: new Date().getFullYear(),
      logo: require("@/assets/img/logo/logo_white.png")
    };
  },
  methods: {
    scrollToElement(element, event) {
      let element_id = document.getElementById(element);
      if (element_id) {
        if (element_id.id === 'introSection'){
          element_id.scrollIntoView({ block: "end", behavior: "smooth" });
        } else {
          element_id.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      }
    }
  }
};
</script>
<style scoped>
  .page-footer { min-height: 56px; }

  .page-footer {
    font-size: 2.0em;
    font-weight: 400;
    letter-spacing: 0.5px;
    margin-top: 20px;
    padding-top: 20px;
    color: black;
  }

  @media (max-width: 576px) {
    .page-footer { font-size: 0.8em; margin-top: 20px; padding: 0px;}
  }
</style>
