import itemSearchService from "@/services/itemSearchService";
import _ from "lodash";
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
        if (!b.updated) {
          return -1;
        }
        if (a.updated > b.updated) {
          return -1;
        }
        if (a.updated < b.updated) {
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
        if (a.updated > b.updated) {
          return -1;
        }
        if (a.updated < b.updated) {
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
        if (a.updated > b.updated) {
          return -1;
        }
        if (a.updated < b.updated) {
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
        if (a.updated > b.updated) {
          return -1;
        }
        if (a.updated < b.updated) {
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
    getItemsByOwner: (state, getters) => username => {
      let items = [];
      let registered = getters.getItems;
      _.forEach(registered, function(item) {
        if (item.owner === username) {
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
    addItem(state, item) {
      let index = _.findIndex(state.items, function(o) {
        return o.id === item.id;
      });
      if (index === -1) {
        state.items.push(item);
      } else {
        state.items.splice(index, 1, item);
      }
    },
    addSearchResult(state, item) {
      if (item && typeof item.id === "string") {
        item.id = Number(item.id);
      }
      let index = _.findIndex(state.searchResults, function(o) {
        return o.id === item.id;
      });
      if (!item.images) {
        item.images = [];
        let image = {
          dataUrl: require("@/assets/img/logo/dB_256x256_light_transparent.png"),
          saleData: {
            soid: 0
          }
        };
        item.images.push(image);
      }
      if (!item.saleData) {
        item.saleData = {
          soid: 0,
          fiatCurrency: "EUR"
        };
      }
      if (index === -1) {
        state.searchResults.push(item);
      } else {
        state.searchResults.splice(index, 1, item);
      }
    },
    clearSearchResults(state, query) {
      if (query && query.field === "facet" && query.query !== "*") {
        state.searchResults = [];
      }
    }
  },
  actions: {
    fetchItems({ commit }, data) {
      return new Promise(resolve => {
        itemSearchService.newQuery(store, data);
      });
    },

    searchItems({ commit }, data) {
      return new Promise(resolve => {
        itemSearchService.newQuery(store, data);
      });
    },

    fetchItem({ commit, getters }, itemId) {
      return new Promise(resolve => {
        let item = getters["getItem"](itemId);
        if (item) {
          resolve(item);
        } else {
          itemSearchService.newQuery(store, {field: "id", query: itemId}, function(item) {
            if (item) {
              commit("addItem", item);
              resolve(item);
            } else {
              resolve();
            }
          }, function(e) {
            console.log(e);
            resolve();
          });
        }
      });
    },
  }
};
export default itemSearchStore;
