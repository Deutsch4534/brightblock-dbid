<template>
<div class="container bg-card p-5 text-center" role="status" v-if="loading">
  <div class="container spinner-border text-center" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
<div class="p-5" v-else-if="noitems && !loading">
  <h4>No items found.</h4>
  <p><router-link to="/my-item/upload" class="btn btn-white btn-sm btn-rounded ripple-parent">Upload Item</router-link> to get started...</p>
</div>
<div class="p-5" v-else>
  <div v-if="showNav === 1">
    <my-items-list :items="unsold" :myProfile="myProfile"/>
  </div>

  <div v-if="showNav === 2">
    <h2 class="h2-responsive mb-5">Sold</span></h2>
    <my-items-list :items="sold" :myProfile="myProfile"/>
  </div>

  <div v-if="showNav === 3">
    <h2 class="h2-responsive mb-5">Selling</h2>
    <my-items-list :items="selling" :myProfile="myProfile"/>
  </div>

  <div v-if="showNav === 4">
    <h2 class="h2-responsive mb-5">Buying</h2>
    <my-items-list :items="buying" :myProfile="myProfile"/>
  </div>

  <div v-if="showNav === 5">
    <h2 class="h2-responsive mb-5">Registered</h2>
    <my-items-list :items="registered" :myProfile="myProfile"/>
  </div>

  <div v-if="showNav === 6">
    <h2 class="h2-responsive mb-5">Not Registered</h2>
    <my-items-list :items="unregistered" :myProfile="myProfile"/>
  </div>
</div>
</template>

<script>
import MyItemsList from "./MyItemsList";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyItems",
  bodyClass: "index-page",
  components: {
    MyItemsList,
  },
  props: ["myProfile"],
  data() {
    return {
      showNav: 1,
      loading: true,
    };
  },
  created() {
    this.$store.dispatch("myItemStore/fetchMyItems").then(() => {
      this.loading = false;
    });
  },
  methods: {},
  computed: {
    unsold() {
      return this.$store.getters["myItemStore/unsold"];
    },
    selling() {
      return this.$store.getters["myItemStore/selling"];
    },
    sold() {
      return this.$store.getters["myItemStore/sold"];
    },
    buying() {
      return this.$store.getters["myItemStore/buying"];
    },
    registered() {
      return this.$store.getters["myItemStore/registered"](true);
    },
    unregistered() {
      return this.$store.getters["myItemStore/registered"](false);
    },
    numberItemsRegistered() {
      return this.$store.getters["myItemStore/registered"](true).length;
    },
    numberItemsUnregistered() {
      return this.$store.getters["myItemStore/registered"](false).length;
    },
    numberItemsBuying() {
      return this.$store.getters["myItemStore/buying"].length;
    },
    numberItemsSelling() {
      return this.$store.getters["myItemStore/selling"].length;
    },
    numberItemsSold() {
      return this.$store.getters["myItemStore/numberItemsSold"];
    },
    numberItemsUnsold() {
      return this.$store.getters["myItemStore/numberItemsUnsold"];
    },
    noitems() {
      return (this.$store.getters["myItemStore/numberItemsUnsold"] + this.$store.getters["myItemStore/numberItemsSold"]) === 0;
    }
  }
};
</script>
<style scoped>
.active {
  background-color: #fff;
  font-weight: 300;
}
</style>
