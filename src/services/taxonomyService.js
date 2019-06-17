import axios from "axios";
import {
  loadUserData,
  decodeToken
} from "blockstack";

const dev = location.origin.indexOf("localhost") > -1;
const gatewayUrl = (dev) ? "http://localhost:8191" : "https://api.brightblock.org";
var httpParams = function(httpMethod, method, postData) {
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
    url: gatewayUrl + "/taxonomy/" + method,
    headers: headers,
    data: postData
  };
};
const bitcoinService = {
  getTaxonomy: function() {
    return new Promise((resolve, reject) => {
      axios(httpParams("post", "fetch")).then(response => {
        if (response && response.data && response.data.details) {
          resolve(response.data.details);
        } else {
          reject(new Error("Unable to fulfil request."));
        }
      })
        .catch(e => {
          reject(new Error("Unable to fulfil request."));
        });
    });
  },
  addCategory: function(category) {
    return new Promise((resolve, reject) => {
      axios(httpParams("post", "save", category)).then(response => {
        if (response && response.data && response.data.details) {
          resolve(response.data.details);
        } else {
          reject(new Error("Unable to fulfil request."));
        }
      })
        .catch(e => {
          reject(new Error("Unable to fulfil request."));
        });
    });
  },
};
export default bitcoinService;
