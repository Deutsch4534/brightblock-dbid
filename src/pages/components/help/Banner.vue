<template>
<div class="container-fluid bg-light" v-if="!loading">
  <div>
    <div class="d-flex flex-fill justify-content-between banner1">
      <div class="text-muted" :style="banner1Style">
        <mdb-multi-carousel :interval="5000" hideIndicators slide>
          <template>
            <mdb-carousel-item>
              <mdb-row class="carousel__item">
                <div class="d-none d-sm-block mt-2  ml-5" style="font-size: 2.0rem; font-weight: 900; min-height: 150px; position:relative; left: 0px;" v-html="bannerScroll1"></div>
              </mdb-row>
            </mdb-carousel-item>
            <mdb-carousel-item>
              <mdb-row class="carousel__item">
                <div class="d-none d-sm-block mt-2  ml-5" style="font-size: 2.0rem; font-weight: 900; min-height: 150px; position:relative; left: 0px;" v-html="bannerScroll2"></div>
              </mdb-row>
            </mdb-carousel-item>
            <mdb-carousel-item>
              <mdb-row class="carousel__item">
                <div class="d-none d-sm-block mt-2  ml-5" style="font-size: 2.0rem; font-weight: 900; min-height: 150px; position:relative; left: 0px;" v-html="bannerScroll3"></div>
              </mdb-row>
            </mdb-carousel-item>
          </template>
          <template v-slot:mobile>
            <mdb-carousel-item>
              <mdb-row class="carousel__item">
                <div class="mt-2  ml-3" v-html="bannerScroll1"></div>
              </mdb-row>
            </mdb-carousel-item>
            <mdb-carousel-item>
              <mdb-row class="carousel__item">
                <div class="mt-2  ml-3" v-html="bannerScroll2"></div>
              </mdb-row>
            </mdb-carousel-item>
            <mdb-carousel-item>
              <mdb-row class="carousel__item">
                <div class="mt-2  ml-3" v-html="bannerScroll3"></div>
              </mdb-row>
            </mdb-carousel-item>
          </template>
        </mdb-multi-carousel>
      </div>
      <div class="" :style="banner2Style" style="position:relative; right: 0px; bottom: 0px;">
        <div class="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </div>
    </div>
  </div>

  <div class="d-none d-sm-block py-2" style="background-color: #37474f;">
    <div class="row">
      <div class="col-sm-6 text-center">
        <!-- <button class="btn btn-rounded banner-text3"><span class="mr-3 banner-text3a"><a href="/sell">Get Started</a></span> <i class="fas fa-long-arrow-alt-right fa-2x text-light"></i></button> -->
        <a href="https://www.producthunt.com/posts/dbid-2?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-dbid-2" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=159460&theme=light" alt="dBid - Turn unused stuff into Bitcoin | Product Hunt Embed" style="width: 250px; height: 54px;" width="250px" height="54px" /></a>
      </div>
      <div class="col-sm-6 text-center">
        <div class="d-flex banner-text3b ">Earn your own Bitcoin!</div>
      </div>
    </div>
  </div>
  <div class="d-block d-sm-none py-2" style="background-color: #37474f;">
    <div class="text-center">
      <a href="https://www.producthunt.com/posts/dbid-2?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-dbid-2" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=159460&theme=dark" alt="dBid - Turn unused stuff into Bitcoin | Product Hunt Embed" style="width: 250px; height: 54px;" width="250px" height="54px" /></a>
    </div>
    <div class="text-center banner-text3b ">Earn your own Bitcoin!</div>
  </div>

  <div>
    <div class="pl-3 pr-0 py-0 bg-banner3 text-dark">
      <div class="d-flex justify-content-center" v-html="bannerPart4">
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mdbMultiCarousel, mdbCarouselItem, mdbContainer, mdbRow, mdbCol, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from 'mdbvue';
  export default {
    name: 'AboutButtons',
    props: ["answers"],
    data() {
      return {
        banner1: require("@/assets/img/banner/banner_top_left.png"),
        banner2: require("@/assets/img/banner/banner_bottom_right.png"),
        banner3: require("@/assets/img/banner/flatened_banner.jpg"),
        loading: true,
      };
    },
    components: {
      mdbMultiCarousel, mdbCarouselItem, mdbContainer, mdbRow, mdbCol, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn
    },
    mounted() {
      let content = this.$store.state.contentStore.content["main-content"];
      if (!content) {
        this.$prismic.client.getSingle("main-content").then(document => {
          this.$store.commit("contentStore/mainContent", document.data);
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    },
    computed: {
      banner1Style() {
        let content = this.$store.getters["contentStore/getMainContent"];
        if (!content) {
          return;
        }
        let imageUrl = content["banner-part1"].url;
        return {
          "margin-top": "0px",
          "background-repeat": "no-repeat",
          "background-size": "225px",
          "background-image": `url(${imageUrl})`,
          "background-position": "top left",
        };
      },
      banner2Style() {
        let content = this.$store.getters["contentStore/getMainContent"];
        if (!content) {
          return;
        }
        let imageUrl = content["banner-part2"].url;
        return {
          "margin-top": "0px",
          "height": "auto",
          "min-width": "195px;",
          "background-repeat": "no-repeat",
          "background-image": `url(${imageUrl})`,
          "background-position": "bottom right",
        };
      },
      bannerScroll1() {
        let content = this.$store.getters["contentStore/getMainContent"];
        if (content) {
          return content["banner-scroll-text1"][0].text;
        }
      },
      bannerScroll2() {
        let content = this.$store.getters["contentStore/getMainContent"];
        if (content) {
          return content["banner-scroll-text2"][0].text;
        }
      },
      bannerScroll3() {
        let content = this.$store.getters["contentStore/getMainContent"];
        if (content) {
          return content["banner-scroll-text3"][0].text;
        }
      },
      bannerPart1() {
        let content = this.$store.getters["contentStore/getMainContent"];
        if (content) {
          return content["banner-text-part1"][0].text;
        } else {
          return "Lorum ipsum";
        }
      },
      bannerPart2() {
        let content = this.$store.getters["contentStore/getMainContent"];
        if (content) {
          return content["banner-text-part2"][0].text;
        } else {
          return "Lorum ipsum";
        }
      },
      bannerPart3() {
        let content = this.$store.getters["contentStore/getMainContent"];
        if (content) {
          return content["banner-text-part3"][0].text;
        } else {
          return "Lorum ipsum";
        }
      },
      bannerPart4() {
        let content = this.$store.getters["contentStore/getMainContent"];
        if (content) {
          return content["banner-text-part4"][0].text;
        } else {
          return "Lorum ipsum";
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
.banner-scroll-header {
  margin-top: 10px;
}
.banner-scroll-text {

}
.controls-top {
  display: none!important;
}
.carousel__item {
  padding: 10px;
}
.banner-text1 {
  letter-spacing: 0.3rem;
}
.banner-parar {
  margin-top: -9px;
}
.banner-text3 {
  text-transform: uppercase;
  font-weight: 900;
  border-radius: 40px;
  background-color: #ff6e40;
  color: #ffffff;
  padding: 5px 20px;
}
.banner-text3a {
  position: relative;
  top: -5px;
}
.banner-text3b {
  color: #fdd835;
  font-size: 2.1rem;
  font-weight: 900;
}
.prodhunt {
  width: 250px;
  height: 54px;
}
</style>
