<template>
  <div class="row">
    <div class="col-md-12">
      <div class="row">
        <label>Messages</label>
        <textarea class="form-control" v-model="message" v-on:keyup.13.prevent="sendMessage"></textarea>
      </div>
    </div>
    <div class="col-md-12 scrolly">
        <div v-for="(message, index) of messages" :key="index">
          {{message.username}}: {{message.content}} <br/>
        </div>
    </div>
  </div>
</template>

<script>
import peerToPeerService from "@/services/peerToPeerService";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MessageStream",
  props: {
    auctionId: null,
    admin: false
  },
  data() {
    return {
      message: ""
    };
  },
  computed: {
    messages() {
      let auction = {};
      if (this.admin) {
        auction = this.$store.getters["myAuctionsStore/myAuction"](
          this.auctionId
        );
      } else {
        auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](
          this.auctionId
        );
      }
      if (!auction) {
        auction = {};
      }
      return auction.messages;
    }
  },
  methods: {
    sendMessage() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      let data = {
        content: this.message,
        username: myProfile.username,
        auctionId: this.auctionId
      };
      this.message = "";
      if (this.admin) {
        this.$store.commit("myAuctionsStore/messageEvent", data);
      } else {
        data.peer = this.$store.getters["onlineAuctionsStore/getAdministrator"](this.auctionId);
        peerToPeerService.sendPeerSignal({
          type: "wa-message-send-adm",
          data: data
        });
      }
    }
  }
};
</script>
<style>
.scrolly {
  max-width: 400px;
  max-height: 200px;
  overflow: auto;
}
</style>
