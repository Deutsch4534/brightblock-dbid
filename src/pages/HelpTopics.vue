<template>
<div id="my-app-element" class="container-fluid pt-3">
  <div class="d-flex justify-content-center" role="status" v-if="loading">
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <div class="bg-card bg-spinner mx-5 p-4" v-else>
    <div id="aboutButtons">
      <about-buttons :answers="answers" @showAnswer="showAnswer"/>
    </div>
    <div id="aboutButtons" class="mt-4">
      <help-topic :answer="answer"/>
    </div>
  </div>
</div>
</template>

<script>
  import HelpArticle from "./components/help/HelpArticle";
  import HelpFaq from "./components/help/HelpFaq";
  import AboutSection from "./components/help/AboutSection";
  import AboutButtons from "./components/help/AboutButtons";
  import HelpTopic from "./components/help/HelpTopic";
  import _ from "lodash";

  export default {
    components: {
      HelpTopic,
      AboutSection,
      AboutButtons,
      HelpArticle,
      HelpFaq,
    },
    name: "HelpTopics",
    data () {
      return {
        answers: null,
        answer: null,
        loading: true,
        aboutContent: null
      }
    },
    watch: {
      '$route' (to, from) {
        this.loading = true;
        this.doMount();
      }
    },
    mounted() {
      this.doMount();
    },
    computed: {
    },
    methods: {
      showAnswer(data) {
        let url = "/help/topics/" + data.question;
        this.$router.push(url);
      },
      doMount() {
        let slug = this.$route.params.topicId;
        this.aboutContent = this.$store.state.contentStore.content["help-list"];
        if (!this.aboutContent) {
          this.$prismic.client.getSingle("help-list").then(document => {
            this.$store.commit("contentStore/helpList", document.data);
            this.aboutContent = this.$store.state.contentStore.content["help-list"];
            let topicIds = this.getTopicIds(document);
            let $self = this;
            this.$prismic.client.getByIDs(topicIds).then(function(response) {
              $self.setAnswers($self, response, topicIds);
              $self.setAnswer(slug);
            });
          });
        } else {
          this.setAnswer(slug);
        }
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
      setAnswer (slug) {
        this.answers = this.$store.state.contentStore.content["answers"];
        if (!slug) {
          this.answer = this.answers[0].topic;
          this.loading = false;
        } else {
          let selec = _.find(this.answers, function(ans) {
            return slug.indexOf(ans.slug) > -1;
          })
          this.answer = selec.topic;
          this.loading = false;
        }
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
