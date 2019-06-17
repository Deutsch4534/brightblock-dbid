<template>
<div class="container" v-if="loading">
  <div class="col-lg-5 col-xl-4 mb-4">
    Loading...
  </div>
</div>
<div class="container" v-else>
  <div class="row" v-if="!item">
    <div class="col-lg-5 col-xl-4 mb-4">
      Item not found - <router-link to="/">search for items</router-link>
    </div>
  </div>
  <div class="row" v-else>
    <div class="col-lg-5 col-xl-4 mb-4">
      <item-image-list-view :item="item"/>
    </div>
    <div class="col-lg-7 col-xl-7 ml-xl-4 mb-4">
      <div class="d-flex">
        <div class="mr-auto"><h3 class="mb-3 font-weight-bold dark-grey-text"><strong>{{item.title}}</strong></h3></div>
      </div>
      <p class="grey-text"><description-overflow :text="item.description"/></p>
      <p>Listed <!--by; <a class="font-weight-bold dark-grey-text">{{ownerProfile.name}}</a> --> on <span class="font-weight-bold dark-grey-text">{{created}}</span></p>
      <order-item :item="item" :myProfile="myProfile"/>
    </div>
  </div>
</div>
</template>

<script>
import moment from "moment";
import utils from "@/services/utils";
import DescriptionOverflow from "@/pages/components/utils/DescriptionOverflow";
import ItemImageListView from "@/pages/components/myItem/ItemImageListView";
import OrderItem from "@/pages/components/orders/OrderItem";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ItemDetails",
  components: {
    DescriptionOverflow, ItemImageListView, OrderItem
  },
  props: {
  },
  data() {
    return {
      loading: true,
      myProfile: null,
      item: {
        type: Object,
        default() {
          return {};
        }
      },
    };
  },
  mounted() {
    let itemId = Number(this.$route.params.itemId);
    this.$store.dispatch("itemSearchStore/fetchItem", itemId).then((item) => {
      if (item) {
        this.item = item;
        this.$store.dispatch("myAccountStore/fetchMyAccount").then((myProfile) => {
          this.myProfile = myProfile;
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    });
  },
  methods: {
  },
  computed: {
    created() {
      if (this.item.created) {
        return moment(this.item.created).format("YYYY-MM-DD HH:mm (Z)");
      }
      return;
    },
    ownerProfile() {
      let profile = this.$store.getters["userProfilesStore/getProfile"](this.item.owner);
      return profile ? profile : {};
    }
  }
};
</script>
<style scoped>
</style>
