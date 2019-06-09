// myArtworksStore.js
import _ from "lodash";
import notify from "@/notify";
import biddingUtils from "@/services/biddingUtils";
import myAuctionsService from "@/services/myAuctionsService";
import peerToPeerService from "@/services/peerToPeerService";
import store from "@/storage/store";
import moment from "moment";

const myAuctionsStore = {
  namespaced: true,
  state: {
    myAuctions: []
  },
  getters: {
    myAuctionsPastCount: state => {
      let now = moment({});
      return state.myAuctions.filter(auction =>
        moment(auction.startDate).isBefore(now)
      ).length;
    },
    myAuctionsPast: state => {
      let now = moment({});
      return state.myAuctions.filter(auction =>
        moment(auction.startDate).isBefore(now)
      );
    },
    myAuctionsByType: state => atype => {
      // let serverTime = store.getters["serverTime"];
      let now = new Date().getTime();
      let auctions = state.onlineAuctions.filter(
        auction => auction.startDate > now && auction.auctionType === atype
      );
      return auctions;
    },
    myAuctionsFuture: state => {
      let now = moment({});
      return state.myAuctions.filter(auction =>
        moment(auction.startDate).isAfter(now)
      );
    },
    myAuctionsFutureCount: state => {
      let now = moment({});
      return state.myAuctions.filter(auction =>
        moment(auction.startDate).isAfter(now)
      ).length;
    },
    myAuction: state => auctionId => {
      if (!auctionId) {
        return;
      }
      let userProfile = store.getters["myAccountStore/getMyProfile"];
      let myAuctions = state.myAuctions.filter(
        auction => auction.auctionId === auctionId
      );
      if (myAuctions && myAuctions.length > 0) {
        let auction = myAuctions[0];
        if (auction.administrator === userProfile.username) {
          return auction;
        }
      }
    },
    myAuctionItem: state => (auctionId, itemId) => {
      let auction = state.myAuctions.find(
        auction => auction.auctionId === auctionId
      );
      let index = _.findIndex(auction.items, function(o) {
        return o.itemId === itemId;
      });
      if (index > -1) {
        return auction.items[index];
      }
    }
  },
  mutations: {
    messageEvent(state, data) {
      let auction = state.myAuctions.filter(
        auction => auction.auctionId === data.auctionId
      )[0];
      if (!auction) {
        console.log(
          "Auction for id: " +
            data.auctionId +
            " is not in the store. This is expected if this user is not the auction administrator."
        );
        return;
      }
      if (!auction.messages) {
        auction.messages = [];
      }
      auction.messages.splice(0, 0, data);
      store.commit("myAuctionsStore/addMyAuction", auction);
      data.peer = store.getters["onlineAuctionsStore/getAdministrator"](data.auctionId);
      store.dispatch("myAuctionsStore/updateAuction", auction).then(() => {
        peerToPeerService.sendPeerSignal({
          type: "wa-message-update",
          data: data
        });
      });
    },

    sendBidEvent(state, data) {
      let auction = state.myAuctions.filter(
        auction => auction.auctionId === data.auctionId
      )[0];
      if (!auction) {
        return;
      }
      biddingUtils.addBid(auction, data.itemId, data.bid);
      store.dispatch("myAuctionsStore/updateAuction", auction).then(() => {
        let myProfile = store.getters["myAccountStore/getMyProfile"];
        data.username = myProfile.username;
        data.peer = store.getters["onlineAuctionsStore/getAdministrator"](data.auctionId);
        peerToPeerService.sendPeerSignal({
          type: "wa-bid-receive",
          data: data
        });
      });
    },

    sellItemEvent(state, data) {
      let auction = state.myAuctions.filter(
        auction => auction.auctionId === data.auctionId
      )[0];
      let index = _.findIndex(auction.items, function(o) {
        return o.itemId === data.itemId;
      });
      auction.items[index].sellingStatus = "sold";
      auction.items[index].paused = true;
      auction.items[index].finished = true;
      data.peer = store.getters["onlineAuctionsStore/getAdministrator"](data.auctionId);
      store.dispatch("myAuctionsStore/updateAuction", auction).then(() => {
        peerToPeerService.sendPeerSignal({
          type: "wa-item-selling",
          data: data
        });
      });
    },

    pauseItemEvent(state, data) {
      let auction = state.myAuctions.filter(
        auction => auction.auctionId === data.auctionId
      )[0];
      biddingUtils.pauseBidding(auction, data.itemId);
      store.dispatch("myAuctionsStore/updateAuction", auction).then(() => {
        peerToPeerService.sendPeerSignal({
          type: "wa-item-pause",
          data: data
        });
      });
    },

    unpauseItemEvent(state, data) {
      let auction = state.myAuctions.filter(
        auction => auction.auctionId === data.auctionId
      )[0];
      biddingUtils.unpauseBidding(auction, data.itemId);
      store.dispatch("myAuctionsStore/updateAuction", auction).then(() => {
        data.peer = store.getters["onlineAuctionsStore/getAdministrator"](data.auctionId);
        peerToPeerService.sendPeerSignal({
          type: "wa-item-unpause",
          data: data
        });
      });
    },

    myAuctions(state, auctions) {
      state.myAuctions = auctions;
    },

    addMyAuction(state, auction) {
      let index = _.findIndex(state.myAuctions, function(o) {
        return o.auctionId === auction.auctionId;
      });
      if (index === -1) {
        state.myAuctions.splice(0, 0, auction);
      } else {
        state.myAuctions.splice(index, 1, auction);
      }
    }
  },
  actions: {
    deleteMyAuction({ commit, state }, auctionId) {
      myAuctionsService.deleteMyAuction(
        auctionId,
        function(result) {
          let myAuctions = state.myAuctions;
          let index = _.findIndex(myAuctions, function(o) {
            return o.auctionId === result.auctionId;
          });
          myAuctions.splice(index, 1);
          commit("myAuctions", myAuctions);
          notify.info({ title: "Delete Auction.", text: result.message });
        },
        function(error) {
          notify.error({
            title: "Delete Auction.",
            text: "Error deleting your auction: <br>" + error.message
          });
          console.log("Error deleting auction.", error);
        }
      );
    },

    addItem({ commit, state }, artwork) {
      return new Promise((resolve, reject) => {
        if (!artwork.saleData.auctionId) {
          reject(
            new Error(
              "No auctionId found on the item - cannot add it to an auction it is not part of?"
            )
          );
        }
        let auction = state.myAuctions.filter(
          auction => auction.auctionId === artwork.saleData.auctionId
        )[0];
        if (!auction.items) {
          auction.items = [];
        }
        let index = _.findIndex(auction.items, function(o) {
          return o.itemId === artwork.id;
        });
        if (index > -1) {
          resolve(auction);
        } else {
          let auctionItem = {
            itemId: artwork.id,
            owner: artwork.owner,
            fiatCurrency: artwork.saleData.fiatCurrency,
            increment: artwork.saleData.increment,
            reserve: artwork.saleData.reserve,
            bids: []
          };
          auction.items.push(auctionItem);
          commit("addMyAuction", auction);
          store
            .dispatch("myAuctionsStore/updateAuction", auction)
            .then(auction => {
              let myProfile = store.getters["myAccountStore/getMyProfile"];
              peerToPeerService.sendPeerSignal({
                type: "wa-auction-update",
                data: {
                  username: myProfile.username,
                  auctionId: auction.auctionId,
                  peer: store.getters["onlineAuctionsStore/getAdministrator"](auction.auctionId)
                }
              });
              resolve(auction);
            });
        }
      });
    },

    removeItem({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        if (!data.auctionId) {
          reject(
            new Error(
              "No auctionId found on the item - cannot remove an item from an auction it is not part of?"
            )
          );
        }
        let auction = state.myAuctions.filter(
          auction => auction.auctionId === data.auctionId
        )[0];
        if (!auction) {
          auction = {};
        }
        if (!auction.items) {
          auction.items = [];
        }
        let index = _.findIndex(auction.items, function(o) {
          return o.itemId === data.itemId;
        });
        if (index > -1) {
          auction.items.splice(index, 1);
          commit("addMyAuction", auction);
          store
            .dispatch("myAuctionsStore/updateAuction", auction)
            .then(auction => {
              let myProfile = store.getters["myAccountStore/getMyProfile"];
              peerToPeerService.sendPeerSignal({
                type: "wa-auction-update",
                data: {
                  username: myProfile.username,
                  auctionId: auction.auctionId,
                  peer: store.getters["onlineAuctionsStore/getAdministrator"](auction.auctionId)
                }
              });
              resolve(auction);
            });
        } else {
          resolve({});
        }
      });
    },

    fetchMyAuctions({ commit }) {
      myAuctionsService.getMyAuctions(
        function(auctions) {
          commit("myAuctions", auctions);
        },
        function(error) {
          console.log("Error fetching auction: ", error);
        }
      );
    },

    fetchMyAuction({ commit, state }, auctionId) {
      return new Promise(resolve => {
        let auctions = state.myAuctions.filter(
          auction => auction.auctionId === auctionId
        );
        if (auctions.length === 1) {
          resolve(auctions[0]);
        } else {
          myAuctionsService.getMyAuction(
            auctionId,
            function(auction) {
              commit("addMyAuction", auction);
              resolve(auction);
            },
            function(error) {
              console.log(error);
              resolve();
            }
          );
        }
      });
    },

    makePublic({ commit }, auction) {
      return new Promise(resolve => {
        myAuctionsService.makePublic(
          auction,
          function(auction) {
            commit("addMyAuction", auction);
            resolve(auction);
          },
          function(error) {
            console.log("Error uploading auction: ", error);
            resolve();
          }
        );
      });
    },

    makePrivate({ commit }, auction) {
      return new Promise(resolve => {
        myAuctionsService.makePrivate(
          auction,
          function(auction) {
            commit("addMyAuction", auction);
            resolve(auction);
          },
          function(error) {
            console.log("Error uploading auction: ", error);
            resolve();
          }
        );
      });
    },

    uploadAuction({ commit }, auction) {
      return new Promise(resolve => {
        myAuctionsService.uploadAuction(
          auction,
          function(auction) {
            commit("addMyAuction", auction);
            resolve(auction);
          },
          function(error) {
            console.log("Error uploading auction: ", error);
            resolve();
          }
        );
      });
    },

    updateAuction({ commit }, auction) {
      return new Promise(resolve => {
        myAuctionsService.updateAuction(
          auction,
          function(auction) {
            commit("addMyAuction", auction);
            resolve(auction);
          },
          function(error) {
            console.log("Error uploading auction: ", error);
            resolve();
          }
        );
      });
    }
  }
};
export default myAuctionsStore;
