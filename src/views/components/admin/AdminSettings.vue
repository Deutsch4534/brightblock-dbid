<template>
<div>
  <h2 class="title">Application Settings</h2>
  <div class="row">
    <div class="col-md-2">Domain:</div>
    <div class="col-md-10">{{ constants.domain }}</div>
  </div>
  <div class="row">
    <div class="col-md-2">Environment:</div>
    <div class="col-md-10">{{ constants.nodeEnv }}</div>
  </div>
  <h3>API Settings</h3>
  <div class="row">
    <div class="col-md-2">Shape Shift:</div>
    <div class="col-md-10">{{ constants.shapeShiftUrl }}</div>
  </div>
  <div class="row">
    <div class="col-md-2">Gaia Hub:</div>
    <div class="col-md-10">{{ constants.gaiaHubUrl }}</div>
  </div>
  <div class="row">
    <div class="col-md-2">Search:</div>
    <div class="col-md-10">{{ constants.searchUrl }}</div>
  </div>
  <div class="row">
    <div class="col-md-2">Eth Gateway:</div>
    <div class="col-md-10">{{ constants.ethGatewayUrl }}</div>
  </div>

  <h3>Debug Settings</h3>
  <div class="row">
    <div class="col-md-2">Debug Mode:</div>
    <div class="col-md-10"><mdb-btn class="btn teal lighten-1" @click="toggleDebugMode">{{debugModeLabel}}</mdb-btn></div>
  </div>
  <div class="row">
    <div class="col-md-2">Power User:</div>
    <div class="col-md-10"><mdb-btn class="btn teal lighten-1" @click="togglePowerUser">{{powerUserLabel}}</mdb-btn></div>
  </div>

  <h3>Feature Settings</h3>
  <div class="row">
    <div class="col-md-2">Bitcoin:</div>
    <div class="col-md-10"><mdb-btn class="btn teal lighten-1" @click="toggleBtcFeature">{{btcModeLabel}}</mdb-btn></div>
  </div>
  <div class="row">
    <div class="col-md-2">Ethereum:</div>
    <div class="col-md-10"><mdb-btn class="btn teal lighten-1" @click="toggleEthFeature">{{ethModeLabel}}</mdb-btn></div>
  </div>
  <div class="row">
    <div class="col-md-2">Auctions:</div>
    <div class="col-md-10"><mdb-btn class="btn teal lighten-1" @click="toggleAuctionsFeature">{{auctionsModeLabel}}</mdb-btn></div>
  </div>

  <h3>Gaia Test Settings</h3>
  <div class="row">
    <div class="col-sm-12">Only works on localhost and mike.personal.id as the oauth token.</div>
    <div class="col-md-2"></div>
    <div class="col-md-10">
      <mdb-btn class="btn teal lighten-1" @click="gaiaHubInfoCheck">Check Hub Info</mdb-btn>
      <mdb-btn class="btn teal lighten-1" @click="gaiaListFilesCheck">Check List Files</mdb-btn>
      <mdb-btn class="btn teal lighten-1" @click="gaiaStoreCheck">Store Random File</mdb-btn>
    </div>
  </div>
  <div class="row" v-if="gaiaResult">
    <div class="col-md-2"></div>
    <div class="col-md-10">{{gaiaResult}}</div>
  </div>
  <div class="row">
    <div class="col-md-2"></div>
    <div class="col-md-10">
      <ul>
        <li v-for="(index, file) in gaiaListResult" :key="index">{{file}}: <a href="#" @click.prevent="gaiaGetFile(index)">{{ index }}</a></li>
      </ul>
    </div>
  </div>
  <div class="row" v-if="gaiaFileResult">
    <div class="col-md-2"></div>
    <div class="col-md-10">{{gaiaFileResult}}</div>
  </div>

  <h3>Webrtc Settings</h3>
  <div class="row">
    <div class="col-md-2">Tokbox API:</div>
    <div class="col-md-10">{{ constants.apiKey }}</div>
  </div>

  <h3>Ethereum Settings</h3>
  <div class="row">
    <div class="col-md-2">Contract API:</div>
    <div class="col-md-10">{{ clientState.contractAddress }}</div>
  </div>
  <div class="row">
    <div class="col-md-2">Load Contract:</div>
    <div class="col-md-10">
      <div>
        <input v-model="contractAddress" class="form-control" placeholder="Drop contract address here: 0x..." v-on:keyup.13="loadContract"></input>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-2">Client:</div>
    <div class="col-md-10">{{ clientState.client }}</div>
  </div>
  <div class="row">
    <div class="col-md-2">Meta Mask:</div>
    <div class="col-md-10">{{ clientState.metaMaskNetwork.networkId }} ({{ clientState.metaMaskNetwork.networkName }})</div>
  </div>
  <div class="row">
    <div class="col-md-2">Expected:</div>
    <div class="col-md-10">{{ networkExpected }}</div>
  </div>
  <div class="row">
    <div class="col-md-2">Items Registered:</div>
    <div class="col-md-10">{{ clientState.numbItems }}</div>
  </div>
</div>
</template>

<script>
import ethereumService from "@/services/ethereumService";
import myAccountService from "@/services/myAccountService";
import axios from "axios";
import { mdbContainer, mdbRow, mdbCol, mdbInput, mdbTextarea, mdbBtn, mdbIcon, mdbModal, mdbModalHeader, mdbModalBody, mdbModalFooter } from 'mdbvue';

