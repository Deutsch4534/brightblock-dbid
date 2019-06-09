import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbvue/build/css/mdb.css';
import './assets/styles.css';
import Vue from "vue";
import App from "./App.vue";
import Vuex from "vuex";
import Router from "vue-router";
import router from "./router";
import store from "@/storage/store";
import Notifications from "vue-notification";
import PrismicVue from "prismic-vue";
import linkResolver from "./prismic/linkResolver";

import { CONSTANTS } from "@/storage/constants";
import Datetime from "vue-datetime";
// You need a specific loader for CSS files
import "vue-datetime/dist/vue-datetime.css";
import {VueMasonryPlugin} from 'vue-masonry';

Vue.config.productionTip = false;

Vue.use(Router);
Vue.use(Vuex);
Vue.use(Notifications);
Vue.use(Datetime);
Vue.use(PrismicVue, {
  endpoint: "https://radicle.prismic.io/api/v2",
  linkResolver
});
Vue.use(VueMasonryPlugin);

Vue.config.productionTip = false;

const app = new Vue({
  router,
  store,
  render: h => h(App),
  mounted () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      store.dispatch("assetStore/fetchBalance");
      store.dispatch("assetStore/fetchRadPayConfig");
      store.dispatch("assetStore/subscribeAssetTransferNews");
      let profile = this.$store.getters["myAccountStore/getMyProfile"];
      if (profile.loggedIn) {
        store.dispatch("fetchServerTime");
      }
      store.dispatch("conversionStore/fetchConversionData");
    });
  },
  beforeCreate () {
    store.commit("constants", CONSTANTS);
    store.dispatch("myAccountStore/fetchMyAccount");
  }
});
app.$mount("#app");
