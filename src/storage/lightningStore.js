import lightningService from "@/services/lightningService";

const lightningStore = {
  namespaced: true,
  state: {
    lightningState: [],
    nodeInfo: [],
    peerInfo: [],
    walletBalances: [],
    pubkeys: [],
    invoice: null
  },
  getters: {
    getLightningState: state => {
      return state.lightningState;
    },
    getPubkey: state => {
      return state.lightningState.pubkey;
    }
  },
  mutations: {
    lightningState(state, data) {
      state.lightningState[data.nodeName] = data.lightningState;
    },
    nodeInfo(state, data) {
      state.nodeInfo[data.nodeName] = data.nodeInfo;
    },
    walletBalances(state, walletBalances) {
      state.walletBalances = walletBalances;
    },
    invoice(state, invoice) {
      state.invoice = invoice;
    },
    pubkeys(state, pubkeys) {
      state.pubkeys = pubkeys;
    },
    peerInfo(state, data) {
      state.peerInfo[data.nodeName] = data.peerInfo;
    },
  },
  actions: {
    fetchInfo({ commit, state }, nodeName) {
      return new Promise(resolve => {
        let lightningState = state.lightningState[nodeName];
        if (lightningState) {
          resolve(lightningState);
        } else {
          lightningService.getInfo(nodeName).then(lightningState => {
            commit("lightningState", {nodeName: nodeName, lightningState: lightningState});
            resolve(lightningState);
          })
            .catch(error => {
              resolve(error);
            });
        }
      });
    },
    addInvoice({ commit, state }, data) {
      return new Promise(resolve => {
        lightningService.addInvoice(data.nodeName, data.invoiceData).then(invoice => {
          commit("invoice", invoice);
          resolve(invoice);
        })
          .catch(error => {
            resolve(error);
          });
      });
    },
    sendPayment({ commit, state }, data) {
      return new Promise(resolve => {
        lightningService.sendPayment(data.nodeName, data.paymentData).then(response => {
          //commit("response", response);
          resolve(response);
        })
          .catch(error => {
            resolve(error);
          });
      });
    },
    fetchNodeInfo({ commit, state }, data) {
      return new Promise(resolve => {
        let nodeInfo = state.nodeInfo[data.nodeName];
        if (nodeInfo) {
          resolve(nodeInfo);
        } else {
          lightningService.getNodeInfo(data.nodeName, data.pubkey).then(nodeInfo => {
            commit("nodeInfo", {nodeName: data.nodeName, nodeInfo: nodeInfo});
            resolve(nodeInfo);
          })
            .catch(error => {
              resolve(error);
            });
        }
      });
    },
    fetchWalletBalances({ commit, state }) {
      return new Promise(resolve => {
        // info: listPeers walletBalance  pendingChannels listChannels closedChannels listInvoices
        lightningService.walletBalances().then(walletBalances => {
          commit("walletBalances", walletBalances);
          resolve(walletBalances);
        })
          .catch(error => {
            resolve(error);
          });
      });
    },
    fetchPubkeys({ commit, state }) {
      return new Promise(resolve => {
        // info: listPeers walletBalance  pendingChannels listChannels closedChannels listInvoices
        lightningService.pubkeys().then(pubkeys => {
          commit("pubkeys", pubkeys);
          resolve(pubkeys);
        })
          .catch(error => {
            resolve(error);
          });
      });
    },
    fetchPeerInfo({ commit, state }, command) {
      return new Promise(resolve => {
        // info: listPeers walletBalance  pendingChannels listChannels closedChannels listInvoices
        lightningService.getPeerInfo(command).then(peerInfo => {
          commit("peerInfo", peerInfo);
          resolve(peerInfo);
        })
          .catch(error => {
            resolve(error);
          });
      });
    }
  },
};
export default lightningStore;
