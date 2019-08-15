// store.js
import Vue from "vue";
import Vuex from "vuex";
import { CONSTANTS } from "@/storage/constants";
import myItemStore from "./myItemStore";
import myAccountStore from "./myAccountStore";
import userProfilesStore from "./userProfilesStore";
import itemSearchStore from "./itemSearchStore";
import conversionStore from "./conversionStore";
import assetStore from "./assetStore";
import lightningStore from "./lightningStore";
import onlineAuctionsStore from "./onlineAuctionsStore";
import myAuctionStore from "./myAuctionStore";
import contentStore from "./contentStore";
import xhrService from "@/services/xhrService";
import { API_CONSTANTS } from "brightblock-lib/src/services/api-constants";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    myItemStore: myItemStore,
    itemSearchStore: itemSearchStore,
    myAccountStore: myAccountStore,
    userProfilesStore: userProfilesStore,
    conversionStore: conversionStore,
    myAuctionStore: myAuctionStore,
    onlineAuctionsStore: onlineAuctionsStore,
    assetStore: assetStore,
    lightningStore: lightningStore,
    contentStore: contentStore,
  },
  state: {
    constants: {},
    apiConstants: {},
    serverTime: {}
  },
  getters: {
    isDebugMode: state => {
      return state.constants.debugMode;
    },
    serverTime: state => {
      return state.serverTime;
    }
  },
  mutations: {
    serverTime(state, serverTime) {
      state.serverTime = serverTime;
    },
    constants(state) {
      state.constants = CONSTANTS;
    },
    apiConstants(state) {
      state.apiConstants = API_CONSTANTS;
    },
    toggleDebugMode(state) {
      state.constants.debugMode = !state.constants.debugMode;
    },
  },
  actions: {
    fetchServerTime({ commit, state }) {
      xhrService
        .makeGetCall("/api/server/time")
        .then(function(result) {
          commit("serverTime", result.timestamp + 1000); // add 1s to offset in flight time
          setInterval(function() {
            commit("serverTime", (state.serverTime += 1000));
          }, 1000);
        })
        .catch(function(e) {
          console.log(e);
        });
    }
  }
});
export default store;
