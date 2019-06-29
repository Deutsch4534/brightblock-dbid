<template>
<div>
  <h2 class="title">Lightning Data</h2>
  <div class="row">
    <div class="col-md-2">Channels</div>
    <div class="col-md-5">Alice</div>
    <div class="col-md-5">Bob</div>
  </div>
  <div class="row">
    <div class="col-md-2">Invoice</div>
    <div class="col-md-12 text-left" v-if="invoice">{{ invoice }}</div>
    <div class="form-group mb-2">
      <input type="number" class="form-control" placeholder="value" v-model="value" />
    </div>
    <div class="form-group mb-2">
      <input type="text" class="form-control" placeholder="memo" v-model="memo" />
      <button class="btn teal lighten-1" @click="addInvoice()">add invoice</button>
    </div>
  </div>
  <div class="row">
    <div class="col-md-2">Send Payment</div>
    <div class="form-group mb-2">
      <input type="number" class="form-control" placeholder="amount" v-model="paymentData.amount" />
    </div>
    <div class="form-group mb-2">
      <input type="text" class="form-control" placeholder="value" v-model="paymentData.destination" />
    </div>
    <div class="form-group mb-2">
      <input type="text" class="form-control" placeholder="paymentHash" v-model="paymentData.paymentHash" />
    </div>
    <div class="form-group mb-2">
      <button class="btn teal lighten-1" @click="sendPayment()">send payment</button>
    </div>
    <div class="col-md-12 text-left" v-if="response">{{ response }}</div>
  </div>
  <div class="row">
    <div class="col-md-2"><a @click.prevent="getPubkeys()">pubkeys</a></div>
    <div class="col-md-12 text-left" v-if="pubkeys.length > 0">{{ pubkeys[0].identityPubkey_ }}</div>
    <div class="col-md-12 text-right" v-if="pubkeys.length > 1">{{ pubkeys[1].identityPubkey_ }}</div>
  </div>
  <div class="row">
    <div class="col-md-2"><a @click.prevent="walletBalances()">walletBalances</a></div>
    <div class="col-md-5" v-if="balances.length > 0">{{ balances[0].confirmedBalance_ / 100000000 }} BTC</div>
    <div class="col-md-5" v-if="balances.length > 1">{{ balances[1].confirmedBalance_ / 100000000 }} BTC</div>
  </div>
  <div class="row">
    <div class="col-md-2"><a @click.prevent="getInfo">GetInfo</a></div>
    <div class="col-md-10">{{ lightningState }}</div>
  </div>
  <div class="row">
    <div class="col-md-2"><a @click.prevent="getHashPreImagePair">Get Hash and Pre Image Pair</a></div>
    <div class="col-md-10">{{ hashPreImagePair }}</div>
  </div>
  <div class="row">
    <div class="col-md-2"><a @click.prevent="getNodeInfo">NodeInfo</a></div>
    <div class="col-md-10">{{ nodeInfo }}</div>
  </div>
  <div class="row">
    <div class="col-md-2"><a @click.prevent="getPeerInfo('listPeers')">ListPeers</a></div>
    <div class="col-md-10">{{ listPeers }}</div>
  </div>
  <div class="row">
    <div class="col-md-2"><a @click.prevent="getPeerInfo('pendingChannels')">pendingChannels</a></div>
    <div class="col-md-10">{{ pendingChannels }}</div>
  </div>
  <div class="row">
    <div class="col-md-2"><a @click.prevent="getPeerInfo('listInvoices')">listInvoices</a></div>
    <div class="col-md-10">{{ listInvoices }}</div>
  </div>
  <div class="row">
    <div class="col-md-2"><a @click.prevent="getPeerInfo('listChannels')">listChannels</a></div>
    <div class="col-md-12 text-left"  style="border: 1pt solid #ccc" v-if="alicesChannels.length > 1" v-for="(channel, index4) in alicesChannels" :value="channel">
      <div class="col-md-12">RemoteBalance: {{ channel.remoteBalance_ }}</div>
      <div class="col-md-12">LocalBalance: {{ channel.localBalance_ }}</div>
      <div class="col-md-12">Capacity: {{ channel.capacity_ }}</div>
      <div class="col-md-12">RemotePubkey: {{ channel.remotePubkey_ }}</div>
      <div class="col-md-12">channelPoint: {{ channel.channelPoint_ }}</div>
      <div class="col-md-12">chanId: {{ channel.chanId_ }}</div>
    </div>
    <div class="col-md-10 right" style="border: 1pt solid #ccc" v-if="bobsChannels.length > 0" v-for="(channel, index3) in bobsChannels" :value="channel">
      <div class="col-md-12">RemoteBalance: {{ channel.remoteBalance_ }}</div>
      <div class="col-md-12">LocalBalance: {{ channel.localBalance_ }}</div>
      <div class="col-md-12">Capacity: {{ channel.capacity_ }}</div>
      <div class="col-md-12">RemotePubkey: {{ channel.remotePubkey_ }}</div>
      <div class="col-md-12">channelPoint: {{ channel.channelPoint_ }}</div>
      <div class="col-md-12">chanId: {{ channel.chanId_ }}</div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-2"><a @click.prevent="getPeerInfo('getTransactions')">getTransactions</a></div>
    <div class="col-md-12 text-left"  style="border: 1pt solid #ccc" v-if="alicesTxs.length > 1" v-for="(transaction, index0) in alicesTxs" :value="transaction">
      <div class="col-md-12">amount_: {{ transaction.amount_ }}</div>
      <div class="col-md-12">numConfirmations_: {{ transaction.numConfirmations_ }}</div>
      <div class="col-md-12">addresses_: {{ transaction.addresses_ }}</div>
      <div class="col-md-12">txHash_: {{ transaction.txHash_ }}</div>
    </div>
    <div class="col-md-10 right" style="border: 1pt solid #ccc" v-if="bobsTxs.length > 0" v-for="(transaction, index1) in bobsTxs" :value="transaction">
      <div class="col-md-12">amount_: {{ transaction.amount_ }}</div>
      <div class="col-md-12">numConfirmations_: {{ transaction.numConfirmations_ }}</div>
      <div class="col-md-12">addresses_: {{ transaction.addresses_ }}</div>
      <div class="col-md-12">txHash_: {{ transaction.txHash_ }}</div>
    </div>
  </div>
  </div>

