<template>
<div class="d-flex justify-content-center" role="status" v-if="loading">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
<div class="container" v-else>
  <div class="row" v-if="notfound">
    <div class="col-lg-5 col-xl-4 mb-4">
      Item not found - <router-link to="/">search for items</router-link>
    </div>
  </div>
  <div class="row" v-else>
    <my-order :myProfile="myProfile" :assetHash="asset.assetHash" :item="item"/>
  </div>
</div>
</template>

<script>
import MyOrder from "@/pages/components/orders/MyOrder";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "PurchaseOrder",
  components: {
    MyOrder
  },
  props: {
  },
  data() {
    return {
      loading: true,
      item: null,
      asset: null,
      myProfile: null,
      notfound: false
    };
  },
  mounted() {
    let assetHash = this.$route.params.assetHash;
    this.$store.dispatch("assetStore/lookupAssetByHash", assetHash).then(asset => {
      if (asset) {
        this.asset = asset;
        this.$store.dispatch("myAccountStore/fetchMyAccount").then((myProfile) => {
          this.myProfile = myProfile;
          this.$store.dispatch("assetStore/subscribeAssetPurchaseNews", myProfile);
          let itemId = Number(asset.assetId.split("_::_")[1]);
          this.$store.dispatch("itemSearchStore/fetchItem", itemId).then((item) => {
            if (item) {
              this.item = item;
            } else {
              this.$notify({type: 'error', title: 'Purchase Order', text: 'Unable to find item.'});
              this.notfound = true;
            }
            this.loading = false;
          });
        });
      } else {
        this.$notify({type: 'error', title: 'Purchase Order', text: 'Unable to find item.'});
        this.loading = false;
        this.notfound = true;
      }
    });
  },
  computed: {
  },
  methods: {
  }
};
</script>
<style scoped>
</style>
