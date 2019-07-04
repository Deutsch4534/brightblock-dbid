<template>
<div class="p-4">
  <div class="row">
    <div class="col-md-10 col-xs-12" v-if="answer">
      <single-topic :answer="answer"/>
    </div>
  </div>
</div>
</template>

<script>
  import SingleTopic from '@/pages/components/help/SingleTopic';

  export default {
    name: 'HelpTopic',
    props: ["answer"],
    data() {
      return {
      };
    },
    components: {
      SingleTopic,
    },
    mounted() {
    },
    computed: {
    },
    methods: {
    }
  }
</script>
<style scoped>
</style>
