<template>
  <div class="container">
    <div class="d-flex flex-wrap justify-content-between">
      <div class="" v-for="(ans, index) in answers" :key="index">
        <span><a class="btn btn-sm text-nowrap btn-rounded" :class="btnColor()" style="min-width: 180px;" @click="showAnswer(ans.slug, index)">{{ans.slug.split("-").join(" ")}}</a></span>
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
        //colors: ["indigo lighten-3", "light-blue accent-3", "pink lighten-5", "teal lighten-3", "orange accent-2", "yellow lighten-4", "purple lighten-2"]
        colors: ["primary", "success", "danger", "warning", "info", "default", "secondary"]
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
      },
      btnColor() {
        //let def = "btn-outline-primary";
        let index = Math.floor(Math.random() * Math.floor(7));
        return "btn-outline-" + this.colors[index];
      }
    }
  }
</script>
<style scoped>
</style>
