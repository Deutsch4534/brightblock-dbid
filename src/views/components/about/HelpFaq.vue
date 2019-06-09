<template>
  <!-- TODO: connect template with Prismic cms -->
  <mdb-container fluid class=" ">
    <mdb-container class="bg-white mt-5 p-3">
      <h3 class="h3-responsive mb-5">{{title}}</h3>
      <mdb-row>
        <mdb-col col="3">
          <div v-for="(topic, index) of topics" :key="index">
            <h6><a :id="'toggle' + index"  @click="switcher(index)"><small>{{topic.data.title[0].text}}</small></a></h6>
          </div>
        </mdb-col>
        <mdb-col col="9" v-if="topics" >
          <help-faq-item :id="'topic' + index" :style="(index === 0) ? 'display:block' : 'display:none'" v-for="(topic, index) of topics" :key="index" :topic="topic"/>
        </mdb-col>
      </mdb-row>
  </mdb-container>
</mdb-container>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';
  import HelpFaqItem from "./HelpFaqItem";

  export default {
    components: {
      HelpFaqItem,
      mdbContainer,
      mdbRow,
      mdbCol
    },
    name: "about",
    data () {
      return {
        title: "",
        description: "",
        topicIds: [],
        topics: [],
        showTopic: [],
        counter: -1
      }
    },
    created() {
      let $self = this;
      this.$prismic.client.getSingle("help-list").then(prisdoc => {
        $self.title = prisdoc.data.title[0].text;
        let counter = 0;
        $self.description = prisdoc.data.description[0].text;
        _.forEach(prisdoc.data["help-items"], function(item) {
          let topic = item["help-item"];
          $self.showTopic[counter] = (counter < 1);
          counter++;
          if (topic && topic.id) {
            $self.topicIds.push(topic.id);
          }
        });
        $self.$prismic.client.getByIDs($self.topicIds).then(function(response) {
            $self.topics = response.results;
            let $ele = document.getElementById("topic0");
            if ($ele) $ele.style.display = "block";
        });
      });
    },
    methods: {
      switcher: function(index) {
        for (var key in this.showTopic) {
          document.getElementById("topic" + key).style.display = "none";
        }
        let $ele = document.getElementById("topic" + index);
        $ele.style.display = "block";
      },
      nextIndex() {
        //this.listIndex++;
        //return this.listIndex;
      },
    },
    computed: {
      thisIndex() {
        return this.listIndex;
      }
    },
  }
</script>
