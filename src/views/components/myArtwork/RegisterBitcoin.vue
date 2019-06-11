<template>
<mdb-card-body v-if="!loading">
  <mdb-card-title>
    <mdb-popover trigger="click" :options="{placement: 'top'}">
      <div class="popover">
        <div class="popover-header">
          Bitcoin Blockchain
        </div>
        <div class="popover-body">
          The bitcoin address of the artist can be displayed in the certificate of authenticity
          of the artwork.
        </div>
      </div>
      <a @click.prevent="" slot="reference">
        Register Artwork on Bitcoin Blockchain <span v-if="bitcoinState">({{bitcoinState.chain}} chain)</span>
      </a>
    </mdb-popover>
  </mdb-card-title>
  <mdb-card-text>
    We will create a piece of data that is unique to you and this piece of artwork
    and store it the bitcoin blockchain where it can be used to prove your
    ownership. You'll then be able to generate a Certificate of Ownership.
    <br/><br/>
    <a @click.prevent="showArtworkHash = !showArtworkHash">Show this data!</a>
  </mdb-card-text>
  <mdb-card-text v-if="showArtworkHash">
    {{artworkHash}}
  </mdb-card-text>
  <div v-if="!asset.assetRegistrationTx">
    <a class="black-text d-flex justify-content-end" v-if="!artwork.bitcoinTx"><mdb-btn class="btn teal lighten-1" size="md" @click="registerArtworkBitcoin()">Register</mdb-btn></a>
  </div>
  <div v-else>
    asset registered in transaction {{asset.assetRegistrationTx}}
  </div>
</mdb-card-body>
</template>

<script>
import utils from "@/services/utils";
import notify from "@/notify";
import moment from "moment";
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import { mdbPopover, mdbCol, mdbView, mdbMask, mdbRow, mdbContainer, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Registration",
  components: {
    mdbPopover,
    mdbContainer,
    mdbCol,
    mdbMask,
    mdbView,
    mdbRow,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn
  },
  props: {
    artwork: {
      type: Object,
      default() {
        return {};
      }
    },
    myProfile: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      message: null,
      artworkId: null,
      showArtworkHash: null,
      loading: true,
      asset: null
    };
  },
  mounted() {
    let $self = this;
    let assetHash = utils.buildBitcoinHash($self.artwork);
    this.$store.dispatch("assetStore/lookupAssetByHash", assetHash).then(asset => {
      if (asset) {
        $self.asset = asset;
        $self.loading = false;
      } else {
        $self.$store.dispatch("assetStore/initialiseAsset", $self.artwork).then(asset => {
          $self.asset = asset;
        });
        $self.loading = false;
      }
    });
  },
  computed: {
    artworkHash() {
      return utils.buildBitcoinHash(this.artwork);
    },
    bitcoinState() {
      let state = this.$store.getters["assetStore/getBitcoinConfig"];
      return state;
    },
    myArtist() {
      return this.$store.getters["userProfilesStore/getProfile"](this.artwork.artist);
    },
    canRegister() {
      try {
        return this.artwork.artwork.length > 0;
      } catch (e) {
        return false;
      }
    }
  },
  methods: {
    registerArtworkBitcoin: function() {
      let artwork = this.artwork;
      this.modal = true;
      try {
        let $self = this;
        this.$emit("registerBitcoin", {error: false, message: "Registering please wait.."});
        this.$store.dispatch("assetStore/initialiseAsset", artwork).then(asset => {
          bitcoinService.registerAsset(asset).then(asset => {
            if (!asset || !asset.assetRegistrationTx) {
              $self.$emit("registerBitcoin", {error: true, message: "transaction failed - please try again later."});
            } else {
              $self.asset = asset;
              $self.$store.dispatch("myArtworksStore/updateArtwork", {artwork: artwork, updateProvData: false});
              $self.$emit("registerBitcoin", {error: false, message: "Registered artwork on the bitcoin blockchain."});
            }
          })
            .catch(err => {
              console.log(err);
              $self.$emit("registerBitcoin", {failed: true, message: err.message});
            });
        });
      } catch (err) {
        $self.$emit("registerBitcoin", {error: true, message: 'transaction failed - please try again later'});
        console.log(err);
      }
    },
  }
};
</script>
