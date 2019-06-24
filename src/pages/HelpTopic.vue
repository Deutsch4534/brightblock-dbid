<template>
<div id="my-app-element" class="bg-main container-fluid pt-5">
  <div class="container bg-card p-5 text-center" role="status" v-if="loading">
    <div class="container spinner-border text-center" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <div class="container" v-else>
    <div class="d-flex justify-content-end">
      <router-link to="/help/topics">Back</router-link>
    </div>
    <div class="row">
      <div class="col-md-2 col-xs-12">
        <span class="text-muted">Topics</span>
        <ul class="list-unstyled mt-4">
          <li v-for="(ans, index) in answers" :key="index" class="mb-2" style="text-decoration: capitalise;"><a href="#" @click.prevent="slugUrl(ans.slug)">{{ans.slug.split("-").join(" ")}}</a></li>
        </ul>
      </div>
      <div class="col-md-10 col-xs-12" v-if="answer">
        <single-topic :answer="answer"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol, mdbView, mdbMask, mdbBtn } from 'mdbvue';
  import SingleTopic from '@/pages/components/help/SingleTopic';
  import AboutSection from "@/pages/components/help/AboutSection";

  export default {
    name: 'AboutAnswer',
    data() {
      return {
        answer: null,
        answers: null,
        loading: true,
      };
    },
    components: {
      SingleTopic,
      AboutSection,
      mdbContainer,
      mdbRow,
      mdbCol,
      mdbView,
      mdbMask,
      mdbBtn,
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
            $self.loading = false;
          });
        });
      } else {
        this.answers = this.$store.state.contentStore.content["answers"];
        let index = _.findIndex(this.answers, function(o) {
          return o.slug === slug;
        });
        this.answer = this.answers[index];
        this.loading = false;
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
        // return `/help/topic/${slug}`;
        let index = _.findIndex(this.answers, function(o) {
          return o.slug === slug;
        });
        this.answer = this.answers[index];
        this.$router.push("/help/topic/" + slug);
      }
    }
  }
</script>
<style scoped>
</style>
