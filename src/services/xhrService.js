import axios from "axios";
import { API_CONSTANTS } from "@/api-constants";

const xhrService = {
  makeDirectCall: function(url) {
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(response => {
          if (response.failed) {
            console.error("Call failed: ", response);
            resolve();
          }
          resolve(response.data);
        })
        .catch(e => {
          console.error("Call failed: ", e);
          resolve();
        });
    });
  },
  makeGetCall: function(command, args) {
    let callInfo = {
      method: "get",
      url: API_CONSTANTS.ethGatewayUrl + command,
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
            console.error("Call failed: ", response);
            resolve();
          }
          resolve(response.data.details);
        })
        .catch(e => {
          console.error("Call failed: ", e);
          resolve();
        });
    });
  },
  makePostCall: function(endPoint, data) {
    let callInfo = {
      method: "post",
      url: endPoint,
      headers: {
        "Content-Type": "application/json"
      }
    };
    return new Promise((resolve, reject) => {
      axios
        .post(callInfo.url, data)
        .then(response => {
          if (response.failed) {
            resolve();
          }
          resolve(response);
        })
        .catch(e => {
          resolve();
        });
    });
  }
};
export default xhrService;
