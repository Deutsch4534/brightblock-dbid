import { getFile, putFile } from "blockstack";
import settings from "./settings";
import _ from "lodash";
import utils from "./utils";
import searchIndexService from "./searchIndexService";
import artworkSearchService from "./artworkSearchService";
import moment from "moment";

const myArtworksService = {
  addSaleHistory: function(artwork, assetHash, buyerChainData) {
    if (!artwork.saleHistories) {
      artwork.saleHistories = [];
    }
    let sh = _.find(artwork.saleHistories, function(o) {
      return o.assetHash === assetHash;
    });
    if (!sh) {
      artwork.saleHistories.splice(0, 0, {
        seller: artwork.owner,
        buyer: artwork.buyer,
        assetHash: assetHash,
        buyerChainData: buyerChainData
      });
    }
  },
  addSaleHistoryPaySellerData: function(artwork, buyersTxid, sellersTxid) {
    if (!artwork.saleHistories) {
      artwork.saleHistories = [];
    }
    let sh = _.find(artwork.saleHistories, function(o) {
      return o.buyersTxid === buyersTxid;
    });
    if (!sh) {
      throw new Error("Missing sale history?");
    }
    sh.sellersTxid = sellersTxid;
  },

  initBlockstackRootFile: function() {
    const artworkRootFileName = settings.artworkRootFileName;
    var now = moment({}).valueOf();
    let newRootFile = {
      created: now,
      profile: {},
      records: []
    };
    return putFile(artworkRootFileName, JSON.stringify(newRootFile), {
      encrypt: false
    });
  },

  getMyArtworks: function(myProfile, success, failure) {
    artworkSearchService.queryByOwner(myProfile.username,
      function(searchResults) {
        myArtworksService.getMyArtworksCont(myProfile, searchResults, success, failure);
      },
      function(err) {
        console.log(err);
      }
    );
  },

  getMyArtworksCont: function(myProfile, searchResults, success, failure) {
    const artworkRootFileName = settings.artworkRootFileName;
    getFile(artworkRootFileName, { decrypt: false })
      .then(function(file) {
        if (!file) {
          myArtworksService.initBlockstackRootFile();
        } else {
          let blockstackRootFile = JSON.parse(file);
          let usersToFetch = [];
          _.forEach(blockstackRootFile.records, function(indexData) {
            try {
              if (!indexData.uploader) {
                indexData.uploader = myProfile.username;
              }
              let searchResult = _.find(searchResults, function(o) {
                return Number(o.id) === indexData.id;
              });
              if (searchResult) {
                indexData.buyer = searchResult.buyer;
                indexData.status = searchResult.status;
              }
              myArtworksService.addUserOrNot(usersToFetch, indexData.uploader);
              myArtworksService.addUserOrNot(usersToFetch, indexData.owner);
              myArtworksService.fetchMyProvenanceFile(
                indexData,
                success,
                failure
              );
            } catch (err) {
              console.log(err);
            }
          });
        }
      })
      .catch(function() {
        failure({
          ERR_CODE: 101,
          message: "Error getting my artworks: artworkRootFileName=" + artworkRootFileName
        });
      });
  },

  addUserOrNot: function(usersToFetch, userId) {
    let uIndex = _.findIndex(usersToFetch, function(o) {
      return o === userId;
    });
    if (uIndex === -1) {
      usersToFetch.push(userId);
    }
  },

  getMyArtwork: function(artworkId, success, failure) {
    const artworkRootFileName = settings.artworkRootFileName;
    getFile(artworkRootFileName, { decrypt: false })
      .then(function(file) {
        if (!file) {
          myArtworksService.initBlockstackRootFile();
          success();
        } else {
          let blockstackRootFile = JSON.parse(file);
          let usersToFetch = [];
          let index = _.index(blockstackRootFile.records, function(artwork) {
            return artworkId === artwork.id;
          });
          if (!index) {
            success();
          } else {
            let indexData = blockstackRootFile.records[index];
            myArtworksService.addUserOrNot(usersToFetch, indexData.uploader);
            myArtworksService.addUserOrNot(usersToFetch, indexData.owner);
            myArtworksService.fetchMyProvenanceFile(
              indexData,
              success,
              failure
            );
          }
        }
      })
      .catch(function() {
        failure({
          ERR_CODE: 101,
          message: "Error getting my artwork: artworkRootFileName=" + artworkRootFileName + " artworkId=" + artworkId
        });
      });
  },

  transferArtwork: function(artwork, success, failure) {
    myArtworksService.uploadOrTransferArtwork(artwork, success, failure);
  },

  uploadArtwork: function(artwork, success, failure) {
    artwork.id = moment({}).valueOf();
    artwork.lastUpdate = artwork.id;
    artwork.bcitem = {
      status: "new",
      itemIndex: -1
    };
    myArtworksService.uploadOrTransferArtwork(artwork, success, failure);
    /**
    let timestamp = (artwork.timestamp) ? artwork.timestamp : utils.buildArtworkHashFromArtwork(artwork);
    let sameArtwork = store.getters["myArtworksStore/myArtworkByTimestamp"](timestamp);
    if (!sameArtwork) {
      myArtworksService.uploadOrTransferArtwork(artwork, success, failure);
    } else {
      Vue.notify({
        title: 'Error Uploading Artwork',
        text: 'Artwork has already been uploaded!',
        type: 'warn'
      });
    }
    **/
  },

  uploadOrTransferArtwork: function(artwork, success, failure) {
    let artworkRootFileName = settings.artworkRootFileName;
    getFile(artworkRootFileName, { decrypt: false })
      .then(function(file) {
        if (!file) {
          myArtworksService.initBlockstackRootFile().then(function(file) {
            myArtworksService.uploadProvenanceFile(artworkRootFileName,file,artwork,success,failure);
          });
        } else {
          myArtworksService.uploadProvenanceFile(artworkRootFileName,file,artwork,success,failure);
        }
      })
      .catch(function() {
        failure({
          ERR_CODE: 2,
          message:
            "no root blockstack fole found for file name: " +
            artworkRootFileName
        });
      });
  },

  uploadProvenanceFile: function(artworkRootFileName, file, artwork, success, failure) {
    let blockstackRootFile = file;
    if (typeof file === "string") {
      blockstackRootFile = JSON.parse(file);
    }
    let gaiaFileName = settings.gaiaFileName;
    let provFile = gaiaFileName + artwork.id + ".json";
    let record = utils.convertToBlockstack(artwork);
    let index = _.findIndex(blockstackRootFile.records, function(o) {
      return o.id === artwork.id;
    });
    if (index < 0) {
      blockstackRootFile.records.splice(0, 0, record.indexData);
    } else {
      blockstackRootFile.records.splice(index, 1, record.indexData);
    }
    putFile(artworkRootFileName, JSON.stringify(blockstackRootFile), {
      encrypt: false
    })
      .then(function() {
        putFile(provFile, JSON.stringify(record.provData), { encrypt: false })
          .then(function() {
            searchIndexService.addRecord("artwork", record.indexData);
            success(utils.convertFromBlockstack(record));
          })
          .catch(function() {
            failure({
              ERR_CODE: 2,
              message: "Error saving provenance file: " + artwork.id
            });
          });
      })
      .catch(function() {
        failure({
          ERR_CODE: 3,
          message: "Error uploading artwork: " + artwork.id
        });
      });
  },

  updateArtwork: function(artwork, reindex, updateProvData, success, failure) {
    let artworkRootFileName = settings.artworkRootFileName;
    let gaiaFileName = settings.gaiaFileName;
    let provFile = gaiaFileName + artwork.id + ".json";
    var now = moment({}).valueOf();
    artwork.lastUpdate = now;
    if (!artwork.bcitem) {
      // for backwards compat with items created before this object was added.
      artwork.bcitem = {
        status: "new",
        itemIndex: -1
      };
    }
    searchIndexService.removeRecord("id", artwork.id).then(function() {
      let record = utils.convertToBlockstack(artwork);
      getFile(artworkRootFileName, { decrypt: false })
        .then(function(file) {
          if (!file) {
            failure({ ERR_CODE: 1, message: "no artworks found" });
          } else {
            let blockstackRootFile = JSON.parse(file);
            let index = _.findIndex(blockstackRootFile.records, function(o) {
              return o.id === artwork.id;
            });
            if (index < 0 || index >= blockstackRootFile.records.length) {
              failure({ERR_CODE: 2, message: "Unable to find index data in record."});
            } else {
              blockstackRootFile.records[index] = record.indexData;
              putFile(artworkRootFileName, JSON.stringify(blockstackRootFile), {encrypt: false}).then(function() {
                if (updateProvData) {
                  putFile(provFile, JSON.stringify(record.provData), {encrypt: false}).then(function() {
                    success(utils.convertFromBlockstack(record));
                    if (reindex) searchIndexService.addRecord("artwork", record.indexData);
                  })
                    .catch(function() {
                      failure({
                        ERR_CODE: 3,
                        message: "Error saving provenance file: " + artwork.id
                      });
                    });
                } else {
                  success(utils.convertFromBlockstack(record));
                  if (reindex) searchIndexService.addRecord("artwork", record.indexData);
                }
              })
                .catch(function() {
                  failure({
                    ERR_CODE: 4,
                    message: "Error uploading artwork: " + artwork.id
                  });
                });
            }
          }
        })
        .catch(function() {
          failure({ ERR_CODE: 5, message: "no artworks found" });
        });
    });
  },

  fetchMyProvenanceFile: function(indexData, success, failure) {
    let gaiaFileName = settings.gaiaFileName;
    let fileToFetch = gaiaFileName + indexData.id + ".json";
    getFile(fileToFetch, { decrypt: false })
      .then(function(file) {
        if (file) {
          try {
            let provData = JSON.parse(file);
            provData.id = indexData.id;
            success(utils.convertFromBlockstack({indexData: indexData, provData: provData}));
          } catch (err) {
            console.error("Corrupt json file - skipping! file: " + file, err);
          }
        } else {
          success(utils.convertFromBlockstack({indexData: indexData, provData: {}}));
        }
      })
      .catch(function(e) {
        failure({
          ERR_CODE: 2,
          message: "Error fetching provenance file found: ",
          exception: e
        });
      });
  },

  deleteMyArtwork: function(id, success, failure) {
    const artworkRootFileName = settings.artworkRootFileName;
    const gaiaFileName = settings.gaiaFileName;
    getFile(artworkRootFileName, { decrypt: false })
      .then(function(file) {
        if (!file) {
          failure({
            ERR_CODE: 1,
            message: "No artworks found to delete from: " + id
          });
        } else {
          let blockstackRootFile = JSON.parse(file);
          console.log(
            "blockstackRootFile length before: " +
              blockstackRootFile.records.length
          );
          let index = _.findIndex(blockstackRootFile.records, function(o) {
            return o.id === id;
          });
          if (index < 0) {
            failure({
              ERR_CODE: 2,
              message: "no artwork in blockstack root file: " + id
            });
            return;
          }
          let artwork = blockstackRootFile.records[index];
          if (artwork.saleData.auctionId) {
            failure({
              ERR_CODE: 3,
              message:
                "This artwork is listed in auction: " +
                artwork.saleData.auctionId +
                " please remember to remove it.."
            });
            return;
          }
          let deletedRecord = blockstackRootFile.records.splice(index, 1);
          console.log("blockstackRootFile length after: " + blockstackRootFile.records.length +
              " index=" + index);
          let fileToDelete = gaiaFileName + id + ".json";
          putFile(
            fileToDelete,
            JSON.stringify({ deleted: true, reason: "deleted by user" }),
            { encrypt: false }
          )
            .then(function() {
              putFile(artworkRootFileName, JSON.stringify(blockstackRootFile), {
                encrypt: false
              })
                .then(function() {
                  searchIndexService.removeRecord("id", id);
                  success({
                    id: id,
                    title: deletedRecord.title,
                    message: "Removed from user storage and the search index."
                  });
                })
                .catch(function(e) {
                  console.log(
                    "Unable to create provenance record in user gaia storage: ",
                    e
                  );
                  failure({
                    ERR_CODE: 3,
                    message: "Error saving updated blockstack root file: " + id
                  });
                });
            })
            .catch(function() {
              failure({
                ERR_CODE: 4,
                message: "Error trying to delete: " + id
              });
            });
        }
      })
      .catch(function() {
        failure({ ERR_CODE: 5, message: "no artworks found" });
      });
  }
};
export default myArtworksService;
