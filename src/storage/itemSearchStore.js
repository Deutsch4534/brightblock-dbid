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
      let index = _.findIndex(state.searchResults, function(o) {
        return o.id === item.id;
      });
      if (index === -1) {
        state.searchResults.push(item);
      } else {
        state.searchResults.splice(index, 1, item);
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
            commit("addItem", item);
            resolve(item);
          });
        }
      });
    },
  }
};
export default itemSearchStore;
