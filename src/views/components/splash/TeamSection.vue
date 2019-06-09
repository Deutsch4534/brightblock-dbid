<template>
  <!--<mdb-container>-->
  <section id="TeamSection" class="py-5">
    <mdb-row class="py-3 py-md-5 d-flex">
      <mdb-col col="12">
        <h2 class="large-title text-left mb-5">{{title}}</h2>
      </mdb-col>
      <mdb-card v-if="profiles" class="bg-transparent w-100 col-sm-6 col-md-4 col-lg-3 mb-3 d-flex" v-for="(profile, index) in profiles"
                :key="index">
          <router-link :to="profileUrl(profile)">
            <mdb-view hover>
            <mdb-card-image :src="profile.data.avatar.url" alt="Thumbnail Image" class="img-square"></mdb-card-image>
              <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
            </mdb-view>
          </router-link>
        <mdb-card-body class="px-0">
          <mdb-card-title class="artist-name h4-responsive">
            <router-link :to="profileUrl(profile)">
              <p class="mb-1 text-uppercase">{{profile.data.name[0].text}}</p>
            </router-link>
            <p class="mb-1">{{profile.data.jobtitle[0].text}}</p>
          </mdb-card-title>
        </mdb-card-body>
      </mdb-card>
    </mdb-row>
  </section>
  <!--</mdb-container>-->
</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbAvatar, mdbIcon, mdbCard, mdbCardBody, mdbCardImage, mdbCardTitle, mdbCardText, mdbView, mdbMask } from 'mdbvue';

export default {
  name: 'TeamSection',
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbAvatar,
    mdbIcon,
    mdbCard,
    mdbCardBody,
    mdbCardImage,
    mdbCardTitle,
    mdbCardText,
    mdbView,
    mdbMask
  },
  data() {
    return {
      profiles: [],
      title: null,
      description: '',
      showContent: false
    };
  },
  created() {
    this.getContent();
  },
  methods: {
    getContent() {
      let $self = this;
      this.$prismic.client
        .query(this.$prismic.Predicates.at("document.type", "mini_profile"), {
          orderings: "[my.mini_profile.name desc]"
        })
        .then(function(response) {
          let tmpProfiles = response.results;
          $self.showContent = true;
          $self.profiles = [{},{},{}];
          _.forEach(tmpProfiles, function(prof) {
            $self.$store.commit("userProfilesStore/addTeamProfile", prof);
            if (prof.data.name[0].text.indexOf("Cohen") > -1) {
              $self.profiles.splice(2, 1, prof);
            } else if (prof.data.name[0].text.indexOf("Meic") > -1) {
              $self.profiles.splice(0, 1, prof);
            } else {
              $self.profiles.splice(1, 1, prof);
            }
        });
          // "twitter=https://twitter.com/mjoecohen,github=https://github.com/mjoecohen,facebook=https://www.facebook.com/mjoecohen"
        });
      this.$prismic.client.getSingle("profile").then(document => {
        this.title = document.data.title[0].text;
      });
    },
    profileUrl(profile) {
      return `/profile/team/${profile.id}`;
    }
  }
};
</script>
<style scoped>
  .description { font-size: 90%; }
</style>
