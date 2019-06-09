// ethStore.js
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
// import notify from "@/notify";

const bitcoinStore = {
  namespaced: true,
  state: {
    bitcoinState: null,
    balance: 0,
    target: 100.0
  },
  getters: {
    getBitcoinState: state => {
      return state.bitcoinState;
    },
    getBalance: state => {
      return state.balance;
    },
    getTarget: state => {
      return state.target;
    }
  },
  mutations: {
    bitcoinState(state, bitcoinState) {
      state.bitcoinState = bitcoinState;
    },
    setBalance(state, balance) {
      state.balance = balance;
    }
  },
  actions: {
    fetchBitcoinState({ commit, state }) {
      return new Promise(resolve => {
        let bitcoinState = state.bitcoinState;
        if (bitcoinState) {
          resolve(bitcoinState);
        } else {
          bitcoinService.fetchBitcoinState(
            function(bitcoinState) {
              commit("bitcoinState", bitcoinState);
              resolve(bitcoinState);
            },
            function(error) {
              resolve({
                client: "Error - client not connected: " + error
              });
            }
          );
        }
      });
    },
    fetchBalance({ commit }) {
      return new Promise(resolve => {
        bitcoinService.fetchBalance(
          function(balance) {
            commit("setBalance", balance);
            resolve(balance);
          },
          function() {
            resolve(0);
          }
        );
      });
    }
  }
};
export default bitcoinStore;
