<template>
<div class="">
  <my-single-item v-for="(item, index) of items" :key="index" :item="item" :myProfile="myProfile"/>
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
    myProfile: null,
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
