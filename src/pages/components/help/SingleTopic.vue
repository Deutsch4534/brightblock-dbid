<template>
<mdb-row class="">
  <mdb-col sm="12">
    <h4 class="mb-4">{{answer.data.title[0].text}}</h4>
    <div v-for="(item, index) of answer.data.description" :key="index">
      <img class="img-fluid" v-if="item.type === 'image'" :src="item.url" alt="answer image"/>
      <div class="" v-else v-html="item.text"></div>
    </div>
  </mdb-col>
</mdb-row>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';

  export default {
    components: {
      mdbContainer,
      mdbRow,
      mdbCol
    },
    name: "SingleTopic",
    props: ["answer"],
    data() {
      return {
      };
    },
    mounted() {
      console.log(this.answer);
    },
    computed: {
    },
    methods: {
    },
  }
</script>
