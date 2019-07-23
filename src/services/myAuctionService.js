import { getFile, putFile } from "blockstack";
import moment from "moment";
import _ from "lodash";
import searchIndexService from "./searchIndexService";

const auctionsRootFileName = "auctions_v01.json";

const myAuctionService = {
  setAuctionsRootFile: function(rootFile) {
    return putFile(auctionsRootFileName, JSON.stringify(rootFile), {
      encrypt: false
    });
  },

  getAuctionsRootFile: function(success, failure) {
    getFile(auctionsRootFileName, { decrypt: false })
      .then(function(file) {
        if (!file) {
          var now = moment({}).valueOf();
          let newRootFile = {
            created: now,
            auctions: []
          };
          putFile(auctionsRootFileName, JSON.stringify(newRootFile), {
            encrypt: false
          }).then(function() {
            success(newRootFile);
          });
        } else {
          let rootFile = JSON.parse(file);
          if (rootFile.auctions) {
            rootFile.records = rootFile.auctions;
            rootFile.auctions = null;
            putFile(auctionsRootFileName, JSON.stringify(rootFile), {
              encrypt: false
            });
          } else if (!rootFile.records) {
            rootFile.records = [];
            putFile(auctionsRootFileName, JSON.stringify(rootFile), {
              encrypt: false
            });
          }
          success(rootFile);
        }
      })
      .catch(function() {
        failure({
          ERR_CODE: "AUCTIONS_1",
          message: "Error fetching auctions root file!"
        });
      });
  },

  placeSingleItemBid: function(bidData, success, failure) {
    myAuctionService.getAuctionsRootFile(function(rootFile) {
      if (!rootFile.bidding) {
        rootFile.bidding = [];
      }
      rootFile.bidding.push(bidData);
      myAuctionService.setAuctionsRootFile(rootFile).then(function() {
        success(rootFile);
      });
    },
    function() {
      failure({
        ERR_CODE: "AUCTIONS_2",
        message: "Error fetching auctions root file!"
      });
    });
  },

  getMyAuctions: function(success, failure) {
    myAuctionService.getAuctionsRootFile(
      function(rootFile) {
        success(rootFile.records);
      },
      function() {
        failure({
          ERR_CODE: "AUCTIONS_2",
          message: "Error fetching auctions root file!"
        });
      }
    );
  },

  getMyAuction: function(auctionId, success, failure) {
    myAuctionService.getAuctionsRootFile(
      function(rootFile) {
        let index = _.findIndex(rootFile.records, function(o) {
          return o.auctionId === auctionId;
        });
        success(rootFile.records[index]);
      },
      function() {
        failure({
          ERR_CODE: "AUCTIONS_3",
          message: "Error fetching auctions root file!"
        });
      }
    );
  },

  updateAuction: function(auction, success, failure) {
    myAuctionService.getAuctionsRootFile(
      function(rootFile) {
        let index = _.findIndex(rootFile.records, function(o) {
          return o.auctionId === auction.auctionId;
        });
        if (index > -1) {
          rootFile.records.splice(index, 1, auction);
          myAuctionService.setAuctionsRootFile(rootFile).then(function() {
            if (auction.privacy === "private") {
              searchIndexService.removeRecord("id", auction.auctionId);
            } else {
              searchIndexService.addRecord("auction", auction);
            }
            success(auction);
          });
        } else {
          failure({
            ERR_CODE: "AUCTIONS_2",
            message: "Not found: " + auction.auctionId
          });
        }
      },
      function(error) {
        failure(error);
      }
    );
  },

  deleteMyAuction: function(auctionId, success, failure) {
    myAuctionService.getAuctionsRootFile(
      function(rootFile) {
        let index = _.findIndex(rootFile.records, function(o) {
          return o.auctionId === auctionId;
        });
        if (index > -1) {
          rootFile.records.splice(index, 1);
          myAuctionService.setAuctionsRootFile(rootFile).then(function() {
            searchIndexService.removeRecord("id", auctionId).then(() => {
              success(auctionId);
            });
          });
        } else {
          failure({
            ERR_CODE: "AUCTIONS_2",
            message: "Not found: " + auctionId
          });
        }
      },
      function(error) {
        failure(error);
      }
    );
  },

  uploadAuction: function(auction, success, failure) {
    myAuctionService.getAuctionsRootFile(
      function(rootFile) {
        rootFile.records.splice(0, 0, auction);
        myAuctionService.setAuctionsRootFile(rootFile).then(function() {
          if (auction.privacy === "public") {
            searchIndexService.addRecord("auction", auction);
          }
          success(auction);
        });
      },
      function(error) {
        failure(error);
      }
    );
  },

  reindex: function(success, failure) {
    myAuctionService.getAuctionsRootFile(
      function() {
        searchIndexService.indexUser().then(message => {
          console.log(message);
          success(message);
        });
      },
      function() {
        failure({
          ERR_CODE: "AUCTIONS_10",
          message: "Error adding the auction to the public index!"
        });
      }
    );
  },

  makePublic: function(auction, success, failure) {
    auction.privacy = "public";
    myAuctionService.updateAuction(
      auction,
      function() {
        success("Auction is public");
      },
      function() {
        failure({
          ERR_CODE: "AUCTIONS_10",
          message: "Error adding the auction to the public index!"
        });
      }
    );
  },

  makePrivate: function(auction, success, failure) {
    auction.privacy = "private";
    myAuctionService.updateAuction(
      auction,
      function() {
        success("Auction is private");
      },
      function() {
        failure({
          ERR_CODE: "AUCTIONS_11",
          message: "Error removing the auction from the public index!"
        });
      }
    );
  }
};
export default myAuctionService;