const gaiaAuthToken =
  "v1:eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJnYWlhQ2hhbGxlbmdlIjoiW1wiZ2FpYWh1YlwiLFwiMjAxOFwiLFwiXCIsXCJibG9ja3N0YWNrX3N0b3JhZ2VfcGxlYXNlX3NpZ25cIl0iLCJodWJVcmwiOiJodHRwczovL2dhaWEuYnJpZ2h0YmxvY2sub3JnIiwiaXNzIjoiMDIyNmVlZjk2MDI4YWYwMTQ1M2YwYzk2NGE0MTcxMGEzZDgwNGQ3MGY2MTgyOTZkMGVjMzczY2MxMGFhYjEwNjM4Iiwic2FsdCI6ImRmODk3YWRkMjVjZDBiNjE1MjUxZjViMmY1OGI3ODllIn0.FoeOdvMqWFU9tqVtToUHE7axjsA0YK_YArhFCXQ0eytRvJbkeW2S1h2V_iQF2311wq322CaPoIRZIxC6Rgqccg";

export default {
  data() {
    return {
      gaiaHubUrl: "",
      address: "",
      network: "",
      networkExpected: "",
      contract: "",
      numberOfItems: "",
      contractAddress: "",
      gaiaListResult: [],
      gaiaResult: null,
      gaiaStoreResult: null,
      gaiaFileResult: null
    };
  },
  created() {
    this.gaiaHubUrl = this.$store.state.constants.gaiaHubUrl;
    this.network = ethereumService.getNetworkType();
    this.networkExpected = this.$store.state.constants.networkExpected;
    let hubConfig = localStorage.getItem("blockstack-gaia-hub-config");
    let hubJSON = JSON.parse(hubConfig);
    this.address = hubJSON.address;
  },
  methods: {
    toggleDebugMode() {
      this.$store.commit("toggleDebugMode");
    },
    togglePowerUser() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      if (myProfile.showAdmin) {
        myProfile.showAdmin = false;
      } else {
        myProfile.showAdmin = true;
      }
      this.$store.commit("myAccountStore/myProfile", myProfile);
    },
    toggleAuctionsFeature() {
      this.$store.commit("toggleFeatureAuctions");
    },
    toggleEthFeature() {
      this.$store.commit("toggleFeatureEthereum");
    },
    toggleBtcFeature() {
      this.$store.commit("toggleFeatureBitcoin");
    },
    listFilesUrl(file) {
      return this.gaiaHubUrl + "/" + this.address + "/" + file;
    },
    gaiaHubInfoCheck() {
      this.gaiaFileResult = null;
      this.gaiaListResult = [];
      this.gaiaResult = null;
      let callInfo = {
        method: "get",
        url: this.gaiaHubUrl + "/hub_info",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + gaiaAuthToken
        }
      };
      axios
        .get(callInfo.url, { headers: callInfo.headers })
        .then(response => {
          this.gaiaResult = response.data;
        })
        .catch(e => {
          this.gaiaResult = e.message;
        });
    },
    gaiaListFilesCheck() {
      this.gaiaFileResult = null;
      this.gaiaListResult = [];
      this.gaiaResult = null;
      let callInfo = {
        method: "get",
        url: this.gaiaHubUrl + "/list-files/" + this.address,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + gaiaAuthToken
        }
      };
      let $self = this;
      axios
        .get(callInfo.url, { headers: callInfo.headers })
        .then(response => {
          $self.gaiaListResult = response.data;
        })
        .catch(e => {
          $self.gaiaResult = e.message;
        });
    },
    gaiaStoreCheck() {
      this.gaiaResult = null;
      this.gaiaFileResult = null;
      let data = {
        test: "test storing a file in aws s3 bucket via gaia",
        random: Math.random().toString(36)
      };
      axios({
        method: "post",
        url:
          this.gaiaHubUrl + "/store/" + this.address + "/gaia_store_test.json",
        data: data,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + gaiaAuthToken
        }
      })
        .then(response => {
          this.gaiaStoreResult = response.data;
          this.gaiaGetFile("gaia_store_test.json");
        })
        .catch(e => {
          this.gaiaStoreResult = e.message;
        });
    },
    gaiaGetFile(file) {
      this.gaiaResult = null;
      let callInfo = {
        method: "get",
        url: this.gaiaHubUrl + "/read/" + this.address + "/" + file,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + gaiaAuthToken
        }
      };
      let $self = this;
      axios
        .get(callInfo.url, { headers: callInfo.headers })
        .then(response => {
          $self.gaiaFileResult = response.data;
        })
        .catch(e => {
          $self.gaiaFileResult = e.message;
        });
    },
    loadContract() {
      ethereumService.loadContract(this.contractAddress);
      location.reload();
    }
  },
  computed: {
    clientState() {
      let clientState = this.$store.state.ethStore.clientState;
      return clientState;
    },
    debugMode() {
      let debugMode = this.$store.state.constants.debugMode;
      return debugMode;
    },
    powerUserLabel() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      if (myProfile.showAdmin) {
        return "on";
      } else {
        return "off";
      }
    },
    debugModeLabel() {
      let debugMode = this.$store.getters["isDebugMode"];
      if (debugMode) {
        return "on";
      } else {
        return "off";
      }
    },
    auctionsModeLabel() {
      let fa = this.$store.state.constants.featureAuctions;
      if (fa) {
        return "on";
      } else {
        return "off";
      }
    },
    ethModeLabel() {
      let fa = this.$store.state.constants.featureEthereum;
      if (fa) {
        return "on";
      } else {
        return "off";
      }
    },
    btcModeLabel() {
      let fa = this.$store.state.constants.featureBitcoin;
      if (fa) {
        return "on";
      } else {
        return "off";
      }
    },
    constants() {
      return this.$store.state.constants;
    },
    localComputed() {
      return "hi there!";
    }
  },
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbInput,
    mdbTextarea,
    mdbBtn,
    mdbIcon,
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
    mdbModalFooter
  }
};
</script>
