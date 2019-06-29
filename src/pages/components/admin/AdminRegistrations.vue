<template>
<div class="row">
  <h2 class="title">Registered Artworks ({{numberRegistered}} registered)</h2>
  <div v-for="(registration, index) in registrations" :key="index">
    <p>{{index}} : {{registration}}</p>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    registrations() {
      return this.$store.getters["ethStore/getBlockchainItems"];
    },
    numberRegistered() {
      let items = this.$store.getters["ethStore/getBlockchainItems"];
      return items ? items.length : 0;
    }
  },
  methods: {},
  components: {}
};
</script>
