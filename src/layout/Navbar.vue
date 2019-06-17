<template>
<header class="mb-5">
<login-tab-modal v-if="showModal" :modal="showModal" @closeModal="closeModal"/>
<div class="d-flex bg-white text-dark border-bottom border-dark">
  <div class="mr-auto p-0 ml-4"><router-link to="/" class="nav-link navbar-link"><img :src="logo" width="100px" alt="main logo"></router-link></div>
  <div class="pt-3"><router-link class="nav-link navbar-link mr-1" to="/buy">BUY</router-link></div>
  <div class="pt-3"><router-link class="nav-link navbar-link mr-1" to="/sell">SELL</router-link></div>
  <div class="mr-4 pt-3" v-if="!loggedIn"><a v-on:click.prevent="loginMultiPlayer" class="nav-link navbar-link">LOGIN</a></div>
  <div class="mr-4 pt-2" v-else><account-links @closeMenu="closeMenu"/></div>
</div>
</header>
</template>

<script>
import AccountLinks from "@/layout/AccountLinks";
import PortfolioLinks from "@/layout/PortfolioLinks";
import UploadLinks from "@/layout/UploadLinks";
import artworkSearchService from "@/services/artworkSearchService";
import myAccountService from "@/services/myAccountService";
import LoginTabModal from "@/views/components/utils/LoginTabModal";

export default {
  name: 'Navbar',
  data() {
    return {
      query: '',
      link1: "team",
      link2: "mission",
      link3: "contact",
      link4: "donate",
      title: "title",
      taglink2: '',
      toggleClass: '',
      showModal: false,
      logo: require("@/assets/img/logo/dB_short_433x200_dark.png")
    };
  },
  components: {
    LoginTabModal,
    UploadLinks,
    PortfolioLinks,
    AccountLinks,
  },
  created() {
    this.getContent();
    this.$store.dispatch("assetStore/lookupAssetsByBuyer").then((assets) => {
    });
  },
  beforeDestroy: function () {
  },
  computed: {
    featureAuctions() {
      return this.$store.state.constants.featureAuctions;
    },
    loggedIn() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return myProfile.loggedIn;
    },
    hasInvoices() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      let assets = this.$store.getters["assetStore/getAssetsBuying"](myProfile.username);
      if (!assets) {
        return 0;
      }
      return assets.length;
    }
  },
  methods: {
    getContent() {
      /**
      this.$prismic.client.getSingle("navbar").then(document => {
        this.link1 = document.data.link1[0].text;
        this.link2 = document.data.link2[0].text;
        this.link3 = document.data.link3[0].text;
        this.link4 = document.data.link4[0].text;
        this.title = document.data.title[0].text;
        this.taglink2 = document.data.taglink2[0].text;
      });
      **/
    },
    loginMultiPlayer: function () {
      let res = myAccountService.loginMultiPlayer();
      //this.$store.dispatch("myAccountStore/fetchMyAccount");
      this.$router.push({ path: "/" });
      this.showModal = true;
      return res;
    },
    closeMenu() {
      //this.toggleClass = "";
      let togglee = document.getElementById("navbarSupportedContent");
      if (this.toggleClass === "show") {
        this.toggleClass = "";
        togglee.style.display = "none";
      }
    },
    closeModal: function() {
      this.showModal = false;
    },
    doSearch() {
      let qString = this.query;
      if (!this.query || this.query.length === 0) {
        qString = "*";
      }
      artworkSearchService.newQuery(this.$store, {field: "title", query: qString});
      this.$router.push("/search?query=" + qString);
    },
  },
  mounted() {
  },
  beforeDestroy() {
  },
  watch: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
