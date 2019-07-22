<template>
  <!-- TODO: connect template with Prismic cms -->
  <mdb-container fluid class="">
    <mdb-container class="py-5">
      <mdb-row>
        <mdb-col col="12">
          <h1 class="h1-responsive py-4">{{title}}</h1>
        </mdb-col>
        <mdb-col sm="10" md="8">
          <p>{{description}}</p>
        </mdb-col>
      </mdb-row>
      <div v-for="(item, index) of body" :key="index">
        <p class="mb-3" v-if="item.type === 'paragraph'" v-html="item.text"></p>
        <h1 class="my-5" v-else-if="item.type === 'heading1'" v-html="item.text"></h1>
        <h2 class="my-5" v-else-if="item.type === 'heading2'" v-html="item.text"></h2>
        <h3 class="my-5" v-else-if="item.type === 'heading3'" v-html="item.text"></h3>
        <h4 class="my-5" v-else-if="item.type === 'heading4'" v-html="item.text"></h4>
        <h4 class="my-5" v-else-if="item.type === 'heading5'" v-html="item.text"></h4>
        <img class="my-5" v-else-if="item.type === 'image'" :src="item.url"/>
        <div class="ml-5" v-else-if="item.type === 'o-list-item'"><b class="pb-2">-</b> {{item.text}}</div>
      </div>
      <div>
        <p class="mb-3" v-html="body"></p>
      </div>


      <mdb-row v-for="(topic, index) of topics" :key="index">
        <mdb-col col="12">
          <h5>{{topic.data.title[0].text}}</h5>
          <p v-html="topic.data.description[0].text"></p>
        </mdb-col>
      </mdb-row>
  </mdb-container>
</mdb-container>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';

export default {
  components: {
    mdbContainer,
    mdbRow,
    mdbCol
  },
  name: "HelpArticle",
  data () {
    return {
      title: "",
      body: "",
      description: "",
      topicIds: [],
      topics: [],
      counter: -1
    }
  },
  mounted() {
    let pageid = this.$route.params.pageid;
    pageid = "help-page";
    let $self = this;
    this.$prismic.client.getSingle(pageid).then(document => {
      $self.title = document.data.title[0].text;
      $self.body = document.data.body;
      let found = false;
      _.forEach($self.body, function(item) {
        if (item.type !== 'o-list-item') {
          if (!found) $self.counter++;
        } else {
          found = true;
        }
      });
      _.forEach(document.data["help-items"], function(item) {
        $self.topicIds.push(item["help-item"].id);
      });
      /**
      _.forEach(document.data["help-items"], function(item) {
        $self.topicIds.push(item["help-item"].id);
      });
      $self.$prismic.client.getByIDs($self.topicIds).then(function(response) {
          $self.topics = response.results;
      });
      **/
    });
  },
  computed: {
    thisIndex() {
      return this.listIndex;
    }
  },
  methods: {
    nextIndex () {
      //this.listIndex++;
      //return this.listIndex;
    },
  },
}
</script>
