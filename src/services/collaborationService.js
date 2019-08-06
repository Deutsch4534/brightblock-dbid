import SockJS from "sockjs-client";
import Stomp from "@stomp/stompjs";
import { CONSTANTS } from "@/storage/constants";
import xhrService from "./xhrService";
import myAccountService from "./myAccountService";

const collaborationService = {
  sendMessage: function(data, success, failure) {
    data.sender = myAccountService.myBlockstackId();
    data.type = "artwork";
    data.domain = location.hostname;
    let endPoint = CONSTANTS.commsUrl + "/comms/send-to";
    xhrService.makePostCall(endPoint, data).then(function(response) {
      if (success) success(response.data.details);
    });
  },
  subscribeCollaborationNews: function() {
    let socket = new SockJS(CONSTANTS.commsUrl + "/comms/collab");
    let stompClient = Stomp.over(socket);
    stompClient.debug = null;
    let connectSuccess = function() {
      stompClient.subscribe("/topic/collab", function(response) {
        collaborationService.fiatRates = JSON.parse(response.body);
      });
    };
    let connectError = function(error) {
      if (error.headers) {
        console.log("[SysadmOnly] WebSocket Error: " + error);
      } else {
        console.log("[SysadmOnly] WebSocket Error: " + error);
      }
    };
    stompClient.connect(
      {},
      connectSuccess,
      connectError
    );
  }
};
export default collaborationService;
