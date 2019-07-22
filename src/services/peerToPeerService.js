import OT from "@opentok/client";
import xhrService from "./xhrService";
import utils from "./utils";
import notify from "@/notify";
import settings from "./settings";

/**
 *  The service is a client to the brightblock sever.
 **/
const peerToPeerService = {
  getSessionToken: function(username, recordId) {
    return new Promise(function(resolve) {
      xhrService
        .makeGetCall("/token/" + username + "/" + recordId)
        .then(function(tokbox) {
          resolve(tokbox);
        });
    });
  },
  disconnect: function() {
    peerToPeerService.stopPublishing();
    if (peerToPeerService.session) {
      peerToPeerService.session.disconnect();
    }
  },
  streamCreated: function(event) {
    // called when another client starts publishing a stream
    console.log("opentok: Remote stream created:" + event.stream.id);
    peerToPeerService.session.subscribe(
      event.stream,
      "subscriber",
      {
        insertMode: "append",
        width: "100%",
        height: "250px"
      },
      function(e) {
        console.log("opentok: " + e);
      }
    );
  },
  streamDestroyed: function(event) {
    // called when another client starts publishing a stream
    console.log(
      "opentok: Stream " + event.stream.name + " ended. " + event.reason
    );
  },
  sessionDisconnected: function() {
    // called when another client starts publishing a stream
    peerToPeerService.session.off("signal:message");
    peerToPeerService.session.off("signal:bid");
    peerToPeerService.session.off("streamCreated");
    peerToPeerService.session.off("streamDestroyed"); // .connect(tokbox.token)
  },
  sendPeerSignal: function(signal) {
    if (
      !signal.data ||
      !signal.data.username ||
      signal.data.username === "anon"
    ) {
      return;
    }
    if (signal.type.indexOf("-adm") > 1) {
      let peer = signal.data.peer;
      if (!peer || !peer.connection) {
        throw new Error("No administrator present - please wait for the administrator to join the session.");
      }
      signal.to = peer.connection;
    }
    signal.data = JSON.stringify(signal.data);
    // Note: not setting this causes the annoying 'Websocket closed or closing message'
    signal.retryAfterReconnect = true;
    if (peerToPeerService.session) {
      console.log("opentok: Sending signal: " + signal.type);
      peerToPeerService.session.signal(signal, function(error) {
        if (error) {
          if (error.name && error.name === "OT_NOT_CONNECTED") {
            location.reload();
          }
          notify.error({
            title: "Reload Page",
            text: "Signal error: " + error
          });
          console.log(
            "opentok: signal error (" + error.name + "): " + error.message,
            signal
          );
        } else {
          console.log("opentok: signal sent: " + signal.type, signal.data);
        }
      });
    } else {
      console.log(
        "opentok: Unable to send signal - no session. Signal data: ",
        signal.data
      );
    }
  },
  peerSignal: function(event) {
    let data = JSON.parse(event.data);
    console.log("opentok: Signal in: " + event.type, data);
    if (!data.username || data.username === "anon") {
      return;
    }
    if (event.type === "signal:wa-message-send-adm") {
      peerToPeerService.vueStorage.commit("myAuctionStore/messageEvent", data);
    } else if (event.type === "signal:wa-message-update") {
      peerToPeerService.vueStorage.commit("onlineAuctionsStore/messageEvent", data);
    } else if (event.type === "signal:wa-bid-send-adm") {
      peerToPeerService.vueStorage.commit("myAuctionStore/sendBidEvent", data);
    } else if (event.type === "signal:wa-bid-receive") {
      peerToPeerService.vueStorage.commit("onlineAuctionsStore/receiveBidEvent", data);
    } else if (event.type === "signal:wa-item-pause") {
      peerToPeerService.vueStorage.commit("onlineAuctionsStore/pauseItemEvent", data);
    } else if (event.type === "signal:wa-item-unpause") {
      peerToPeerService.vueStorage.commit("onlineAuctionsStore/unpauseItemEvent", data);
    } else if (event.type === "signal:wa-item-selling") {
      peerToPeerService.vueStorage.commit("onlineAuctionsStore/sellItemEvent", data);
    } else if (event.type === "signal:wa-item-activate") {
      peerToPeerService.vueStorage.commit("onlineAuctionsStore/activateItemEvent", data);
    } else if (event.type === "signal:wa-auction-update") {
      peerToPeerService.vueStorage.dispatch("onlineAuctionsStore/fetchUserAuctions", data);
    }
  },
  startPublishing: function() {
    if (!peerToPeerService.publisher) {
      peerToPeerService.publisher = OT.initPublisher("publisher", {
        insertMode: "append",
        width: "100%",
        height: "200px",
        name: peerToPeerService.tokbox.username
      });
      peerToPeerService.session.publish(peerToPeerService.publisher);
    }
  },
  stopPublishing: function() {
    if (peerToPeerService.publisher) {
      peerToPeerService.session.unpublish(peerToPeerService.publisher);
    }
    peerToPeerService.publisher = null;
  },
  start: function() {
    peerToPeerService.session = OT.initSession(
      settings.apiKey,
      peerToPeerService.tokbox.sessionId
    );
    peerToPeerService.session.on({
      sessionConnected: function(event) {
        console.log("opentok: Session connected: " + event);
      },
      connectionCreated: function(event) {
        console.log("opentok: Connection event data: " + event.connection.data);
        peerToPeerService.vueStorage.commit(
          "onlineAuctionsStore/newPeer",
          utils.buildWebrtcSessionData(event.connection, event.connection.data)
        );
      },
      connectionDestroyed: function connectionDestroyedHandler(event) {
        peerToPeerService.vueStorage.commit(
          "onlineAuctionsStore/farewellPeer",
          utils.buildWebrtcSessionData(
            event.connection.connectionId,
            event.connection.data
          )
        );
        console.log(
          "opentok: Disconnection event data: " + event.connection.data
        );
      },
      sessionReconnecting: function() {
        console.log(
          "opentok: Session reconnecting...: " +
            peerToPeerService.session.isConnected()
        );
      },
      sessionReconnected: function() {
        console.log(
          "opentok: Session reconnected: " +
            peerToPeerService.session.isConnected()
        );
      },
      sessionDisconnected: function() {
        console.log(
          "opentok: Session disconnected: " +
            peerToPeerService.session.isConnected()
        );
      }
    });
    peerToPeerService.session.connect(
      peerToPeerService.tokbox.token,
      function(error) {
        if (error) {
          notify.error({
            title: "Peer Session",
            text: "Connection error: " + error
          });
          console.log("opentok: Connection error" + error);
        } else {
          console.log("opentok: Connected to the session.");
        }
      }
    );

    // Session events...

    peerToPeerService.session.on(
      "sessionDisconnected",
      peerToPeerService.sessionDisconnected
    );
    peerToPeerService.session.on(
      "streamCreated",
      peerToPeerService.streamCreated
    );
    peerToPeerService.session.on(
      "streamDestroyed",
      peerToPeerService.streamDestroyed
    ); // .connect(tokbox.token)
    peerToPeerService.session.on(
      "signal:wa-bid-send-adm",
      peerToPeerService.peerSignal
    );
    peerToPeerService.session.on(
      "signal:wa-bid-receive",
      peerToPeerService.peerSignal
    );
    peerToPeerService.session.on(
      "signal:wa-item-pause",
      peerToPeerService.peerSignal
    );
    peerToPeerService.session.on(
      "signal:wa-item-unpause",
      peerToPeerService.peerSignal
    );
    peerToPeerService.session.on(
      "signal:wa-item-activate",
      peerToPeerService.peerSignal
    );
    peerToPeerService.session.on(
      "signal:wa-item-selling",
      peerToPeerService.peerSignal
    );
    peerToPeerService.session.on(
      "signal:wa-auction-update",
      peerToPeerService.peerSignal
    );
    peerToPeerService.session.on(
      "signal:wa-message-send-adm",
      peerToPeerService.peerSignal
    );
    peerToPeerService.session.on(
      "signal:wa-message-update",
      peerToPeerService.peerSignal
    );
  },
  startSession: function(vueStorage, username, recordId) {
    peerToPeerService.vueStorage = vueStorage;
    if (!username || username === "anon") {
      return;
    }
    if (peerToPeerService.session && peerToPeerService.session.isConnected()) {
      console.log(
        "opentok: Connected to session: " +
          peerToPeerService.session.connection.connectionId
      );
      return;
    }
    if (!username || !recordId) {
      throw new Error(
        "Username and auction id are both required to start a session."
      );
    }
    peerToPeerService.getSessionToken(username, recordId).then(tokbox => {
      peerToPeerService.tokbox = tokbox;
      peerToPeerService.tokbox.username = username;
      peerToPeerService.tokbox.recordId = recordId;
      peerToPeerService.start();
    });
  }
};
export default peerToPeerService;
