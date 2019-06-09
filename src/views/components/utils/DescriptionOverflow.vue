<template>
<div>
  <div v-html="displayable"></div>
  <div v-if="overflow" class="muted">
    <a @click.prevent="truncated = !truncated" v-if="truncated"><u>more</u></a>
    <a @click.prevent="truncated = !truncated" v-else><u>less</u></a>
  </div>
</div>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: "DescriptionOverflow",
  components: {
  },
  props: ["text"],
  data() {
    return {
      limit: 200,
      truncated: true,
    };
  },
  mounted() {
  },
  computed: {
    displayable() {
      if (this.text && this.text.length > this.limit && this.truncated) {
        return this.text.substring(0, this.limit) + "...";
      } else {
        return this.text;
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
