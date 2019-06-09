<template>
<mdb-container id="my-app-element" fluid class="m-0 p-0" v-if="loaded">
  <mdb-container class="mt-5" style="border-top: 1pt solid grey;">
    <div class="row mb-5">
      <div class="col-md-12 my-5">
        <router-link to="/about" class="teal-text" style="font-weight: 900;">Go Back</router-link>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-md-2 col-xs-12">
        <span class="teal-text mb-4">Help Topics</span>
        <ul class="list-unstyled mt-4">
          <li v-for="(ans, index) in answers" :key="index" class="mb-2" style="text-decoration: capitalise;"><a href="#" @click.prevent="slugUrl(ans.slug)">{{ans.slug.split("-").join(" ")}}</a></li>
        </ul>
      </div>
      <div class="col-md-10 col-xs-12" v-if="answer">
        <about-item :answer="answer"/>
      </div>
    </div>
  </mdb-container>
</mdb-container>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol, mdbView, mdbMask, mdbBtn } from 'mdbvue';
  import Navbar from '../../../layout/Navbar';
  import AboutItem from './AboutItem';
  import AboutSection from "./AboutSection";

  export default {
    name: 'AboutAnswer',
    data() {
      return {
        answer: null,
        answers: null,
        loaded: false,
      };
    },
    components: {
      AboutItem,
      AboutSection,
      mdbContainer,
      mdbRow,
      mdbCol,
      mdbView,
      mdbMask,
      mdbBtn,
      Navbar
    },
    mounted() {
      let slug = this.$route.params.topicId;
      this.answers = this.$store.state.contentStore.content["answers"];
      if (!this.answers) {
        let $self = this;
        this.$prismic.client.getSingle("help-list").then(document => {
          this.$store.commit("contentStore/helpList", document.data);
          let topicIds = this.getTopicIds(document);
          this.$prismic.client.getByIDs(topicIds).then(function(response) {
            let answers = $self.getAnswers($self, response.results);
            let index = _.findIndex(answers, function(o) {
              return o.slug === slug;
            });
            $self.answers = answers;
            $self.answer = answers[index];
            $self.$store.commit("contentStore/answers", answers);
            $self.loaded = true;
          });
        });
      } else {
        this.answers = this.$store.state.contentStore.content["answers"];
        let index = _.findIndex(this.answers, function(o) {
          return o.slug === slug;
        });
        this.answer = this.answers[index];
        this.loaded = true;
      }
    },
    computed: {
    },
    methods: {
      getTopicIds (pdoc) {
        let topicIds = [];
        _.forEach(pdoc.data["help-items"], function(item) {
          let topic = item["help-item"];
          if (topic && topic.id) {
            topicIds.push(topic.id);
          }
        });
        return topicIds;
      },
      getAnswers ($self, results) {
        let answers = [];
        _.forEach(results, function(res) {
          answers.push({slug: res.slugs[0], id: res.id, topic: res});
        });
        return answers;
      },
      slugUrl (slug) {
        // return `/topic/${slug}`;
        let index = _.findIndex(this.answers, function(o) {
          return o.slug === slug;
        });
        this.answer = this.answers[index];
        this.$router.push("/topic/" + slug);
      }
    }
  }
</script>
<style scoped>
</style>
