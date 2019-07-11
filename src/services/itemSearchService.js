import searchIndexService from "./searchIndexService";
import _ from "lodash";
import utils from "./utils";
import { getFile } from "blockstack";

/**
 *  The service is a client to the brightblock sever side grpc client.
 **/
const itemRootFileName = "items_v01.json";
const itemFileName = "item_";

const itemSearchService = {
  queryById(itemId, success) {
    searchIndexService.searchDappsIndex(location.hostname, "item", "id", itemId).then(searchResult => {
      if (!searchResult || searchResult.error) {
        return;
      }
      success(searchResult[0]);
    });
  },
  queryByOwner(owner, success) {
    searchIndexService.searchDappsIndex(location.hostname, "item", "owner", owner).then(searchResults => {
      if (!searchResults || searchResults.error) {
        searchResults = [];
      }
      success(searchResults);
    });
  },
  searchCategoryPopulationQuery(q, success, failure) {
    searchIndexService.searchCategoriesIndex(location.hostname, "item", q.field, q.query).then(searchResults => {
      if (success) success(searchResults);
    });
  },
  newQuery(itemStorage, q, success, failure) {
    if (q.field === "id") {
      let item = itemStorage.getters["itemSearchStore/getItem"](q.query);
      if (item && item.id) {
        success(item);
      }
    }
    itemStorage.commit("itemSearchStore/clearSearchResults", q);
    searchIndexService.searchDappsIndex(location.hostname, "item", q.field, q.query).then(searchResults => {
      if (!searchResults || searchResults.error) {
        return;
      }
      let usersToFetch = [];
      let validResults = [];
      searchResults.forEach(function(searchResult) {
        // get the unique users from the search

        searchResult.searchWords = searchResult.keywords;
        if (searchResult.owner) {
          itemStorage.commit("itemSearchStore/addSearchResult", searchResult);
          itemSearchService.addUserOrNot(usersToFetch, searchResult.owner);
          validResults.push(searchResult);
        }
      });
      searchResults = validResults;
      _.forEach(usersToFetch, function(username) {
        if (!username) {
          //if (success) success();
          //return;
        }
        itemStorage.dispatch("userProfilesStore/fetchUserProfile", { username: username }, { root: true });
        // for each unique user get their root item file and then load the prov files matching the search
        getFile(itemRootFileName, { decrypt: false, username: username }).then(function(file) {
          if (file) {
            let userRootFile = JSON.parse(file);
            searchResults.forEach(function(searchResult) {
              // get the unique users from the search
              itemSearchService.storeItem(itemStorage, searchResult, userRootFile.records, success);
            });
          }
        })
          .catch(function() {
            if (failure) failure({
              ERR_CODE: 101,
              message: "Error fetching root itemfile for user=" + username
            });
          });
      });
    });
  },

  storeItem: function(itemStorage, searchResult, records, success) {
    let itemId = Number(searchResult.id);
    let index = _.findIndex(records, function(o) {
      return o.id === itemId;
    });
    if (index === -1) {
      return;
    }
    let indexData = records[index];
    indexData.buyer = searchResult.buyer;
    indexData.status = searchResult.status;
    indexData.searchWords = searchResult.searchWords;
    itemSearchService.fetchProvenanceFile(
      indexData,
      searchResult.owner,
      function(item) {
        itemStorage.commit("itemSearchStore/addSearchResult", item);
        itemStorage.commit("itemSearchStore/addItem", item);
        if (success) success(item);
      },
      function(error) {
        console.log("Error fetching recent items: " + searchResult.title, error);
      }
    );
  },

  addUserOrNot: function(usersToFetch, userId) {
    let uIndex = _.findIndex(usersToFetch, function(o) {
      return o === userId;
    });
    if (uIndex === -1) {
      usersToFetch.push(userId);
    }
  },

  userItems: function(itemStorage, data, success, failure) {
    getFile(itemRootFileName, { decrypt: false, username: data.username })
      .then(function(file) {
        if (!file) {
          success();
        } else {
          let userRootFile = JSON.parse(file);
          let usersToFetch = [];
          _.forEach(userRootFile.records, function(indexData) {
            itemSearchService.addUserOrNot(usersToFetch, indexData.owner);
            if (data.title) {
              if (data.title === indexData.title) {
                itemSearchService.fetchProvenanceFile(
                  indexData,
                  data.username,
                  success,
                  failure
                );
              }
            } else {
              itemSearchService.fetchProvenanceFile(
                indexData,
                data.username,
                success,
                failure
              );
            }
          });
          _.forEach(usersToFetch, function(userId) {
            itemStorage.dispatch("userProfilesStore/fetchUserProfile", { username: userId }, { root: true });
          });
        }
      })
      .catch(function() {
        failure({
          ERR_CODE: 101,
          message: "Error fetching user item: uname=" + data.username + " title=" + data.title
        });
      });
  },

  userItem: function(itemId, username, success, failure) {
    getFile(itemRootFileName, { decrypt: false, username: username })
      .then(function(file) {
        if (!file) {
          success();
        } else {
          let userRootFile = JSON.parse(file);
          let index = _.findIndex(userRootFile.records, function(o) {
            return o.id === itemId;
          });
          if (index > -1) {
            let indexData = userRootFile.records[index];
            itemSearchService.fetchProvenanceFile(
              indexData,
              username,
              success,
              failure
            );
          } else {
            failure({
              ERR_CODE: 101,
              message: "Error no record for item id: " + itemId + " username: " + username
            });
          }
        }
      })
      .catch(function(e) {
        failure({
          ERR_CODE: 101,
          message: "Error no record for item id: " + itemId + " username: " + username + " e=" + e
        });
      });
  },

  fetchProvenanceFile: function(indexData, username, success, failure) {
    let fileToFetch = itemFileName + indexData.id + ".json";
    getFile(fileToFetch, { decrypt: false, username: username })
      .then(function(file) {
        if (file) {
          try {
            let provData = JSON.parse(file);
            provData.id = indexData.id;
            success(utils.convertFromBlockstack({indexData: indexData, provData: provData}));
          } catch (err) {
            console.error("Parsing error - skipping: " + indexData.title, err);
          }
        } else {
          failure({ ERR_CODE: 1, message: "no provenance file found" });
        }
      })
      .catch(function(e) {
        failure({
          ERR_CODE: 2,
          message: "Error fetching provenance file found: ",
          exception: e
        });
      });
  }
};
export default itemSearchService;
