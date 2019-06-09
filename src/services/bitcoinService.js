import axios from "axios";
import {
  loadUserData,
  decodeToken
} from "blockstack";
import SockJS from "sockjs-client";
import Stomp from "@stomp/stompjs";

const dev = location.origin.indexOf("localhost") > -1;
const btcGatewayUrl = (dev) ? "http://localhost:8191" : "https://api.brightblock.org";
const lndGatewayUrlAlice = (dev) ? "localhost:10011" : "api.brightblock.org:10011";
const lndGatewayUrlBob = (dev) ? "localhost:10012" : "api.brightblock.org:10012";
var httpParams = function(httpMethod, btcMethod, postData) {
  //let hubConfig = localStorage.getItem("blockstack-gaia-hub-config");
  //let hubJSON = JSON.parse(hubConfig);
  let account = loadUserData();
  var authResponseToken = account.authResponseToken;
  var decodedToken = decodeToken(authResponseToken);
  var publicKey = decodedToken.payload.public_keys[0];

  let token = "v1:" + account.authResponseToken;

  let headers = {
    IdentityAddress: publicKey,
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };
  return {
    method: httpMethod,
    url: btcGatewayUrl + "/bitcoin/" + btcMethod,
    headers: headers,
    data: postData
  };
};
const bitcoinService = {
  getBitcoinUri: function(asset) {
    let index = asset.purchaseCycles.length - 1;
    let purchaseCycle = asset.purchaseCycles[index];
    let uri = "bitcoin:" + purchaseCycle.paymentAddress;
    uri += "?amount=" + purchaseCycle.buyer.amountBitcoin;
    uri += "&label=" + asset.assetId;
    uri += "&message=" + asset.assetHash;
    return encodeURI(uri);
  },
  getLightningUri: function(asset) {
    try {
      let index = asset.purchaseCycles.length - 1;
      let purchaseCycle = asset.purchaseCycles[index];
      let uri = "lightning:" + purchaseCycle.buyer.chainData.paymentRequest;
      return encodeURI(uri);
    } catch (err) {
      console.log("Error unwrapping lightning uri: ", err);
    }
  },
  fetchBitcoinState: function() {
    return new Promise((resolve, reject) => {
      axios(httpParams("get", "getblockchaininfo")).then(response => {
        if (response && response.data && response.data.details) {
          resolve(JSON.parse(response.data.details).result);
        } else {
          reject(new Error({error: "Unable to get new address."}));
        }
      })
        .catch(e => {
          reject(new Error({error: "Unable to get new address."}));
        });
    });
  },
  fetchRadPayConfig: function() {
    return new Promise((resolve, reject) => {
      axios(httpParams("post", "getRadPayConfig")).then(response => {
        if (response && response.data && response.data.details) {
          let config = response.data.details;
          let assetConfig = {
            statuses: JSON.parse(config.assetConfig)
          };
          let bitcoinConfig = JSON.parse(config.bitcoinConfig).result;
          let lightningConfig = {
            "alice": {
              pubkey: JSON.parse(config.lightningConfig[0]).identityPubkey_,
              nodeUri: lndGatewayUrlAlice
            },
            "bob": {
              pubkey: JSON.parse(config.lightningConfig[1]).identityPubkey_,
              nodeUri: lndGatewayUrlBob
            }
          };
          let configs = [assetConfig, bitcoinConfig, lightningConfig];
          resolve(configs);
        } else {
          reject(new Error({error: "Unable to get new address."}));
        }
      })
        .catch(e => {
          reject(new Error({error: "Unable to get new address."}));
        });
    });
  },
  getPaymentAddress: function(asset) {
    return new Promise((resolve, reject) => {
      axios(httpParams("post", "getPaymentAddress", asset)).then(response => {
        if (response && response.data && response.data.details) {
          resolve(response.data.details);
        } else {
          reject(new Error({error: "Unable to get new address."}));
        }
      })
        .catch(e => {
          reject(new Error({error: "Unable to get new address."}));
        });
    });
  },
  /**
   * Defined in bitcoinService.js
   * Check given address is valid on the current bitcoin / lightning network.
   *
   * Parameters
   * address: address
   * the address to check
   *
   * Returns Promise<object>
   * that resolves to the the bitcoin or lightning address object
  **/
  checkAddress: function(data) {
    return new Promise((resolve, reject) => {
      axios(httpParams("post", "checkAddress", data)).then(response => {
        resolve(response.data.details.result);
      })
        .catch(e => {
          reject(new Error({error: "Unable to get new address."}));
        });
    });
  },
  registerAsset: function(data) {
    // let decTx = JSON.stringify({decodeTx: "03efesfewfew"});
    // success({"sentTx":"oranges", rawTx: "0r34ewwedscdsvd", decodedTransaction: decTx});
    return new Promise((resolve, reject) => {
      axios(httpParams("post", "registerAsset", data)).then(response => {
        resolve(response.data.details);
      })
        .catch(e => {
          reject(new Error(e.response.data.details));
        });
    });
  },
  cancelPurchase: function(assetHash) {
    return new Promise((resolve, reject) => {
      axios(httpParams("post", "cancelPurchase", assetHash)).then(response => {
        resolve(response.data.details);
      })
        .catch(e => {
          reject(new Error({error: "Unable to get transaction."}));
        });
    });
  },
  markAssetTransferred: function(assetHash) {
    return new Promise((resolve, reject) => {
      axios(httpParams("post", "markAssetTransferred", assetHash)).then(response => {
        resolve(response.data.details);
      })
        .catch(e => {
          reject(new Error("Server error."));
        });
    });
  },
  lookupAssetByHash: function(assetHash) {
    return new Promise((resolve, reject) => {
      axios(httpParams("post", "lookupAssetByHash", assetHash)).then(response => {
        resolve(response.data.details);
      })
        .catch(e => {
          reject(new Error("Server error."));
        });
    });
  },
  lookupAssetsByBuyer: function(buyer) {
    return new Promise((resolve, reject) => {
      axios(httpParams("post", "lookupAssetsByBuyer", buyer)).then(response => {
        resolve(response.data.details);
      })
        .catch(e => {
          if (e.request.status === 404) {
            resolve();
          } else {
            reject(new Error("Server error."));
          }
        });
    });
  },
  consolidate: function() {
    return new Promise((resolve, reject) => {
      axios(httpParams("post", "consolidate")).then(response => {
        resolve(response.data.details);
      })
        .catch(e => {
          reject(new Error({error: "Unable to get transaction."}));
        });
    });
  },
  paySeller: function(assetHash, success, failure) {
    return new Promise((resolve, reject) => {
      axios(httpParams("post", "paySeller", assetHash)).then(response => {
        resolve(response.data.details);
      })
        .catch(e => {
          reject(new Error({error: "Unable to pay seller."}));
        });
    });
  },
  subscribeAssetTransferNews: function(success, failure) {
    let socket = new SockJS(btcGatewayUrl + "/assets/transfer");
    let stompClient = Stomp.over(socket);
    let connectSuccess = function() {
      stompClient.subscribe("/topic/assets/transfer", function(response) {
        let assets = JSON.parse(response.body);
        if (success) success(assets);
      });
    };
    let connectError = function(error) {
      if (failure) failure(error);
    };
    stompClient.connect(
      {},
      connectSuccess,
      connectError
    );
  },
  subscribeAssetPurchaseNews: function(success, failure) {
    let socket = new SockJS(btcGatewayUrl + "/assets/purchase");
    let stompClient = Stomp.over(socket);
    let connectSuccess = function() {
      stompClient.subscribe("/topic/assets/purchase", function(response) {
        let assets = JSON.parse(response.body);
        if (success) success(assets);
      });
    };
    let connectError = function(error) {
      if (failure) failure(error);
    };
    stompClient.connect(
      {},
      connectSuccess,
      connectError
    );
  }
};
export default bitcoinService;
