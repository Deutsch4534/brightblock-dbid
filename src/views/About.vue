<template>
  <mdb-container id="my-app-element" fluid class="m-0 p-0" v-if="loaded">
    <div id="aboutSection">
      <about-section :aboutContent="aboutContent" :showAll="true"/>
    </div>
    <div id="aboutButtons" class="m-5">
      <about-buttons :answers="answers" @showAnswer="showAnswer"/>
    </div>
</mdb-container>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';
  import HelpArticle from "./components/about/HelpArticle";
  import HelpFaq from "./components/about/HelpFaq";
  import AboutSection from "./components/splash/AboutSection";
  import AboutButtons from "./components/splash/AboutButtons";

  export default {
    components: {
      AboutSection,
      AboutButtons,
      HelpArticle,
      HelpFaq,
      mdbContainer,
      mdbRow,
      mdbCol
    },
    name: "about",
    data () {
      return {
        answers: null,
        loaded: false,
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
        this.loaded = true;
      }
    },
    computed: {
    },
    methods: {
      showAnswer(data) {
        let url = "/topic/" + data.question;
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
        $self.loaded = true;
      }
    }
  }
</script>
