import itemSearchService from "@/services/itemSearchService";
import _ from "lodash";
import moneyUtils from "@/services/moneyUtils";
import store from "@/storage/store";

const itemSearchStore = {
  namespaced: true,
  state: {
    searchResults: [],
    items: [],
    artists: []
  },
  getters: {
    getItems: state => {
      let registered = state.items;
      registered = registered.sort(function compare(a, b) {
        if (a.saleData.amount > b.saleData.amount) {
          return -1;
        }
        if (a.saleData.amount < b.saleData.amount) {
          return 1;
        }
        return 0;
      });
      return registered;
    },
    getQuery: state => {
      return state.query;
    },
    getSearchResults: state => {
      let registered = state.searchResults;
      registered = registered.sort(function compare(a, b) {
        if (a.saleData.amount > b.saleData.amount) {
          return -1;
        }
        if (a.saleData.amount < b.saleData.amount) {
          return 1;
        }
        return 0;
      });
      return registered;
    },
    getBitcoinResults: state => {
      let registered = state.items.filter(
        item => item.bitcoinTx
      );
      registered = registered.sort(function compare(a, b) {
        if (a.saleData.amount > b.saleData.amount) {
          return -1;
        }
        if (a.saleData.amount < b.saleData.amount) {
          return 1;
        }
        return 0;
      });
      let status = store.state.constants.statuses.item.PURCHASE_BEGUN;
      registered = registered.filter(item => item.status !== status);
      return registered;
    },
    getRegisteredItems: state => {
      let registered = state.items.filter(
        item => item.bcitem && item.bcitem.itemIndex > -1
      );
      registered = registered.sort(function compare(a, b) {
        if (a.bcitem.itemIndex > b.bcitem.itemIndex) {
          return -1;
        }
        if (a.bcitem.itemIndex < b.bcitem.itemIndex) {
          return 1;
        }
        return 0;
      });
      return registered;
    },
    getItem: state => id => {
      let item = state.items.find(item => item.id === id);
      if (item && item.id) {
        return item;
      } else {
        return {
          image: require("@/assets/img/missing/missing.jpg"),
        };
      }
    },
    getArtistsPage: state => {
      return state.artists;
    },
    homePageItems: (state, getters) => {
      let fb = store.state.constants.featureBitcoin;
      let registered;
      if (fb) {
        registered = getters.getItems;
      } else {
        registered = getters.getRegisteredItems;
      }
      return registered.slice(0, 6);
    },
    getItemsPageItems: (state, getters) => {
      let registered = getters.getItems;
      return registered.slice(0, 9);
    },
    getItemsByArtist: (state, getters) => username => {
      let items = [];
      let registered = getters.getItems;
      _.forEach(registered, function(item) {
        if (item.artist === username) {
          items.push(item);
        }
      });
      return items;
    },
    numberItems: state => {
      return state.items.length;
    },
    numberSearchResults: state => {
      return state.searchResults.length;
    }
  },
  mutations: {
    addItem(state, registeredItem) {
      let index = _.findIndex(state.items, function(o) {
        return o.id === registeredItem.id;
      });
      if (index === -1) {
        state.items.push(registeredItem);
      } else {
        state.items.splice(index, 1, registeredItem);
      }
    },
    addSearchResult(state, item) {
      let index = _.findIndex(state.searchResults, function(o) {
        return o.id === item.id;
      });
      if (index === -1) {
        state.searchResults.push(item);
      } else {
        state.searchResults.splice(index, 1, item);
      }
    },
    addArtist(state, userProfile) {
      if (userProfile && userProfile.username) {
        let index = _.findIndex(state.artists, function(o) {
          return o.username === userProfile.username;
        });
        if (index === -1) {
          state.artists.push(userProfile);
        } else {
          state.artists.splice(index, 1, userProfile);
        }
      }
    },
    clearSearchResults(state) {
      state.searchResults = [];
    }
  },
  actions: {
    fetchItems({ commit }, data) {
      return new Promise(resolve => {
        itemSearchService.newQuery(store, data);
      });
    },

    fetchRegisteredItems({ commit }, blockchainItems) {
      // let blockchainItems = store.getters['ethStore/getBlockchainItems']
      let maximum = Math.min(blockchainItems.length, 20);
      let users = "";
      for (var index = 0; index < maximum; index++) {
        let blockchainItem = blockchainItems[index];
        if (users.indexOf(blockchainItem.blockstackId) === -1) {
          users += blockchainItem.blockstackId + ",";
        }
        itemSearchService.userItems(store,
          {
            username: blockchainItem.blockstackId,
            title: blockchainItem.title
          },
          function(item) {
            if (item) {
              if (store.state.constants.featureEthereum) {
                let fiatRate = store.getters["conversionStore/getFiatRate"](item.saleData.fiatCurrency);
                let ethToBtc = store.getters["conversionStore/getCryptoRate"]("eth_btc");
                moneyUtils.convertPrices(item, blockchainItem, fiatRate, ethToBtc);
                if (item.bcitem.blockstackId && item.owner !== item.bcitem.blockstackId) {
                  item.owner = item.bcitem.blockstackId;
                }
              }
              commit("addItem", item);
            }
          },
          function(error) {
            console.log("Error fetching registered items: ", error);
          }
        );
      }
    }
  }
};
export default itemSearchStore;
