<template>
  <div class="intro-section">
    <!-- Full Page Intro https://mdbootstrap.com/img/Photos/Others/img%20%2848%29.jpg -->
    <div class="view" :style="headerStyle">
      <div class="">
        <div class="row">
          <div class="col-md-12 mb-4 mt-5 white-text text-left">
            <h1 class="tagline m-5 text-center fadeInDown" data-wow-delay="0.4s" v-html="tagline"></h1>
          </div>
        </div>
      </div>
      <div class="row mx-5">
        <div class="col-md-4" v-html="cardDescription1">
        </div>
        <div class="col-md-4" v-html="cardDescription2">
        </div>
        <div class="col-md-4" v-html="cardDescription3">
        </div>
      </div>
    </div>
    <!-- Full Page Intro -->
  </div>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol, mdbView, mdbMask } from 'mdbvue';
  import Navbar from '../../../layout/Navbar';

  export default {
    name: 'IntroSection',
    data() {
      return {
        tagline: null,
        taglink: null,
        backgroundUrl: null,
        strapline: null,
        cardDescription1: null,
        cardDescription2: null,
        cardDescription3: null,
      };
    },
    components: {
      mdbContainer,
      mdbRow,
      mdbCol,
      mdbView,
      mdbMask,
      Navbar
    },
    mounted() {
      let content = this.$store.state.contentStore.content["index-page"];
      this.tagline = content["navbar-tagline"][0].text;
      this.strapline = content["navbar-strapline"][0].text;
      this.taglink = content["navbar-taglink"][0].text;
      this.backgroundUrl = content["navbar-background"].url;
      this.tagline = content["section-whofor-title"][0].text;
      this.cardDescription1 = content["section-whofor1"][0].text;
      this.cardDescription2 = content["section-whofor2"][0].text;
      this.cardDescription3 = content["section-whofor3"][0].text;
    },
    computed: {
      headerStyle() {
        let content = this.$store.state.contentStore.content["index-page"];
        return {
          "margin-top": "0px",
          "background-repeat": "no-repeat",
          "background-size": "cover",
          "background-color": "#4EAC9A",
          "background-image": `url(${content["navbar-background"].url})`,
          "background-position": "center center",
        };
      },
      getAuctionLink() {
        let content = this.$store.state.contentStore.content["index-page"];
        return content["navbar-taglink"][0].text;
      }
    },
    methods: {}
  }
</script>
<style scoped>

  h1.tagline {
    /* font-family: 'Noto Serif Disp ExtCond'; */
    font-size: 3.0em;
    font-weight: 900;
    padding-top: 50px;
  }
  @media (max-width: 576px) {
    h1.tagline {
      font-size: 2.0em;
    }
  }
.intro-section {
  font-weight: 900;

}
  .intro-title {
    min-height: 65px;
    font-size: 0.9em;
    font-weight: 900;
  }

  .intro-title  {
    min-height: 65px;
    font-size: 0.9em;
    font-weight: 900;
  }

  .intro-title a {
    color: initial;
    text-decoration: underline;
  }

  .view {
    /* background-image: url('https://mdbootstrap.com/img/Photos/Others/architecture.jpg'); */
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    display: flex;
    opacity: 1;
    justify-content: space-between;
    flex-direction: column;
    min-height: 40vh;
  }

  @media (max-width: 576px) {
    .jarallax {
    }
  }
</style>
