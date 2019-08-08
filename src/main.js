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
import { API_CONSTANTS } from "@/api-constants";
import Datetime from "vue-datetime";
// You need a specific loader for CSS files
import "vue-datetime/dist/vue-datetime.css";
import {VueMasonryPlugin} from 'vue-masonry';
//import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';

Vue.config.productionTip = false;

Vue.use(Router);
Vue.use(Vuex);
Vue.use(Notifications, {closeOnClick: true, duration: 6000});
Vue.use(Datetime);
Vue.use(PrismicVue, {
  endpoint: "https://dbid.prismic.io/api/v2",
  linkResolver
});
Vue.use(VueMasonryPlugin);

Vue.config.productionTip = false;
//Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead);

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
      store.dispatch("contentStore/fetchTaxonomy").then(() => {
        store.dispatch("itemSearchStore/searchCategoryPopulations");
      });
      store.dispatch("conversionStore/fetchConversionData");
    });
  },
  beforeCreate () {
    store.commit("constants", CONSTANTS);
    store.commit("apiConstants", API_CONSTANTS);
    store.dispatch("myAccountStore/fetchMyAccount").then(profile => {
      store.dispatch("fetchServerTime");
    });
  }
});
app.$mount("#app");
