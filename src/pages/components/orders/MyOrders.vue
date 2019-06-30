<template>
<div>
<ul class="nav nav-tabs md-tabs text-dark bg-light" id="myTabMD" role="tablist">
  <li class="nav-item">
    <a class="nav-link active" id="buying-tab-md" data-toggle="tab" @click.prevent="showTab('buying')" href="#buying-md" role="tab" aria-controls="buying-md" aria-selected="true">
      buying <span class="badge badge-dark">{{numberItemsBuying}}</span></a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="selling-tab-md" data-toggle="tab" @click.prevent="showTab('selling')" href="#selling-md" role="tab" aria-controls="selling-md" aria-selected="true">
      selling <span class="badge badge-dark">{{numberItemsSelling}}</span></a>
    </a>
  </li>
</ul>
<div class="tab-content card pt-5" id="myTabContentMD">
  <div class="tab-pane fade show active" id="buying-md" role="tabpanel" aria-labelledby="buying-tab-md">
    <div class="container-fluid">
      <div class="d-flex justify-content-start" v-if="numberItemsBuying === 0">
        <p class="h1-responsive mb-5">No orders found!</p>
      </div>
      <div v-else>
        <my-order class="row" v-for="asset in buying" :key="asset.assetHash" :asset="asset" :myProfile="myProfile"/>
      </div>
    </div>
  </div>
  <div class="tab-pane fade" id="selling-md" role="tabpanel" aria-labelledby="selling-tab-md">
    <div class="container-fluid">
      <div class="d-flex justify-content-start" v-if="numberItemsSelling === 0">
        <p class="h1-responsive mb-5">Nothing selling!</p>
      </div>
      <div v-else>
        <my-order class="row" v-for="asset in selling" :key="asset.assetHash" :asset="asset" :myProfile="myProfile"/>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
import MyOrder from "@/pages/components/orders/MyOrder";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "CryptoAddressTabs",
  components: {
    MyOrder,
  },
  props: {
    myProfile: null
  },
  data() {
    return {
      activeTab: null
    };
  },
  mounted() {
  },
  mounted() {
    this.showTab("buying");
    this.$store.dispatch("assetStore/subscribeAssetPurchaseNews");
    this.assetConfig = this.$store.getters["assetStore/getAssetConfig"];
  },
  computed: {
    selling() {
      return this.$store.getters["assetStore/getAssetsSelling"](this.myProfile.username);
    },
    buying() {
      return this.$store.getters["assetStore/getAssetsBuying"](this.myProfile.username);
    },
    numberItemsBuying() {
      return this.$store.getters["assetStore/getAssetsBuying"](this.myProfile.username).length;
    },
    numberItemsSelling() {
      return this.$store.getters["assetStore/getAssetsSelling"](this.myProfile.username).length;
    },
  },

  methods: {
    showTab(tab) {

      this.activeTab = tab;
      let $ele = document.getElementById("selling-tab-md");
      $ele.classList.remove('active');

      $ele = document.getElementById("buying-tab-md");
      $ele.classList.remove('active');

      $ele = document.getElementById(tab + "-tab-md");
      $ele.classList.add('active');

      $ele = document.getElementById("selling-md");
      $ele.classList.remove('active');
      $ele.classList.remove('show');

      $ele = document.getElementById("buying-md");
      $ele.classList.remove('active');
      $ele.classList.remove('show');

      $ele = document.getElementById(tab + "-md");
      $ele.classList.add('active');
      $ele.classList.add('show');
    },
  }
};
</script>
<style scoped>
.container-fluid {
}
</style>
