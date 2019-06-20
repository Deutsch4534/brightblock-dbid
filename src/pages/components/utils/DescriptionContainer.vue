<template>
<div>
  <div><span class="pb-0 mb-0" v-html="displayable"></span>
  <span v-if="overflow" class="text-muted">
    <a @click.prevent="truncated = !truncated" v-if="truncated"><small>more</small></a>
    <a @click.prevent="truncated = !truncated" v-else><small>less</small></a>
  </span>
  </div>
</div>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: "DescriptionContainer",
  components: {
  },
  props: ["text"],
  data() {
    return {
      limit: 50,
      truncated: true,
    };
  },
  mounted() {
  },
  computed: {
    displayable() {
      if (this.text && this.text.length > this.limit && this.truncated) {
        let words = this.text.split(" ");
        let limit = words.length - 1;
        let trunc = Math.min(limit, 4);
        let truncStr = words.slice(0,trunc);
        return "<small>" + truncStr.join(" ") + "..."  + "</small>";
      } else {
        return "<small>" + this.text + "</small>";
      }
    },
    overflow() {
      return this.text && this.text.length > this.limit;
    }
  },
  methods: {
  }
};
</script>
<style>

</style>
<style scoped>
</style>
