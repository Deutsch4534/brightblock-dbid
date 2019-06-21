<template>
<header class="" style="">
<login-tab-modal v-if="showModal" :modal="showModal" @closeModal="closeModal"/>
<div class="d-flex blue-grey lighten-1 pb-0" style="border-bottom: 2pt solid #64dd17; position: relative; top: 2px;">
  <div class="mr-auto p-0 px-4 d-none d-sm-block" style="border-bottom: 2pt solid #33b5e5; position: relative; top: 2px;"><router-link to="/" class="nav-link navbar-link"><img :src="logo" width="100px" alt="main logo"></router-link></div>
  <div class="mr-auto pt-2 d-xs-block d-none text-danger" style="font-size: 1.8rem; border-bottom: 2pt solid #33b5e5; position: relative; top: 2px;"><router-link to="/" class="nav-link navbar-link">dB</router-link></div>
  <!-- #33b5e5 #ffea00 #ff8800 #64dd17 #ab47bc -->
  <div class="text-center mr-auto pt-4" style="border-bottom: 2pt solid #33b5e5; position: relative; top: 2px;">
    <router-link class="btn btn-sm bg-success mr-1 ml-3" style="display:inline;" to="/buy">BUY <i class="fas fa-caret-up"></i></router-link>
    <router-link class="btn btn-sm bg-danger ml-1 mr-3" style="display:inline;" to="/sell">SELL <i class="fas fa-caret-down"></i></router-link>
  </div>

  <div class="pr-3 pt-2" style="border-bottom: 2pt solid #ab47bc; position: relative; top: 2px;" v-if="!loggedIn"><a v-on:click.prevent="loginMultiPlayer" class="nav-link navbar-link">Login <i class="fas fa-sign-in-alt"></i></a></div>
  <div class="pl-3 pt-2" style="border-bottom: 2pt solid #ab47bc; position: relative; top: 2px;" v-else><account-links @closeMenu="closeMenu"/></div>
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
