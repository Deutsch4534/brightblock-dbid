<template>
<div class="">
  This item is being purchased by someone else.
  <br/>
  <router-link to="/" class="btn btn-primary btn-small text-white text-capitalize m-0 mt-4 p-3">Continue Browsing</router-link>
</div>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: "UnderOffer",
  components: {
  },
  props: {
    item: null
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  computed: {
  },
  methods: {
  }
};
</script>
<style>

</style>
<style scoped>
</style>
