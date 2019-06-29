// ethStore.js
import xhrService from "@/services/xhrService";
import store from "@/storage/store";
import conversionService from "@/services/conversionService";

const conversionStore = {
  namespaced: true,
  state: {
    fiatRates: {},
    cryptoRates: {}
  },
  getters: {
    getFiatRates: state => {
      return state.fiatRates;
    },
    getFiatRate: state => currency => {
      return state.fiatRates[currency];
    },
    getCryptoRate: state => pair => {
      return state.cryptoRates[pair];
    }
  },
  mutations: {
    setCryptoRate(state, cryptoRate) {
      state.cryptoRates[cryptoRate.pair] = Number(cryptoRate.rate);
    },
    setFiatRates(state, fiatRates) {
      state.fiatRates = fiatRates;
    }
  },
  actions: {
    fetchConversionData({ commit, state }) {
      return new Promise(resolve => {
        store.dispatch("conversionStore/fetchFiatRates").then(fiatRates => {
          conversionService.subscribeExchangeRateNews();
          commit("setFiatRates", fiatRates);
          store
            .dispatch("conversionStore/fetchShapeShiftCryptoRate", "eth_btc")
            .then(cryptoRate => {
              commit("setCryptoRate", cryptoRate);
              resolve({ fiatRates: state.fiatRates, eth_btc: cryptoRate });
            })
            .catch(err => {
              console.log(err);
              commit("setCryptoRate", 0);
              resolve({ fiatRates: state.fiatRates, eth_btc: 0 });
            });
        });
      });
    },
    fetchFiatRates({ commit }) {
      return new Promise(resolve => {
        xhrService.makeGetCall("/api/exchange/rates").then(function(data) {
          if (data && data.rates) {
            commit("setFiatRates", data.rates);
            resolve(data.rates);
          } else {
            commit("setFiatRates", []);
            resolve([]);
          }
        })
          .catch(err => {
            console.log(err);
            commit("setFiatRates", []);
            resolve([]);
          });
      });
    },
    fetchShapeShiftCryptoRate: function({ commit }, pair) {
      return new Promise(resolve => {
        const url = store.state.constants.shapeShiftUrl + "/rate/" + pair;
        xhrService.makeDirectCall(url).then(function(cryptoRate) {
          commit("setCryptoRate", cryptoRate);
          resolve(cryptoRate);
        });
      });
    }
  }
};
export default conversionStore;
