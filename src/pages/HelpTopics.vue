<template>
<div id="my-app-element" class="bg-main container-fluid pt-5">
  <div class="d-flex justify-content-center" v-if="loading">
    <mdb-spinner big multicolor />
  </div>
  <div v-else>
    <!--
    <div id="aboutSection">
      <about-section :aboutContent="aboutContent" :showAll="false"/>
    </div>
    -->
    <div id="aboutButtons" class="p-5">
      <about-buttons :answers="answers" @showAnswer="showAnswer"/>
    </div>
  </div>
</div>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';
  import { mdbSpinner } from 'mdbvue';
  import HelpArticle from "./components/help/HelpArticle";
  import HelpFaq from "./components/help/HelpFaq";
  import AboutSection from "./components/help/AboutSection";
  import AboutButtons from "./components/help/AboutButtons";

  export default {
    components: {
      AboutSection,
      AboutButtons,
      HelpArticle,
      HelpFaq,
      mdbContainer,
      mdbRow,
      mdbCol, mdbSpinner
    },
    name: "HelpTopics",
    data () {
      return {
        answers: null,
        loading: true,
        aboutContent: null
      }
    },
    mounted() {
      this.aboutContent = this.$store.state.contentStore.content["help-list"];
      if (!this.aboutContent) {
        this.$prismic.client.getSingle("help-list").then(document => {
          this.$store.commit("contentStore/helpList", document.data);
          this.aboutContent = this.$store.state.contentStore.content["help-list"];
          let topicIds = this.getTopicIds(document);
          let $self = this;
          this.$prismic.client.getByIDs(topicIds).then(function(response) {
            $self.setAnswers($self, response, topicIds);
          });
        });
      } else {
        this.answers = this.$store.state.contentStore.content["answers"];
        this.answer = this.answers[0].topic;
        this.loading = false;
      }
    },
    computed: {
    },
    methods: {
      showAnswer(data) {
        let url = "/help/topic/" + data.question;
        this.$router.push(url);
      },
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
      setAnswers ($self, response, topicIds) {
        let topics = [];
        _.forEach(response.results, function(res) {
          _.forEach(topicIds, function(topicId) {
            if (topicId === res.id) {
              if (res.slugs[0] === $self.topicSlug) {
                $self.answer = res;
              }
            }
          });
          topics.push({slug: res.slugs[0], id: res.id, topic: res});
        });
        $self.$store.commit("contentStore/answers", topics);
        $self.answers = topics;
        $self.loading = false;
      }
    }
  }
</script>