</div>
</template>

<script>
import utils from "@/services/utils";

export default {
  components: {
  },
  data() {
    return {
      lightningState: null,
      paymentData: {
        destination: "035253ba64b9573dc3d7acf1fec3d1455e539cbe6282aae1b4f9ecd157e495c440",
        amount: 10000,
        paymentHash: ""
      },
      response: null,
      nodeInfo: null,
      listPeers: null,
      balances: [],
      pubkeys: [],
      pendingChannels: [],
      channel: "alice",
      loading: false,
      invoice: null,
      memo: "memo1",
      value: 10000,
      listInvoices: [],
      listChannels: [],
      getTransactions: [],
      hashPreImagePair: {}
    };
  },
  mounted() {
  },
  methods: {
    getInfo() {
      this.$store.dispatch("lightningStore/fetchInfo", this.channel).then(lightningState => {
        if (lightningState) {
          this.lightningState = lightningState;
        }
      });
    },
    getHashPreImagePair() {
      this.hashPreImagePair = utils.getHashPreImagePair();
    },
    addInvoice() {
      let data = {
        nodeName: "alice",
        invoiceData: {
          amount: this.value, memo: this.memo
        }
      };
      this.$store.dispatch("lightningStore/addInvoice", data).then(invoice => {
        if (invoice) {
          this.invoice = invoice;
        }
      });
    },
    sendPayment() {
      let data = {
        nodeName: "alice",
        paymentData: this.paymentData
      };
      this.$store.dispatch("lightningStore/sendPayment", data).then(response => {
        if (response) {
          this.response = response;
        }
      });
    },
    getNodeInfo() {
      this.$store.dispatch("lightningStore/fetchInfo", this.channel).then(lightningState => {
        if (lightningState) {
          this.lightningState = lightningState;
          this.$store.dispatch("lightningStore/fetchNodeInfo", {nodeName: this.channel, pubkey: this.lightningState.pubkey}).then(nodeInfo => {
            if (nodeInfo) {
              this.nodeInfo = nodeInfo;
            }
          });
        }
      });
    },
    walletBalances() {
      this.$store.dispatch("lightningStore/fetchWalletBalances").then(walletBalances => {
        if (walletBalances) {
          this.balances = walletBalances;
        }
      });
    },
    getPubkeys() {
      this.$store.dispatch("lightningStore/fetchPubkeys").then(pubkeys => {
        if (pubkeys) {
          this.pubkeys = pubkeys;
        }
      });
    },
    getPeerInfo(command) {
      let data = {
        nodeName: this.channel,
        command: command
      };
      this.$store.dispatch("lightningStore/fetchPeerInfo", command).then(peerInfo => {
        if (command === "listPeers") {
          this.listPeers = peerInfo;
        } else if (command === "pendingChannels") {
          this.pendingChannels = peerInfo;
        } else if (command === "walletBalances") {
          this.walletBalances = peerInfo;
        } else if (command === "getTransactions") {
          this.getTransactions = peerInfo;
        } else if (command === "listChannels") {
          this.listChannels = (peerInfo) ? peerInfo : [];
        } else if (command === "listInvoices") {
          this.listInvoices = peerInfo;
        }
      });
    },
  },
  computed: {
    alicesChannels() {
      if (this.listChannels && this.listChannels.length > 1 && this.listChannels[0].channels_) {
        return this.listChannels[0].channels_;
      }
      return [];
    },
    bobsChannels() {
      if (this.listChannels && this.listChannels.length > 1 && this.listChannels[1].channels_) {
        return this.listChannels[1].channels_;
      }
      return [];
    },
    alicesTxs() {
      if (this.getTransactions && this.getTransactions.length > 1 && this.getTransactions[0].transactions_) {
        return this.getTransactions[0].transactions_;
      }
      return [];
    },
    bobsTxs() {
      if (this.getTransactions && this.getTransactions.length > 1 && this.getTransactions[1].transactions_) {
        return this.getTransactions[1].transactions_;
      }
      return [];
    },
  }
};
</script>
