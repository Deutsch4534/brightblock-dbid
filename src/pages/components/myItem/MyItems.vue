<template>
<div>
    <div class="row" v-if="noitems">
      <div class="col-12 py-5">
        <h4>No items found.</h4>
        <p><router-link to="/my-item/upload" class="btn btn-white btn-sm btn-rounded ripple-parent">Upload Item</router-link> to get started...</p>
      </div>
    </div>
    <div class="row mt-5" v-else>
      <!--
      <div class="col-md-3">
        <mdb-navbar class="blue lighten-5">
          <mdb-navbar-nav nav vertical>
            <mdb-nav-item><h5>My Items</h5></mdb-nav-item>
            <mdb-nav-item href="#" :class="(showNav === 1) ? 'active' : ''" v-if="numberItemsUnsold > 0"><span @click.prevent="showNav = 1">{{numberItemsUnsold}} Unsold</span></mdb-nav-item>
            <mdb-nav-item href="#" :class="(showNav === 2) ? 'active' : ''" v-if="numberItemsSold > 0"><span @click.prevent="showNav = 2">{{numberItemsSold}} Sold</span></mdb-nav-item>
            <mdb-nav-item href="#" :class="(showNav === 3) ? 'active' : ''" v-if="numberItemsSelling > 0"><span @click.prevent="showNav = 3">{{numberItemsSelling}} Selling</span></mdb-nav-item>
            <mdb-nav-item href="#" :class="(showNav === 4) ? 'active' : ''" v-if="numberItemsBuying > 0"><span @click.prevent="showNav = 4">{{numberItemsBuying}} Buying</span></mdb-nav-item>
            <hr/>
            <mdb-nav-item href="#" :class="(showNav === 5) ? 'active' : ''" v-if="numberItemsRegistered > 0"><span @click.prevent="showNav = 5">{{numberItemsRegistered}} Registered</span></mdb-nav-item>
            <mdb-nav-item href="#" :class="(showNav === 6) ? 'active' : ''" v-if="numberItemsUnregistered > 0"><span @click.prevent="showNav = 6">{{numberItemsUnregistered}} Not Registered</span></mdb-nav-item>
          </mdb-navbar-nav>
        </mdb-navbar>
      </div>
      -->

          <div class="col-12" v-if="showNav === 1">
            <my-items-list :items="unsold" />
          </div>

          <div class="col-12" v-if="showNav === 2">
            <h2 class="h2-responsive mb-5">Sold</span></h2>
            <my-items-list :items="sold"/>
          </div>

          <div class="col-12" v-if="showNav === 3">
            <h2 class="h2-responsive mb-5">Selling</h2>
            <my-items-list :items="selling"/>
          </div>

          <div class="col-12" v-if="showNav === 4">
            <h2 class="h2-responsive mb-5">Buying</h2>
            <my-items-list :items="buying"/>
          </div>

          <div class="col-12" v-if="showNav === 5">
            <h2 class="h2-responsive mb-5">Registered</h2>
            <my-items-list :items="registered"/>
          </div>

          <div class="col-12" v-if="showNav === 6">
            <h2 class="h2-responsive mb-5">Not Registered</h2>
            <my-items-list :items="unregistered"/>
          </div>
    </div>
</div>
</template>

<script>
import MyItemsList from "./MyItemsList";
import { mdbContainer, mdbRow,  mdbCard,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbCardImage,
    mdbMask,
    mdbIcon,
    mdbView,
    mdbBtn } from 'mdbvue';
import { mdbNavbar, mdbNavbarNav, mdbNavItem } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyItems",
  bodyClass: "index-page",
  components: {
    MyItemsList,
    mdbContainer,
    mdbRow,
     mdbCard,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbCardImage,
    mdbMask,
    mdbIcon,
    mdbView,
    mdbBtn, mdbNavbar, mdbNavbarNav, mdbNavItem
  },
  data() {
    return {
      showNav: 1,
    };
  },
  created() {
    this.$store.dispatch("myItemStore/fetchMyItems");
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
