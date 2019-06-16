<template>
<div class="container-fluid">
  <my-single-item v-for="(item, index) of items" :key="index" :item="item"/>
</div>
</template>

<script>
import MySingleItem from "./MySingleItem";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyItemsList",
  components: { MySingleItem },
  props: {
    sellingStatus: null,
    items: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
  }
};
</script>
