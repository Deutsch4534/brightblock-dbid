import axios from "axios";
import {
  loadUserData,
  decodeToken
} from "blockstack";

const dev = location.origin.indexOf("localhost") > -1;
const btcGatewayUrl = (dev) ? "http://localhost:8191" : "https://api.brightblock.org";
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
    url: btcGatewayUrl + "/lightning/" + btcMethod,
    headers: headers,
    data: postData
  };
};

/**
 *  The service is a client to the brightblock sever side grpc client.
 **/
const lightningService = {
  getInfo: function(nodeName) {
    return new Promise((resolve, reject) => {
      axios(httpParams("get", nodeName + "/getInfo")).then(response => {
        if (response && response.data) {
          let node = {};
          if (nodeName === "alice") {
            node.peerAddress = "localhost:10011";
            node.rpcAddress = "localhost:10001";
          } else if (node.name === "bob") {
            node.peerAddress = "localhost:10012";
            node.rpcAddress = "localhost:10002";
          }
          node.pubkey = response.data.identityPubkey_;
          node.numPendingChannels = response.data.numPendingChannels_;
          node.numActiveChannels = response.data.numActiveChannels_;
          node.numPeers = response.data.numPeers_;
          resolve(node);
        } else {
          reject(new Error("Unable to get node info."));
        }
      })
        .catch(e => {
          reject(new Error("Cant get node info."));
        });
    });
  },
  getNodeInfo: function(nodeName, pubkey) {
    return new Promise((resolve, reject) => {
      axios(httpParams("get", nodeName + "/getNodeInfo/" + pubkey)).then(response => {
        if (response && response.data) {
          resolve(response.data);
        } else {
          reject(new Error("Unable to get node info."));
        }
      })
        .catch(e => {
          reject(new Error("Cant get node info."));
        });
    });
  },
  getPeerInfo: function(command) {
    // info: listPeers walletbalance  pendingChannels listChannels closedChannels listInvoices getTransactions
    return new Promise((resolve, reject) => {
      axios(httpParams("get", command)).then(response => {
        if (response && response.data) {
          if (command !== "listInvoices") {
            let channel1 = JSON.parse(response.data[0]);
            let channel2 = JSON.parse(response.data[1]);
            resolve([channel1, channel2]);
          } else {
            resolve(response.data);
          }
        } else {
          reject(new Error({error: "Unable to get node info."}));
        }
      })
        .catch(e => {
          reject(new Error({error: "Cant get node info."}));
        });
    });
  },
  addInvoice: function(nodeName, data) {
    return new Promise((resolve, reject) => {
      axios(httpParams("post", nodeName + "/invoice", data)).then(response => {
        if (response && response.data) {
          resolve(response.data.details);
        } else {
          reject(new Error({error: "Unable to get node info."}));
        }
      })
        .catch(e => {
          reject(new Error({error: "Cant get node info."}));
        });
    });
  },
  sendPayment: function(nodeName, data) {
    return new Promise((resolve, reject) => {
      axios(httpParams("get", "sendPayment/" + data.paymentHash + "/" + data.destination + "/" + data.amount, data)).then(response => {
        if (response && response.data) {
          resolve(response.data.details);
        } else {
          reject(new Error({error: "Unable to get node info."}));
        }
      })
        .catch(e => {
          reject(new Error({error: "Cant get node info."}));
        });
    });
  },
  describeGraph: function() {
    return new Promise((resolve, reject) => {
      axios(httpParams("get", "describeGraph")).then(response => {
        if (response && response.data) {
          let channel1 = JSON.parse(response.data[0]);
          let channel2 = JSON.parse(response.data[1]);
          resolve([channel1, channel2]);
        } else {
          reject(new Error({error: "Unable to get node info."}));
        }
      })
        .catch(e => {
          reject(new Error({error: "Cant get node info."}));
        });
    });
  },
  walletBalances: function() {
    return new Promise((resolve, reject) => {
      axios(httpParams("get", "walletBalances")).then(response => {
        if (response && response.data) {
          let channel1 = JSON.parse(response.data[0]);
          let channel2 = JSON.parse(response.data[1]);
          resolve([channel1, channel2]);
        } else {
          reject(new Error("Unable walletBalances."));
        }
      })
        .catch(e => {
          reject(new Error("Cant get walletBalances."));
        });
    });
  },
  pubkeys: function() {
    return new Promise((resolve, reject) => {
      axios(httpParams("get", "pubkeys")).then(response => {
        if (response && response.data) {
          let channel1 = JSON.parse(response.data[0]);
          let channel2 = JSON.parse(response.data[1]);
          resolve([channel1, channel2]);
        } else {
          reject(new Error("Unable pubkeys."));
        }
      })
        .catch(e => {
          reject(new Error("Cant get pubkeys."));
        });
    });
  },
  openChannel: function(nodeName, pubkey, amt) {
    return new Promise((resolve, reject) => {
      axios(httpParams("get", nodeName + "/openChannelSync/" + pubkey + "/" + amt)).then(response => {
        if (response && response.data) {
          resolve(response.data);
        } else {
          reject(new Error("Cant openChannel."));
        }
      })
        .catch(e => {
          reject(new Error("Cant openChannel."));
        });
    });
  },
  /**
   * addr Lightning address of the peer, in the format host:port
   * pubkey pub_key of the node to connect to.
   **/
  connectPeer: function(nodeName, addr, pubkey) {
    let data = {
      addr: addr,
      pubkey: pubkey
    };
    return new Promise((resolve, reject) => {
      axios(httpParams("get", nodeName + "/connect", data)).then(response => {
        if (response && response.data) {
          resolve(response.data);
        } else {
          reject(new Error("Unable connectPeer."));
        }
      })
        .catch(e => {
          reject(new Error("Unable to connectPeer."));
        });
    });
  },
  /**
   *  pubkey pub_key of the node to connect to.
   **/
  disconnectPeer: function(nodeName, pubKey) {
    let data = {
      pubKey: pubKey
    };
    return new Promise((resolve, reject) => {
      axios(httpParams("get", nodeName + "/disconnect", data)).then(response => {
        if (response && response.data) {
          resolve(response.data);
        } else {
          reject(new Error("Unable to disconnectPeer."));
        }
      })
        .catch(e => {
          reject(new Error("Unable disconnectPeer."));
        });
    });
  }
};
export default lightningService;
