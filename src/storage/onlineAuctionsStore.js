// myArtworksStore.js
import auctionSearchService from "@/services/auctionSearchService";
import searchIndexService from "@/services/searchIndexService";
import biddingUtils from "@/services/biddingUtils";
import _ from "lodash";
import store from "@/storage/store";

const onlineAuctionsStore = {
  namespaced: true,
  state: {
    onlineAuctions: [],
    onlinePeers: []
  },
  getters: {
    auctionItem: state => (auctionId, itemId) => {
      let index = _.findIndex(state.onlineAuctions, function(o) {
        return o.auctionId === auctionId;
      });
      let auction = state.onlineAuctions[index];
      if (auction) {
        index = _.findIndex(auction.items, function(o) {
          return o.itemId === itemId;
        });
        return auction.items[index];
      }
    },
    onlineAuction: state => auctionId => {
      let onlineAuctions = state.onlineAuctions.filter(
        auction => auction.auctionId === auctionId
      );
      if (onlineAuctions && onlineAuctions.length > 0) {
        return onlineAuctions[0];
      }
    },
    getPeers: state => {
      return state.onlinePeers;
    },
    getPeer: state => username => {
      let peers = state.onlinePeers.filter(peer => peer.username === username);
      if (peers && peers.length > 0) {
        return peers[0];
      } else {
        return {};
      }
    },
    getWinning: (state, getters) => data => {
      let winning = [];
      try {
        let auction = getters.onlineAuction(data.auctionId);
        for (var key in auction.items) {
          try {
            let item = auction.items[key];
            let currentHighestBid = item.bids[item.bids.length - 1];
            if (currentHighestBid.bidder === data.username) {
              winning.push(item);
            }
          } catch (err) {
            // no bids..
          }
        }
      } catch (err) {
        // no bids..
      }
      return winning;
    },
    getAdministrator: (state, getters) => auctionId => {
      let auction = getters.onlineAuction(auctionId);
      if (auction) {
        let peer = getters.getPeer(auction.administrator);
        return peer;
      } else {
        return {};
      }
    },
    onlineAuctions: state => {
      // let serverTime = store.getters["serverTime"];
      let now = new Date().getTime();
      let auctions = state.onlineAuctions.filter(
        auction => auction.startDate > now
      );
      return auctions;
    },
    webcastAuctions: state => {
      // let serverTime = store.getters["serverTime"];
      let now = new Date().getTime();
      let auctions = state.onlineAuctions.filter(
        auction => auction.startDate > now && auction.auctionType === "webcast"
      );
      return auctions;
    },
    timedAuctions: state => {
      // let serverTime = store.getters["serverTime"];
      let now = new Date().getTime();
      let auctions = state.onlineAuctions.filter(
        auction => auction.startDate > now && auction.auctionType === "timed"
      );
      return auctions;
    },
    sealedAuctions: state => {
      let auctions = state.onlineAuctions.filter(
        auction => auction.auctionType === "sealed"
      );
      return auctions;
    },
    pastAuctions: state => {
      // let serverTime = store.getters["serverTime"];
      let now = new Date().getTime();
      let auctions = state.onlineAuctions.filter(
        auction => auction.startDate < now
      );
      return auctions;
    },
    messages: state => auctionId => {
      let auction = state.onlineAuctions.filter(
        auction => auction.auctionId === auctionId
      )[0];
      if (auction) {
        return auction.messages;
      } else {
        return [];
      }
    }
  },
  mutations: {
    messageEvent(state, data) {
      let auctionId = data.auctionId;
      let auction = state.onlineAuctions.filter(
        auction => auction.auctionId === auctionId
      )[0];
      if (!auction) return;
      if (!auction.messages) {
        auction.messages = [];
      }
      auction.messages.splice(0, 0, data);
      store.commit("onlineAuctionsStore/onlineAuction", auction);
    },

    activateItemEvent(state, data) {
      let auction = state.onlineAuctions.filter(
        auction => auction.auctionId === data.auctionId
      )[0];
      if (!auction) return;
      biddingUtils.makeItemActive(auction, data.itemId);
      store.commit("onlineAuctionsStore/onlineAuction", auction);
    },

    receiveBidEvent(state, data) {
      let auction = state.onlineAuctions.filter(
        auction => auction.auctionId === data.auctionId
      )[0];
      if (!auction) return;
      biddingUtils.addBid(auction, data.itemId, data.bid);
      store.commit("onlineAuctionsStore/onlineAuction", auction);
    },

    sellItemEvent(state, data) {
      let auction = state.myAuctions.filter(
        auction => auction.auctionId === data.auctionId
      )[0];
      let index = _.findIndex(auction.items, function(o) {
        return o.itemId === data.itemId;
      });
      auction.items[index].sellingStatus = "selling";
      auction.items[index].paused = true;
      store.commit("onlineAuctionsStore/onlineAuction", auction);
    },

    pauseItemEvent(state, data) {
      let auctionId = data.auctionId;
      let auction = state.onlineAuctions.filter(
        auction => auction.auctionId === auctionId
      )[0];
      if (!auction) {
        console.log(
          "Auction not found - this means the logged in user is the administrator and the auction has already been updated in myAuctionStore."
        );
        return;
      }
      biddingUtils.pauseBidding(auction, data.itemId);
      store.commit("onlineAuctionsStore/onlineAuction", auction);
    },

    unpauseItemEvent(state, data) {
      let auctionId = data.auctionId;
      let auction = state.onlineAuctions.filter(
        auction => auction.auctionId === auctionId
      )[0];
      if (!auction) {
        console.log(
          "Auction not found - this means the logged in user is the administrator and the auction has already been updated in myAuctionStore."
        );
        return;
      }
      biddingUtils.unpauseBidding(auction, data.itemId);
      store.commit("onlineAuctionsStore/onlineAuction", auction);
    },

    newPeer(state, data) {
      let index = _.findIndex(state.onlinePeers, function(o) {
        return o.username === data.username;
      });
      if (index === -1) {
        state.onlinePeers.splice(0, 0, data);
      }
    },

    farewellPeer(state, data) {
      let index = _.findIndex(state.onlinePeers, function(o) {
        return o.username === data.username;
      });
      if (index > -1) {
        state.onlinePeers.splice(index, 1);
      }
    },

    onlineAuctions(state, auctions) {
      if (auctions) {
        for (var key in auctions) {
          store.commit("onlineAuctionsStore/onlineAuction", auctions[key]);
        }
      }
    },

    onlineAuction(state, auction) {
      if (!auction || auction.privacy === "private") return;
      let index = _.findIndex(state.onlineAuctions, function(o) {
        return o.auctionId === auction.auctionId;
      });
      if (index === -1) {
        state.onlineAuctions.splice(0, 0, auction);
      } else {
        state.onlineAuctions.splice(index, 1, auction);
      }
    }
  },
  actions: {
    fetchUserAuctions({ commit }, data) {
      return new Promise(resolve => {
        auctionSearchService
          .getUsersOnlineAuction(data.username)
          .then(userAuctions => {
            commit("onlineAuctions", userAuctions);
            resolve(userAuctions);
          });
      });
    },
    fetchOnlineAuction({ commit }, auctionId) {
      return new Promise((resolve, reject) => {
        let auction = store.getters["onlineAuctionsStore/onlineAuction"](
          auctionId
        );
        if (auction) {
          resolve(auction);
        } else {
          let domain = location.hostname;
          searchIndexService
            .searchDappsIndex(domain, "auction", "id", auctionId)
            .then(auctionsFromSearch => {
              if (auctionsFromSearch && auctionsFromSearch.length === 1) {
                auctionSearchService
                  .getUsersOnlineAuction(auctionsFromSearch[0].owner)
                  .then(auctionsFromUserStorage => {
                    if (auctionsFromUserStorage) {
                      commit("onlineAuctions", auctionsFromUserStorage);
                      let index = _.findIndex(auctionsFromUserStorage, function(
                        o
                      ) {
                        return o.auctionId === auctionId;
                      });
                      if (index > -1) {
                        resolve(auctionsFromUserStorage[index]);
                      } else {
                        resolve();
                      }
                    } else {
                      commit("onlineAuction", auctionsFromSearch[0]);
                      resolve(auctionsFromSearch[0]);
                    }
                  });
              } else {
                resolve();
              }
            });
        }
      });
    },
    fetchOnlineAuctions({ commit }) {
      return new Promise(resolve => {
        let domain = location.hostname;
        searchIndexService
          .searchDappsIndex(domain, "auction", "title", "*")
          .then(auctionsFromSearch => {
            // commit('onlineAuctions', auctionsFromSearch)
            for (var key in auctionsFromSearch) {
              auctionSearchService
                .getUsersOnlineAuction(auctionsFromSearch[key].owner)
                .then(auctionsFromUserStorage => {
                  if (auctionsFromUserStorage) {
                    commit("onlineAuctions", auctionsFromUserStorage);
                  }
                });
            }
            resolve(auctionsFromSearch);
          });
      });
    }
  }
};
export default onlineAuctionsStore;
