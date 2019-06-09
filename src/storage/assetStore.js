import _ from "lodash";
import store from "@/storage/store";
import bitcoinService from "@/services/bitcoinService";
import utils from "@/services/utils";
import moment from "moment";

const assetStore = {
  namespaced: true,
  state: {
    configs: [],
    bitcoinConfig: null,
    balance: 0,
    assets: [],
    assetConfig: null,
    lightningConfig: null
  },
  getters: {
    getBitcoinConfig: state => {
      return state.bitcoinConfig;
    },
    getLightningConfig: state => {
      return state.lightningConfig;
    },
    getBalance: state => {
      return state.balance;
    },
    getTarget: state => {
      return state.target;
    },
    getAssetByHashAndBuyer: state => (assetHash, buyerDid) => {
      let asset = state.assets.find(asset => asset.assetHash === assetHash);
      let purchaseCycle;
      if (asset && asset.purchaseCycles) {
        purchaseCycle = asset.purchaseCycles[(asset.purchaseCycles.length - 1)];
      }
      if (purchaseCycle) {
        if (purchaseCycle.buyer && purchaseCycle.buyer.did === buyerDid) {
          return asset;
        }
      }
    },
    getAssetByHash: state => assetHash => {
      let asset = state.assets.find(asset => asset.assetHash === assetHash);
      return asset;
    },
    getCurrentPurchaseCycleByHash: state => assetHash => {
      let asset = state.assets.find(asset => asset.assetHash === assetHash);
      let purchaseCycle;
      if (asset && asset.purchaseCycles) {
        purchaseCycle = asset.purchaseCycles[(asset.purchaseCycles.length - 1)];
      }
      return purchaseCycle;
    },
    getAssets: state => {
      return state.assets;
    },
    getAssetsBuying: state => did => {
      let assets = [];
      _.forEach(state.assets, function(asset) {
        if (asset.purchaseCycles) {
          let purchaseCycle = asset.purchaseCycles[(asset.purchaseCycles.length - 1)];
          if (purchaseCycle.buyer && purchaseCycle.buyer.did === did) {
            assets.push(asset);
          }
        }
      });
      return assets;
    }
  },
  mutations: {
    bitcoinConfig(state, bitcoinConfig) {
      state.bitcoinConfig = bitcoinConfig;
    },
    setBalance(state, balance) {
      state.balance = balance;
    },
    assetConfig(state, assetConfig) {
      state.assetConfig = assetConfig;
    },
    lightningConfig(state, lightningConfig) {
      state.lightningConfig = lightningConfig;
    },
    addAsset(state, asset) {
      if (!asset || !asset.assetHash) {
        return;
      }
      let index = _.findIndex(state.assets, function(u) {
        return u.assetHash === asset.assetHash;
      });
      if (index < 0) {
        state.assets.splice(0, 0, asset);
      } else {
        let currentAsset = state.assets[index];
        let statusChange = currentAsset.status !== asset.status;
        let updateChange = currentAsset.updated !== asset.updated;
        if (updateChange || statusChange) {
          state.assets.splice(index, 1, asset);
        }
      }
    },
    addAssets(state, assets) {
      if (!assets) {
        return;
      }
      _.forEach(assets, function(asset) {
        let index = _.findIndex(state.assets, function(u) {
          return u.assetHash === asset.assetHash;
        });
        if (index < 0) {
          state.assets.splice(0, 0, asset);
        } else {
          state.assets.splice(index, 1, asset);
        }
      });
    }
  },
  actions: {
    fetchRadPayConfig({ commit, state, getters}) {
      return new Promise(resolve => {
        bitcoinService.fetchRadPayConfig().then(configs => {
          commit("assetConfig", configs[0]);
          commit("bitcoinConfig", configs[1]);
          commit("lightningConfig", configs[2]);
          resolve(configs[0]);
        })
          .catch(() => {
            // server error
            resolve();
          });
      });
    },
    fetchBitcoinState({ commit, state }) {
      return new Promise(resolve => {
        let bitcoinConfig = state.bitcoinConfig;
        if (bitcoinConfig) {
          resolve(bitcoinConfig);
        } else {
          bitcoinService.fetchBitcoinState().then(bitcoinConfig => {
            commit("bitcoinConfig", bitcoinConfig);
            resolve(bitcoinConfig);
          })
            .catch(error => {
              resolve({client: "Error - client not connected: " + error});
            });
        }
      });
    },
    fetchBalance({ commit, state }) {
      return new Promise(resolve => {
        let balance = state.balance;
        if (balance) {
          commit("setBalance", balance);
          resolve(balance);
        } else {
          resolve(0);
        }
      });
    },
    subscribeAssetPurchaseNews({ commit, state, getters}) {
      return new Promise(resolve => {
        bitcoinService.subscribeAssetPurchaseNews(function(assets) {
          _.forEach(assets, function(asset) {
            commit("addAsset", asset);
          });
          resolve(assets);
        }, function(error) {
          console.log("[SysadmOnly] WebSocket Error: " + error);
        });
      });
    },
    subscribeAssetTransferNews({ commit, state, getters}) {
      return new Promise(resolve => {
        bitcoinService.subscribeAssetTransferNews(function(assets) {
          _.forEach(assets, function(asset) {
            commit("addAsset", asset);
          });
          resolve(assets);
        }, function(error) {
          console.log("[SysadmOnly] WebSocket Error: " + error);
        });
      });
    },
    initialiseAsset({ commit, state, getters}, artwork) {
      return new Promise(resolve => {
        let objectIdent = "artwork_::_" + artwork.id;
        let asset = {
          created: moment({}).valueOf(),
          assetId: objectIdent,
          assetType: (artwork.medium === "image" || artwork.medium === "video" || artwork.medium === "sound") ? "digital" : "physical",
          assetTitle: artwork.title,
          assetHash: utils.buildBitcoinHash(artwork),
          assetRegistrationTx: null,
          confirmed: false,
          status: -1,
        };
        commit("addAsset", asset);
        resolve(asset);
      });
    },
    initialisePayment({ commit, state, getters}, data) {
      return new Promise(resolve => {
        let artwork = data.artwork;
        let asset = data.asset;
        store.dispatch("userProfilesStore/fetchUserProfile", { username: artwork.gallerist }, { root: true }).then(profile => {
          let gallerist = profile;
          store.dispatch("userProfilesStore/fetchUserProfile", { username: artwork.owner }, { root: true }).then(profile => {
            let seller = profile;
            store.dispatch("userProfilesStore/fetchUserProfile", { username: artwork.artist }, { root: true }).then(profile => {
              let artist = profile;
              let buyer = store.getters["myAccountStore/getMyProfile"];
              let fiatRate = store.getters["conversionStore/getFiatRate"](artwork.saleData.fiatCurrency);
              let otherData = {
                fiatRate: fiatRate,
                buyer: buyer,
                gallerist: gallerist,
                seller: seller,
                creator: artist,
              };
              let purchaseCycle = utils.initialisePurchaseCycle(artwork, otherData);
              if (!asset.purchaseCycles) {
                asset.purchaseCycles = [];
              }
              asset.purchaseCycles.push(purchaseCycle);
              bitcoinService.getPaymentAddress(asset).then(asset => {
                commit("addAsset", asset);
                resolve(asset);
              })
                .catch(error => {
                  console.log(error);
                  resolve();
                });
            });
          });
        });
      });
    },
    lookupAssetByHash({ commit, state, getters}, assetHash) {
      return new Promise(resolve => {
        bitcoinService.lookupAssetByHash(assetHash).then(asset => {
          if (asset) {
            commit("addAsset", asset);
            resolve(asset);
          } else {
            resolve();
          }
        })
          .catch(() => {
            // server error
            resolve();
          });
      });
    },
    lookupAssetsByBuyer({ commit, state, getters}) {
      return new Promise(resolve => {
        let buyer = store.getters["myAccountStore/getMyProfile"];
        bitcoinService.lookupAssetsByBuyer(buyer.username).then(assets => {
          if (assets) {
            commit("addAssets", assets);
            resolve(assets);
          } else {
            resolve();
          }
        })
          .catch(() => {
            // server error
            resolve();
          });
      });
    },
    cancelPurchase({ commit, state, getters}, assetHash) {
      return new Promise(resolve => {
        bitcoinService.cancelPurchase(assetHash).then(asset => {
          commit("addAsset", asset);
          resolve(asset);
        })
          .catch(error => {
            console.log(error);
            resolve();
          });
      });
    },
    paySeller({ commit, state, getters}, asset) {
      return new Promise(resolve => {
        bitcoinService.paySeller(asset.assetHash).then(asset => {
          commit("addAsset", asset);
          resolve(asset);
        })
          .catch(error => {
            console.log(error);
            resolve();
          });
      });
    },
    markAssetTransferred({ commit, state, getters}, assetHash) {
      return new Promise(resolve => {
        bitcoinService.markAssetTransferred(assetHash).then(asset => {
          commit("addAsset", asset);
          resolve(asset);
        })
          .catch(error => {
            console.log(error);
            resolve();
          });
      });
    }
  }
};
export default assetStore;
