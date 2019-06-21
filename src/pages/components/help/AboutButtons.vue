<template>
  <div class="container">
    <div class="row">
      <div class="col-md-4 text-center mb-3" v-for="(ans, index) in answers" :key="index">
        <button class="waves-light btn btn-lg btn-block ripple-parent btn-outline-white" @click="showAnswer(ans.slug, index)">{{ans.slug.split("-").join(" ")}}</button>
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
button {
  line-height: 40px;
  font-size: 1.2rem;
  white-space: nowrap;
  border-color: #333;
}
</style>
