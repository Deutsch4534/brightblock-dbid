<template>
<div class="row text-center" v-if="showAll">
  <div class="col-md-6 offset-md-3 col-sm-12 ">
    <h4 class="about2" v-html="about2"></h4>
  </div>
</div>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol, mdbView, mdbMask } from 'mdbvue';

  export default {
    name: 'AboutSection',
    props: ["aboutContent", "showAll"],
    data() {
      return {
        about1: "Since this is a paradigm shift in how the internet of the future will work it takes some time to understand what is going on here. Learn more...",
        about2: "We have built a platform that will change the way art is both traded and collected.",
      };
    },
    components: {
      mdbContainer,
      mdbRow,
      mdbCol,
      mdbView,
      mdbMask,
    },
    mounted() {
      this.about1 = this.aboutContent["about1"][0].text;
      this.about2 = this.aboutContent["about2"][0].text;
    },
    computed: {
      headerStyle() {
        let aboutContent = this.$store.state.contentStore.content["help-list"];
        return {
          "margin-top": "0px",
          "background-repeat": "no-repeat",
          "background-size": "cover",
          "background-color": "#4EAC9A",
          "background-image": `url(${aboutContent["help-background"].url})`,
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

.about1 {
  /* font-family: 'Noto Serif Disp ExtCond'; */
  font-size: 2.5rem;
  font-weight: 900;
}
@media (max-width: 990px) {
  .about1 {
    font-size: 1.5rem;
  }
}
.about2 {
  /* font-family: 'Noto Serif Disp ExtCond'; */
  font-size: 1.1rem;
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
    min-height: 40vh;

  }

  .mask {
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
  }

</style>
