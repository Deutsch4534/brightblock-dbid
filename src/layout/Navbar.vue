<template>
<header class="" >
<login-tab-modal v-if="showModal" :modal="showModal" @closeModal="closeModal"/>
<mdb-navbar expand="medium" color="blue-grey lighten-1" light>
  <mdb-navbar-brand>
    <router-link to="/" class="nav-link navbar-link"><img :src="logo" width="90px" alt="main logo"></router-link>
  </mdb-navbar-brand>
  <mdb-navbar-toggler>
    <mdb-navbar-nav center class="">
        <router-link class="nav-link navbar-link text-nowrap btn btn-sm teal lighten-1 px-3 text-white" style="max-width: 100px; font-weight: 600;" to="/buy">BUY <i class="fas fa-angle-down text-dark ml-2 fa-1x"></i></router-link>
        <router-link class="nav-link navbar-link text-nowrap btn btn-sm deep-orange lighten-1 px-3 text-white" style="max-width: 100px; font-weight: 600;" to="/sell">SELL <i class="fas fa-angle-up text-dark mr-auto fa-1x"></i></router-link>
    </mdb-navbar-nav>
    <div class="d-md-none d-sm-block">
      <mdb-navbar-nav right class="">
        <account-links-xs/>
      </mdb-navbar-nav>
    </div>
    <div class="d-none d-md-block">
      <mdb-navbar-nav right class="" style="width: 120px;">
        <account-links v-if="loggedIn"/>
      </mdb-navbar-nav>
    </div>
    <mdb-navbar-nav tag="li" v-if="!loggedIn"  style="min-width: 100px;">
      <a v-on:click.prevent="loginMultiPlayer" class="nav-link navbar-link">Login <i class="fas fa-sign-in-alt"></i></a>
    </mdb-navbar-nav>
  </mdb-navbar-toggler>
</mdb-navbar>
<!-- #33b5e5 #ffea00 #ff8800 #64dd17 #ab47bc -->
<div class="d-flex align-items-bottom" style="height: 5px;">
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
import AccountLinksXs from "@/layout/AccountLinksXs";
import PortfolioLinks from "@/layout/PortfolioLinks";
import UploadLinks from "@/layout/UploadLinks";
import myAccountService from "@/services/myAccountService";
import LoginTabModal from "@/pages/components/user-settings/LoginTabModal";
import { mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem } from 'mdbvue';

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
      logo: require("@/assets/img/logo/dB_short_433x200_dark.png"),
      logoSm: require("@/assets/img/logo/dB_Blockstack_dark_transparent.png")
    };
  },
  components: {
    LoginTabModal, AccountLinksXs,
    UploadLinks,
    PortfolioLinks,
    AccountLinks,
    mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem
  },
  created() {
    this.getContent();
    this.$store.dispatch("assetStore/lookupAssetsByBuyer").then((assets) => {
    });
    this.$store.dispatch("assetStore/lookupAssetsBySeller").then((assets) => {
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
      //this.$router.push({ path: "/" });
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
    }
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
