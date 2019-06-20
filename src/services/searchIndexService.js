import axios from "axios";
import _ from "lodash";
import settings from "./settings";
import myAccountService from "./myAccountService";

/**
 *  The service is a client to the brightblock sever side grpc client.
 **/
const searchIndexService = {
  removeRecord: function(field, value) {
    return new Promise(function(resolve) {
      searchIndexService
        .makeGetCall("/index/removeRecord/" + field + "/" + value)
        .then(function(result) {
          resolve(result);
        })
        .catch(function() {
          resolve({
            error: "Unable to remove " + value + " from search index"
          });
        });
    });
  },

  addRecord: function(objType, indexable) {
    return new Promise(function(resolve) {
      indexable.domain = location.hostname;
      indexable.objType = objType;
      if (Array.isArray(indexable.keywords)) {
        indexable.keywords = indexable.keywords.map(keyword => keyword.name).join(",");
      } else {
        indexable.keywords = indexable.keywords;
      }
      let saleType = settings.taxonomy.saleTypes[0];
      if (indexable.saleData) {
        let index = _.findIndex(settings.taxonomy.saleTypes, function(o) {
          return o.soid === indexable.saleData.soid;
        });
        if (index > -1) {
          saleType = settings.taxonomy.saleTypes[index];
        }
      }
      indexable.metaData = {
        medium: indexable.medium,
        saleType: saleType.value,
        saleAmount: (indexable.saleData) ? indexable.saleData.amount : 0,
        saleCurrency: (indexable.saleData) ? indexable.saleData.fiatCurrency : "EUR",
        saleReserve: (indexable.saleData) ? indexable.saleData.reserve : 0
      };
      searchIndexService
        .makePostCall("/index/addRecord/", indexable)
        .then(function(result) {
          resolve(result);
        })
        .catch(function() {
          resolve({ error: "Unable index record: ", indexable });
        });
    });
  },

  sizeOfIndex: function() {
    return new Promise(function(resolve) {
      searchIndexService
        .makeGetCall("/index/size")
        .then(function(result) {
          resolve(result);
        })
        .catch(function() {
          resolve({ error: "Unable to create root file" });
        });
    });
  },

  clearDappsIndex: function() {
    return new Promise(function(resolve) {
      searchIndexService
        .makeGetCall("/index/dapps/clear")
        .then(function(result) {
          resolve(result);
        })
        .catch(function() {
          resolve({ error: "Unable to clear index" });
        });
    });
  },

  clearNamesIndex: function() {
    return new Promise(function(resolve) {
      searchIndexService
        .makeGetCall("/index/names/clear")
        .then(function(result) {
          resolve(result);
        })
        .catch(function() {
          resolve({ error: "Unable to clear index" });
        });
    });
  },

  fetchAllDappsIndex: function() {
    return new Promise(function(resolve) {
      searchIndexService
        .makeGetCall("/index/dapps/fetch")
        .then(function(result) {
          resolve(result);
        })
        .catch(function() {
          resolve({ error: "Unable to fetch index" });
        });
    });
  },

  fetchAllNamesIndex: function() {
    return new Promise(function(resolve) {
      searchIndexService
        .makeGetCall("/index/names/fetch")
        .then(function(result) {
          resolve(result);
        })
        .catch(function() {
          resolve({ error: "Unable to fetch index" });
        });
    });
  },

  searchNamesIndex: function(term, query) {
    return new Promise(function(resolve) {
      searchIndexService
        .makeGetCall("/index/names/query/" + term + "?q=" + query)
        .then(function(result) {
          resolve(result);
        })
        .catch(function() {
          resolve({ error: "Error searching index for query: " + query });
        });
    });
  },

  searchDappsIndex: function(domain, objType, term, query) {
    return new Promise(function(resolve) {
      searchIndexService
        .makeGetCall("/index/dapps/" + domain + "/" + objType + "/" + term + "?q=" + query)
        .then(function(result) {
          resolve(result);
        })
        .catch(function() {
          resolve();
        });
    });
  },

  indexUsers: function(names) {
    return new Promise(function(resolve) {
      searchIndexService
        .makeGetCall("/index/users/" + names)
        .then(function(result) {
          resolve(result);
        })
        .catch(function() {
          resolve({ error: "Unable to index users: " + names });
        });
    });
  },

  indexUser: function() {
    return searchIndexService.indexUsers(myAccountService.myBlockstackId());
  },

  indexPages: function(from, to) {
    return new Promise(function(resolve) {
      searchIndexService
        .makeGetCall("/index/pages/" + from + "/" + to)
        .then(function(result) {
          resolve(result);
        })
        .catch(function() {
          resolve({
            error: "Unable to index pages from " + from + " to " + to
          });
        });
    });
  },

  makePostCall: function(command, data) {
    let callInfo = {
      method: "post",
      url: settings.searchUrl + command,
      headers: {
        "Content-Type": "application/json"
      }
    };
    return new Promise((resolve, reject) => {
      axios
        .post(callInfo.url, data)
        .then(response => {
          if (response.failed) {
            reject(new Error(response.message));
          }
          resolve(response.data.details);
        })
        .catch(e => {
          reject(new Error(e.message));
        });
    });
  },
  makeGetCall: function(command, args) {
    let callInfo = {
      method: "get",
      url: settings.searchUrl + command,
      headers: {
        "Content-Type": "application/json"
      }
    };
    for (var key in args) {
      callInfo.url += "/" + args[key];
    }
    return new Promise((resolve, reject) => {
      axios
        .get(callInfo.url, { headers: callInfo.headers })
        .then(response => {
          if (response.failed) {
            reject(new Error(response.message));
          }
          resolve(response.data.details);
        })
        .catch(e => {
          reject(new Error(e.message));
        });
    });
  },

  remove: function(field, value) {
    return new Promise(function(resolve) {
      searchIndexService
        .makeGetCall("/art/index/remove/" + field + "/" + value)
        .then(function(result) {
          resolve(result);
        })
        .catch(function() {
          resolve({
            error: "Unable to remove " + value + " from search index"
          });
        });
    });
  }
};
export default searchIndexService;
