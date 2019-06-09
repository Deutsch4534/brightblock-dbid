// store.js
import Vue from "vue";
import Vuex from "vuex";
import { CONSTANTS } from "./constants";
import myArtworksStore from "./myArtworksStore";
import myAccountStore from "./myAccountStore";
import userProfilesStore from "./userProfilesStore";
import artworkSearchStore from "./artworkSearchStore";
import conversionStore from "./conversionStore";
import assetStore from "./assetStore";
import lightningStore from "./lightningStore";
import ethStore from "./ethStore";
import onlineAuctionsStore from "./onlineAuctionsStore";
import myAuctionsStore from "./myAuctionsStore";
import contentStore from "./contentStore";
import galleryStore from "./galleryStore";
import xhrService from "@/services/xhrService";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    myArtworksStore: myArtworksStore,
    myAccountStore: myAccountStore,
    userProfilesStore: userProfilesStore,
    artworkSearchStore: artworkSearchStore,
    conversionStore: conversionStore,
    ethStore: ethStore,
    myAuctionsStore: myAuctionsStore,
    onlineAuctionsStore: onlineAuctionsStore,
    assetStore: assetStore,
    lightningStore: lightningStore,
    contentStore: contentStore,
    galleryStore: galleryStore
  },
  state: {
    constants: {},
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
    toggleDebugMode(state) {
      state.constants.debugMode = !state.constants.debugMode;
    },
    toggleFeatureAuctions(state) {
      state.constants.featureAuctions = !state.constants.featureAuctions;
    },
    toggleFeatureEthereum(state) {
      state.constants.featureEthereum = !state.constants.featureEthereum;
    },
    toggleFeatureBitcoin(state) {
      state.constants.featureBitcoin = !state.constants.featureBitcoin;
    }
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
