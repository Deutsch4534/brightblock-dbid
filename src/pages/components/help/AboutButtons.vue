<template>
  <div class="container">
    <div class="d-flex flex-wrap justify-content-between">
      <div class="" v-for="(ans, index) in answers" :key="index">
        <span><a class="btn btn-sm btn-primary btn-outline-primary text-nowrap" style="min-width: 180px;" @click="showAnswer(ans.slug, index)">{{ans.slug.split("-").join(" ")}}</a></span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol, mdbView, mdbMask, mdbBtn } from 'mdbvue';

  export default {
    name: 'AboutButtons',
    props: ["answers"],
    data() {
      return {
      };
    },
    components: {
      mdbContainer,
      mdbRow,
      mdbCol,
      mdbView,
      mdbMask,
      mdbBtn,
    },
    mounted() {
    },
    computed: {
    },
    methods: {
      showAnswer (slug, index) {
        this.$emit("showAnswer", {index: index, question: slug});
      }
    }
  }
</script>
<style scoped>
</style>
