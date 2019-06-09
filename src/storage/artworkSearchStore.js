import artworkSearchService from "@/services/artworkSearchService";
import _ from "lodash";
import moneyUtils from "@/services/moneyUtils";
import store from "@/storage/store";

const artworkSearchStore = {
  namespaced: true,
  state: {
    searchResults: [],
    artworks: [],
    artists: []
  },
  getters: {
    getArtworks: state => {
      let registered = state.artworks;
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
      let registered = state.artworks.filter(
        artwork => artwork.bitcoinTx
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
      let status = store.state.constants.statuses.artwork.PURCHASE_BEGUN;
      registered = registered.filter(artwork => artwork.status !== status);
      return registered;
    },
    getRegisteredArtworks: state => {
      let registered = state.artworks.filter(
        artwork => artwork.bcitem && artwork.bcitem.itemIndex > -1
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
    getArtwork: state => id => {
      let artwork = state.artworks.find(artwork => artwork.id === id);
      if (artwork && artwork.id) {
        return artwork;
      } else {
        return {
          image: require("@/assets/img/missing/artwork-missing.jpg"),
        };
      }
    },
    getArtistsPage: state => {
      return state.artists;
    },
    homePageArtworks: (state, getters) => {
      let fb = store.state.constants.featureBitcoin;
      let registered;
      if (fb) {
        registered = getters.getArtworks;
      } else {
        registered = getters.getRegisteredArtworks;
      }
      return registered.slice(0, 6);
    },
    getArtworksPageArtworks: (state, getters) => {
      let registered = getters.getArtworks;
      return registered.slice(0, 9);
    },
    getArtworksByArtist: (state, getters) => username => {
      let artworks = [];
      let registered = getters.getArtworks;
      _.forEach(registered, function(artwork) {
        if (artwork.artist === username) {
          artworks.push(artwork);
        }
      });
      return artworks;
    },
    numberArtworks: state => {
      return state.artworks.length;
    },
    numberSearchResults: state => {
      return state.searchResults.length;
    }
  },
  mutations: {
    addArtwork(state, registeredArtwork) {
      let index = _.findIndex(state.artworks, function(o) {
        return o.id === registeredArtwork.id;
      });
      if (index === -1) {
        state.artworks.push(registeredArtwork);
      } else {
        state.artworks.splice(index, 1, registeredArtwork);
      }
    },
    addSearchResult(state, artwork) {
      let index = _.findIndex(state.searchResults, function(o) {
        return o.id === artwork.id;
      });
      if (index === -1) {
        state.searchResults.push(artwork);
      } else {
        state.searchResults.splice(index, 1, artwork);
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
    fetchArtworkByGallery({ commit }, data) {
      return new Promise(resolve => {
        let query = "(gallerist:" + data.query + " AND galleryId:" + data.galleryId + ")";
        artworkSearchService.newQuery(store, {field: "facet", query: query});
      });
    },

    fetchRegisteredArtworks({ commit }, blockchainItems) {
      // let blockchainItems = store.getters['ethStore/getBlockchainItems']
      let maximum = Math.min(blockchainItems.length, 20);
      let users = "";
      for (var index = 0; index < maximum; index++) {
        let blockchainItem = blockchainItems[index];
        if (users.indexOf(blockchainItem.blockstackId) === -1) {
          users += blockchainItem.blockstackId + ",";
        }
        artworkSearchService.userArtworks(store,
          {
            username: blockchainItem.blockstackId,
            title: blockchainItem.title
          },
          function(artwork) {
            if (artwork) {
              if (store.state.constants.featureEthereum) {
                let fiatRate = store.getters["conversionStore/getFiatRate"](artwork.saleData.fiatCurrency);
                let ethToBtc = store.getters["conversionStore/getCryptoRate"]("eth_btc");
                moneyUtils.convertPrices(artwork, blockchainItem, fiatRate, ethToBtc);
                if (artwork.bcitem.blockstackId && artwork.owner !== artwork.bcitem.blockstackId) {
                  artwork.owner = artwork.bcitem.blockstackId;
                }
              }
              commit("addArtwork", artwork);
            }
          },
          function(error) {
            console.log("Error fetching registered artworks: ", error);
          }
        );
      }
    }
  }
};
export default artworkSearchStore;
