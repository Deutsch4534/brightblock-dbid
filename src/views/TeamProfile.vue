<template>
<mdb-container>
  <section class="text-center my-5 mt-5 pt-5" :key="forceRender">
    <mdb-row class="text-center">
      <mdb-col>
        <mdb-testimonial>
          <mdb-avatar class="mx-auto mb-4">
            <img :src="profile.data.avatar.url" class="rounded-circle img-fluid" alt="First sample avatar image" width="200px"/>
          </mdb-avatar>
          <p class="mt-3 mx-5">
            <mdb-icon icon="quote-left"></mdb-icon> <span v-html="profile.data.jobdescription[0].text"></span>
          </p>
          <h4 class="font-weight-bold">{{profile.data.name[0].text}}</h4>
          <h6 class="font-weight-bold my-3">{{profile.data.jobtitle[0].text}}</h6>
          <mdb-icon icon="star" class="blue-text"> </mdb-icon>
          <mdb-icon icon="star" class="blue-text"> </mdb-icon>
          <mdb-icon icon="star" class="blue-text"> </mdb-icon>
          <mdb-icon icon="star" class="blue-text"> </mdb-icon>
          <mdb-icon icon="star-half-alt" class="blue-text"> </mdb-icon>
        </mdb-testimonial>
      </mdb-col>
    </mdb-row>
  </section>
  <!--
  <section class="text-center my-5">
    <h2 class="h1-responsive font-weight-bold my-5">Our best projects</h2>
    <p class="grey-text w-responsive mx-auto mb-5">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit est laborum.</p>
    <mdb-row class="text-center">
      <mdb-col lg="4" md="12" class="mb-lg-0 mb-4">
        <mdb-view class="overlay rounded z-depth-1">
          <img src="https://mdbootstrap.com/img/Photos/Others/images/58.jpg" alt="sample photo" class="img-fluid"/>
          <a>
            <mdb-mask waves overlay="white-slight"/>
          </a>
        </mdb-view>
        <mdb-card-body class="pb-0">
          <h4 class="font-weight-bold my-3">Title of the news</h4>
          <p class="grey-text">Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae.</p>
          <mdb-btn class="btn-block teal lighten-1" size="sm"><mdb-icon icon="clone" class="left"/> View project</mdb-btn>
        </mdb-card-body>
      </mdb-col>
      <mdb-col lg="4" md="12" class="mb-lg-0 mb-4">
        <mdb-view class="overlay rounded z-depth-1">
          <img src="https://mdbootstrap.com/img/Photos/Others/project4.jpg" alt="sample photo" class="img-fluid"/>
          <a>
            <mdb-mask waves overlay="white-slight"/>
          </a>
        </mdb-view>
        <mdb-card-body class="pb-0">
          <h4 class="font-weight-bold my-3">Title of the news</h4>
          <p class="grey-text">Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae.</p>
          <mdb-btn class="btn teal lighten-1" size="sm"><mdb-icon icon="clone" class="left"/> View project</mdb-btn>
        </mdb-card-body>
      </mdb-col>
      <mdb-col lg="4" md="12" class="mb-lg-0 mb-4">
        <mdb-view class="overlay rounded z-depth-1">
          <img src="https://mdbootstrap.com/img/Photos/Others/images/88.jpg" alt="sample photo" class="img-fluid"/>
          <a>
            <mdb-mask waves overlay="white-slight"/>
          </a>
        </mdb-view>
        <mdb-card-body class="pb-0">
          <h4 class="font-weight-bold my-3">Title of the news</h4>
          <p class="grey-text">Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae.</p>
          <mdb-btn class="btn teal lighten-1" size="sm"><mdb-icon icon="clone" class="left"/> View project</mdb-btn>
        </mdb-card-body>
      </mdb-col>
    </mdb-row>
  </section>
  -->
</mdb-container>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbCard, mdbCardBody, mdbCardUp, mdbAvatar, mdbIcon, mdbCarousel, mdbCarouselItem, mdbTestimonial } from 'mdbvue';

// import { Tabs } from "@/components";
export default {
components: {
  mdbContainer,
  mdbRow,
  mdbCol,
  mdbCard,
  mdbCardBody,
  mdbCardUp,
  mdbAvatar,
  mdbIcon,
  mdbCarousel,
  mdbCarouselItem,
  mdbTestimonial
},
  bodyClass: "profile-page",
  data() {
    return {
      forceRender: null,
      profile: {
        data: {
          name: [{ text: "Unknown" }],
          jobtitle: [{ text: "Unknown" }],
          jobdescription: [{ text: "Unknown" }],
          avatar: {
            url: require("@/assets/img/faces/avatar.jpg")
          }
        }
      }
    };
  },
  props: {
    header: {
      type: String,
      default: require("@/assets/img/missing/artwork-missing.jpg")
    },
    img: {
      type: String,
      default: require("@/assets/img/faces/avatar.jpg")
    }
  },
  mounted() {
    this.profileId = this.$route.params.profileId;
    let profile = this.$store.getters["userProfilesStore/getTeamProfile"](
      this.profileId
    );
    let $self = this;
    this.$prismic.client.getByID(this.profileId).then(function(profile) {
      $self.$store.commit("userProfilesStore/addTeamProfile", profile);
      $self.profile = profile;
    });
  },
  computed: {}
};
</script>

<style scoped>
</style>
