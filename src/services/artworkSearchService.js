import searchIndexService from "./searchIndexService";
import _ from "lodash";
import utils from "./utils";
import { getFile } from "blockstack";
import settings from "./settings";

/**
 *  The service is a client to the brightblock sever side grpc client.
 **/
const artworkSearchService = {
  queryById(artworkId, success) {
    searchIndexService.searchDappsIndex(location.hostname, "artwork", "id", artworkId).then(searchResult => {
      if (!searchResult || searchResult.error) {
        return;
      }
      success(searchResult[0]);
    });
  },
  queryByOwner(owner, success) {
    searchIndexService.searchDappsIndex(location.hostname, "artwork", "owner", owner).then(searchResults => {
      if (!searchResults || searchResults.error) {
        searchResults = [];
      }
      success(searchResults);
    });
  },
  newQuery(artworkStorage, q, success, failure) {
    if (q.field === "id") {
      let artwork = artworkStorage.getters["artworkSearchStore/getArtwork"](q.query);
      if (artwork && artwork.id) {
        success(artwork);
      }
    }
    artworkStorage.commit("artworkSearchStore/clearSearchResults");
    searchIndexService.searchDappsIndex(location.hostname, "artwork", q.field, q.query).then(searchResults => {
      if (!searchResults || searchResults.error) {
        return;
      }
      let usersToFetch = [];
      searchResults.forEach(function(searchResult) {
        // get the unique users from the search
        artworkSearchService.addUserOrNot(usersToFetch, searchResult.owner);
      });

      _.forEach(usersToFetch, function(username) {
        artworkStorage.dispatch("userProfilesStore/fetchUserProfile", { username: username }, { root: true });
        const artworkRootFileName = settings.artworkRootFileName;
        // for each unique user get their root artwork file and then load the prov files matching the search
        getFile(artworkRootFileName, { decrypt: false, username: username }).then(function(file) {
          if (file) {
            let userRootFile = JSON.parse(file);
            searchResults.forEach(function(searchResult) {
              // get the unique users from the search
              artworkSearchService.storeArtwork(artworkStorage, searchResult, userRootFile.records, success);
            });
          }
        })
          .catch(function() {
            if (failure) failure({
              ERR_CODE: 101,
              message: "Error fetching root artworkfile for user=" + username
            });
          });
      });
    });
  },

  storeArtwork: function(artworkStorage, searchResult, records, success) {
    let artworkId = Number(searchResult.id);
    let index = _.findIndex(records, function(o) {
      return o.id === artworkId;
    });
    if (index === -1) {
      return;
    }
    let indexData = records[index];
    indexData.buyer = searchResult.buyer;
    indexData.status = searchResult.status;
    artworkSearchService.fetchProvenanceFile(
      indexData,
      searchResult.owner,
      function(artwork) {
        artworkStorage.commit("artworkSearchStore/addSearchResult", artwork);
        artworkStorage.commit("artworkSearchStore/addArtwork", artwork);
        if (success) success(artwork);
      },
      function(error) {
        console.log("Error fetching recent artworks: " + searchResult.title, error);
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

  userArtworks: function(artworkStorage, data, success, failure) {
    const artworkRootFileName = settings.artworkRootFileName;
    getFile(artworkRootFileName, { decrypt: false, username: data.username })
      .then(function(file) {
        if (!file) {
          success();
        } else {
          let userRootFile = JSON.parse(file);
          let usersToFetch = [];
          _.forEach(userRootFile.records, function(indexData) {
            artworkSearchService.addUserOrNot(usersToFetch, indexData.uploader);
            artworkSearchService.addUserOrNot(usersToFetch, indexData.owner);
            if (data.title) {
              if (data.title === indexData.title) {
                artworkSearchService.fetchProvenanceFile(
                  indexData,
                  data.username,
                  success,
                  failure
                );
              }
            } else {
              artworkSearchService.fetchProvenanceFile(
                indexData,
                data.username,
                success,
                failure
              );
            }
          });
          _.forEach(usersToFetch, function(userId) {
            artworkStorage.dispatch("userProfilesStore/fetchUserProfile", { username: userId }, { root: true });
          });
        }
      })
      .catch(function() {
        failure({
          ERR_CODE: 101,
          message: "Error fetching user artwork: uname=" + data.username + " title=" + data.title
        });
      });
  },

  userArtwork: function(artworkId, username, success, failure) {
    const artworkRootFileName = settings.artworkRootFileName;
    getFile(artworkRootFileName, { decrypt: false, username: username })
      .then(function(file) {
        if (!file) {
          success();
        } else {
          let userRootFile = JSON.parse(file);
          let index = _.findIndex(userRootFile.records, function(o) {
            return o.id === artworkId;
          });
          if (index > -1) {
            let indexData = userRootFile.records[index];
            artworkSearchService.fetchProvenanceFile(
              indexData,
              username,
              success,
              failure
            );
          } else {
            failure({
              ERR_CODE: 101,
              message: "Error no record for artwork id: " + artworkId + " username: " + username
            });
          }
        }
      })
      .catch(function(e) {
        failure({
          ERR_CODE: 101,
          message: "Error no record for artwork id: " + artworkId + " username: " + username + " e=" + e
        });
      });
  },

  fetchProvenanceFile: function(indexData, username, success, failure) {
    let gaiaFileName = settings.gaiaFileName;
    let fileToFetch = gaiaFileName + indexData.id + ".json";
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
export default artworkSearchService;
