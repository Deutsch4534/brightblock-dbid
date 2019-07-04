import { getFile, putFile } from "blockstack";
import _ from "lodash";
import utils from "./utils";
import searchIndexService from "./searchIndexService";
import itemSearchService from "./itemSearchService";
import moment from "moment";

const itemRootFileName = "items_v01.json";
const itemFileName = "item_";

const myItemService = {
  addSaleHistory: function(item, assetHash, buyerChainData) {
    if (!item.saleHistories) {
      item.saleHistories = [];
    }
    let sh = _.find(item.saleHistories, function(o) {
      return o.assetHash === assetHash;
    });
    if (!sh) {
      item.saleHistories.splice(0, 0, {
        seller: item.owner,
        buyer: item.buyer,
        assetHash: assetHash,
        buyerChainData: buyerChainData
      });
    }
  },
  addSaleHistoryPaySellerData: function(item, buyersTxid, sellersTxid) {
    if (!item.saleHistories) {
      item.saleHistories = [];
    }
    let sh = _.find(item.saleHistories, function(o) {
      return o.buyersTxid === buyersTxid;
    });
    if (!sh) {
      throw new Error("Missing sale history?");
    }
    sh.sellersTxid = sellersTxid;
  },

  initBlockstackRootFile: function() {
    var now = moment({}).valueOf();
    let newRootFile = {
      created: now,
      profile: {},
      records: []
    };
    return putFile(itemRootFileName, JSON.stringify(newRootFile), {
      encrypt: false
    });
  },

  getMyItems: function(myProfile, success, failure) {
    itemSearchService.queryByOwner(myProfile.username,
      function(searchResults) {
        myItemService.getMyItemsCont(myProfile, searchResults, success, failure);
      },
      function(err) {
        console.log(err);
      }
    );
  },

  getMyItemsCont: function(myProfile, searchResults, success, failure) {
    getFile(itemRootFileName, { decrypt: false })
      .then(function(file) {
        if (!file) {
          myItemService.initBlockstackRootFile();
        } else {
          let blockstackRootFile = JSON.parse(file);
          let usersToFetch = [];
          _.forEach(blockstackRootFile.records, function(indexData) {
            try {
              let searchResult = _.find(searchResults, function(o) {
                return Number(o.id) === indexData.id;
              });
              if (searchResult) {
                indexData.buyer = searchResult.buyer;
                indexData.status = searchResult.status;
              }
              myItemService.addUserOrNot(usersToFetch, indexData.owner);
              myItemService.fetchMyProvenanceFile(
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
          message: "Error getting my items: itemRootFileName=" + itemRootFileName
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

  getMyItem: function(itemId, success, failure) {
    getFile(itemRootFileName, { decrypt: false })
      .then(function(file) {
        if (!file) {
          myItemService.initBlockstackRootFile();
          success();
        } else {
          let blockstackRootFile = JSON.parse(file);
          let usersToFetch = [];
          let index = _.findIndex(blockstackRootFile.records, function(item) {
            return item.id === itemId;
          });
          if (index < 0) {
            success();
          } else {
            let indexData = blockstackRootFile.records[index];
            myItemService.addUserOrNot(usersToFetch, indexData.owner);
            myItemService.fetchMyProvenanceFile(
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
          message: "Error getting my item: itemRootFileName=" + itemRootFileName + " itemId=" + itemId
        });
      });
  },

  transferItem: function(item, success, failure) {
    myItemService.uploadOrTransferItem(item, success, failure);
  },

  uploadItem: function(item, success, failure) {
    item.id = moment({}).valueOf();
    myItemService.uploadOrTransferItem(item, success, failure);
  },

  uploadOrTransferItem: function(item, success, failure) {
    getFile(itemRootFileName, { decrypt: false })
      .then(function(file) {
        if (!file) {
          myItemService.initBlockstackRootFile().then(function(file) {
            myItemService.uploadProvenanceFile(itemRootFileName,file,item,success,failure);
          });
        } else {
          myItemService.uploadProvenanceFile(itemRootFileName,file,item,success,failure);
        }
      })
      .catch(function() {
        failure({
          ERR_CODE: 2,
          message:
            "no root blockstack fole found for file name: " +
            itemRootFileName
        });
      });
  },

  uploadProvenanceFile: function(itemRootFileName, file, item, success, failure) {
    let blockstackRootFile = file;
    if (typeof file === "string") {
      blockstackRootFile = JSON.parse(file);
    }
    let provFile = itemFileName + item.id + ".json";
    let record = utils.convertToBlockstack(item);
    let index = _.findIndex(blockstackRootFile.records, function(o) {
      return o.id === item.id;
    });
    if (index < 0) {
      blockstackRootFile.records.splice(0, 0, record.indexData);
    } else {
      blockstackRootFile.records.splice(index, 1, record.indexData);
    }
    putFile(itemRootFileName, JSON.stringify(blockstackRootFile), {
      encrypt: false
    })
      .then(function() {
        putFile(provFile, JSON.stringify(record.provData), { encrypt: false })
          .then(function() {
            searchIndexService.addRecord("item", record.indexData);
            success(utils.convertFromBlockstack(record));
          })
          .catch(function() {
            failure({
              ERR_CODE: 2,
              message: "Error saving provenance file: " + item.id
            });
          });
      })
      .catch(function() {
        failure({
          ERR_CODE: 3,
          message: "Error uploading item: " + item.id
        });
      });
  },

  updateItem: function(item, reindex, updateProvData, success, failure) {
    let provFile = itemFileName + item.id + ".json";
    item.updated = moment({}).valueOf();
    searchIndexService.removeRecord("id", item.id).then(function() {
      let record = utils.convertToBlockstack(item);
      getFile(itemRootFileName, { decrypt: false })
        .then(function(file) {
          if (!file) {
            failure({ ERR_CODE: 1, message: "no items found" });
          } else {
            let blockstackRootFile = JSON.parse(file);
            let index = _.findIndex(blockstackRootFile.records, function(o) {
              return o.id === item.id;
            });
            if (index < 0 || index >= blockstackRootFile.records.length) {
              failure({ERR_CODE: 2, message: "Unable to find index data in record."});
            } else {
              blockstackRootFile.records[index] = record.indexData;
              putFile(itemRootFileName, JSON.stringify(blockstackRootFile), {encrypt: false}).then(function() {
                if (updateProvData) {
                  putFile(provFile, JSON.stringify(record.provData), {encrypt: false}).then(function() {
                    success(utils.convertFromBlockstack(record));
                    if (reindex) searchIndexService.addRecord("item", record.indexData);
                  })
                    .catch(function() {
                      failure({
                        ERR_CODE: 3,
                        message: "Error saving provenance file: " + item.id
                      });
                    });
                } else {
                  success(utils.convertFromBlockstack(record));
                  if (reindex) searchIndexService.addRecord("item", record.indexData);
                }
              })
                .catch(function() {
                  failure({
                    ERR_CODE: 4,
                    message: "Error uploading item: " + item.id
                  });
                });
            }
          }
        })
        .catch(function() {
          failure({ ERR_CODE: 5, message: "no items found" });
        });
    });
  },

  fetchMyProvenanceFile: function(indexData, success, failure) {
    let fileToFetch = itemFileName + indexData.id + ".json";
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

  deleteMyItem: function(id, success, failure) {
    getFile(itemRootFileName, { decrypt: false })
      .then(function(file) {
        if (!file) {
          failure({
            ERR_CODE: 1,
            message: "No items found to delete from: " + id
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
              message: "no item in blockstack root file: " + id
            });
            return;
          }
          let item = blockstackRootFile.records[index];
          if (item.saleData.auctionId) {
            failure({
              ERR_CODE: 3,
              message:
                "This item is listed in auction: " +
                item.saleData.auctionId +
                " please remember to remove it.."
            });
            return;
          }
          let deletedRecord = blockstackRootFile.records.splice(index, 1);
          console.log("blockstackRootFile length after: " + blockstackRootFile.records.length +
              " index=" + index);
          let fileToDelete = itemFileName + id + ".json";
          putFile(
            fileToDelete,
            JSON.stringify({ deleted: true, reason: "deleted by user" }),
            { encrypt: false }
          )
            .then(function() {
              putFile(itemRootFileName, JSON.stringify(blockstackRootFile), {
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
        failure({ ERR_CODE: 5, message: "no items found" });
      });
  }
};
export default myItemService;
