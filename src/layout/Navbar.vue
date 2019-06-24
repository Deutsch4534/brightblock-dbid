<template>
<header class="" style="height: 70px;">
<login-tab-modal v-if="showModal" :modal="showModal" @closeModal="closeModal"/>
<div class="d-flex justify-content-between blue-grey lighten-1 pb-0" style="position: relative; top: 0px;height: 69px;">
  <div class="p-0 d-none d-sm-block"><router-link to="/index" class="nav-link navbar-link"><img :src="logo" width="100px" alt="main logo"></router-link></div>
  <div class="pt-2 d-xs-block d-none text-danger" style="font-size: 1.8rem; position: relative; top: 2px;"><router-link to="/" class="nav-link navbar-link">dB</router-link></div>
  <!-- #33b5e5 #ffea00 #ff8800 #64dd17 #ab47bc -->
  <div class="d-sm-none d-xs-block text-center pt-4 " style="position: relative; top: -2px;">
    <router-link class="d-inline btn btn-sm my-auto p-2" style="background-color: #64dd17;" to="/buy"><small>BUY <i class="fas fa-caret-up"></i></small></router-link>
    <router-link class="d-inline btn btn-sm bg-danger my-auto " style="background-color: #ffea00;" to="/sell"><small>SELL <i class="fas fa-caret-down"></i></small></router-link>
  </div>
  <div class="d-none d-sm-block text-center pt-4" style="position: relative; top: -2px;">
    <router-link class="d-inline btn btn-sm bg-success" style="background-color: #64dd17;" to="/buy">BUY <i class="fas fa-caret-up"></i></router-link>
    <router-link class="d-inline btn btn-sm bg-danger" style="background-color: #ffea00;" to="/sell">SELL <i class="fas fa-caret-down"></i></router-link>
  </div>

  <div class="pt-2" style="position: relative; top: 2px;" v-if="!loggedIn"><a v-on:click.prevent="loginMultiPlayer" class="nav-link navbar-link">Login <i class="fas fa-sign-in-alt"></i></a></div>
  <div class="pt-2" style="position: relative; top: 2px;" v-else><account-links @closeMenu="closeMenu"/></div>
</div>
<!-- #33b5e5 #ffea00 #ff8800 #64dd17 #ab47bc -->
<div class="d-flex" style="height: 5px;">
  <div class="flex-fill" style="border-bottom: 3pt solid #33b5e5;">&nbsp;</div>
  <div class="flex-fill" style="border-bottom: 3pt solid #ffea00;">&nbsp;</div>
  <div class="flex-fill" style="border-bottom: 3pt solid #ff8800;">&nbsp;</div>
  <div class="flex-fill" style="border-bottom: 3pt solid #64dd17;">&nbsp;</div>
  <div class="flex-fill" style="border-bottom: 3pt solid #ab47bc;">&nbsp;</div>
</div>
</header>
</template>

<script>
import AccountLinks from "@/layout/AccountLinks";
import PortfolioLinks from "@/layout/PortfolioLinks";
import UploadLinks from "@/layout/UploadLinks";
import artworkSearchService from "@/services/artworkSearchService";
import myAccountService from "@/services/myAccountService";
import LoginTabModal from "@/pages/components/user-settings/LoginTabModal";

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
