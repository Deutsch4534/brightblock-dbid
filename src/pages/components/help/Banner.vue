<template>
<div class="container-fluid" v-if="!loading">
  <div>
    <div class="d-flex flex-fill justify-content-between banner1">
      <div class="text-muted" :style="banner1Style">
        <!-- on xs -->
        <div class="d-block d-sm-none mt-5  ml-3" style="font-weight: 900; min-height: 150px; position:relative; left: 20px;" v-html="bannerPart1"></div>
        <!-- on sm -->
        <div class="d-none d-sm-block d-md-none mt-5  ml-5" style="font-size: 2.0rem; font-weight: 900; min-height: 150px; position:relative; left: 50px;" v-html="bannerPart1"></div>
        <!-- on md up -->
        <div class="d-none d-md-block mt-5  ml-5" style="font-size: 2.0rem; font-weight: 900; min-height: 150px; position:relative; left: 200px;" v-html="bannerPart1"></div>
      </div>
      <div class="d-none d-sm-block pr-5" :style="banner2Style">
        <div class="mt-5 mr-5" style="position:relative; right: 90px;" v-html="bannerPart2">
        </div>
      </div>
    </div>
  </div>
  <div>
    <div class="banner2 m-0 p-4" style="background-color: #37474f;">
      <div class="d-flex justify-content-around" v-html="bannerPart3">
      </div>
    </div>
  </div>
  <div>
    <div class="banner2 m-0 px-4 py-2 bg-light text-dark">
      <div class="d-flex justify-content-center  text-muted" v-html="bannerPart4">
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol, mdbView, mdbMask, mdbBtn } from 'mdbvue';

  export default {
    name: 'AboutButtons',
    props: ["answers"],
    data() {
      return {
        banner1: require("@/assets/img/banner/banner_top_left.png"),
        banner2: require("@/assets/img/banner/banner_bottom_right.png"),
        banner3: require("@/assets/img/banner/flatened_banner.jpg"),
        loading: true,
        content: null,
      };
    },
    components: {
      mdbContainer,
      mdbRow,
      mdbCol,
      mdbView,
      mdbMask,
      mdbBtn,
    },
    mounted() {
      let content = this.$store.state.contentStore.content["main-content"];
      if (!content) {
        this.$prismic.client.getSingle("main-content").then(document => {
          this.$store.commit("contentStore/mainContent", document.data);
          this.content = this.$store.state.contentStore.content["main-content"];
          this.loading = false;
        });
      } else {
        this.content = this.$store.state.contentStore.content["main-content"];
        this.loading = false;
      }
    },
    computed: {
      banner1Style() {
        let content = this.$store.state.contentStore.content["main-content"];
        if (content) {
          return {
            "margin-top": "0px",
            "background-repeat": "no-repeat",
            "background-size": "225px",
            "background-image": `url(${content["banner-part1"].url})`,
            "background-position": "top left",
          };
        }
      },
      banner2Style() {
        let content = this.$store.state.contentStore.content["main-content"];
        if (content) {
          return {
            "margin-top": "0px",
            "height": "225px",
            "width": "225px",
            "background-repeat": "no-repeat",
            "background-size": "200px",
            "background-image": `url(${content["banner-part2"].url})`,
            "background-position": "bottom right",
          };
        }
      },
      bannerPart1() {
        let content = this.$store.state.contentStore.content["main-content"];
        if (content) {
          return content["banner-text-part1"][0].text;
        }
      },
      bannerPart1() {
        let content = this.$store.state.contentStore.content["main-content"];
        if (content) {
          return content["banner-text-part1"][0].text;
        }
      },
      bannerPart2() {
        let content = this.$store.state.contentStore.content["main-content"];
        if (content) {
          return content["banner-text-part2"][0].text;
        }
      },
      bannerPart3() {
        let content = this.$store.state.contentStore.content["main-content"];
        if (content) {
          return content["banner-text-part3"][0].text;
        }
      },
      bannerPart4() {
        let content = this.$store.state.contentStore.content["main-content"];
        if (content) {
          return content["banner-text-part4"][0].text;
        }
      },
    },
    methods: {
      showAnswer (slug, index) {
        this.$emit("showAnswer", {index: index, question: slug});
      }
    }
  }
</script>
<style>
.banner-text1 {
  letter-spacing: 0.3rem;
}
.banner-text3 {
  text-transform: uppercase;
  font-weight: 900;
  border-radius: 40px;
  background-color: #fb8c00;
  color: #ffffff;
}
.banner-text3a {
  position: relative;
  top: -15px;
}
.banner-text3b {
  color: #fdd835;
  font-size: 2.1rem;
}
</style>
