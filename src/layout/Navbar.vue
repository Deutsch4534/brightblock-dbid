<template>
<header>
<login-tab-modal v-if="showModal" :modal="showModal" @closeModal="closeModal"/>
<div class="d-flex bg-dark text-white">
  <div class="mr-auto p-2"><router-link to="/" class="nav-link navbar-link">DBIDIO</router-link></div>
  <div class="py-2"><router-link class="nav-link navbar-link" to="/about">about</router-link></div>
  <div class="py-2" v-if="loggedIn"><account-links @closeMenu="closeMenu"/></div>
  <div class="py-2" v-else><a v-on:click.prevent="loginMultiPlayer" class="nav-link navbar-link">Login</a></div>
</div>
<div class="d-flex justify-content-between">
  <div class="py-2"><router-link class="nav-link navbar-link" to="/buy">buy</router-link></div>
  <div class="py-2"><router-link class="nav-link navbar-link" to="/sell">sell</router-link></div>
  <div class="py-2"><router-link class="nav-link navbar-link" to="/things">things</router-link></div>
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
      logo: require("@/assets/img/logo/Radicle_logo-test.png")
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
    toggleNav() {
      let togglee = document.getElementById("navbarSupportedContent");
      if (this.toggleClass === "show") {
        this.toggleClass = "";
        togglee.style.display = "none";
      } else {
        this.toggleClass = "show";
        togglee.style.display = "";
        togglee.style.display = "block";
        //document.getElementById("navbarSupportedContent").attr("style", "display: block !important");
      }
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
.navbar {
  box-shadow: none;
  min-height: 60px;
}
.navbar-link {
  text-transform: lowercase;
  font-size: 1.3em;
  font-weight: 900;
}
.navbar-toggler-icon {
  background-color: blue;
}
.navbar .dropdown-menu a {
  font-weight: 900;
}
@media (max-width: 1200px) {
    .navbar {
      justify-content: space-between;
    }
    .navbar-expand-lg .navbar-toggler {
        display: block;
    }
    .navbar-header {
        float: none;
    }
    .navbar-toggler {
        display: block;
        float: right;
    }
    .navbar-collapse {
        border-top: 1px solid transparent;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
    }
    .navbar-collapse.collapse {
      display: none;
    }
    .navbar-nav {
        float: none!important;
        margin: 7.5px -15px;
    }
    .navbar-nav>li {
        float: none;
    }
    .navbar-nav>li>a {
        padding-top: 10px;
        padding-bottom: 10px;
    }
}

.show {
  display: block;
  position: absolute;
  right: 0px;
  left: 0px;
  top: 60px;
  bottom: 0px;
  background-color: #4EAC9A;
  color: white;
  font-weight: 900;
  z-index: 10;
  padding: 10px 0 10px 30px;
  min-height: calc(100vh);
}

.navbar .md-form {
  margin: 0;
}

i.fa-search {
  color: gray;
  transform: rotate(90deg);
  font-size: 1.3em;
}
.search-form input, .login-link, .nav-cta { font-size: 1.0em; font-weight: normal; }
.search-form input { border-bottom: none; }
.search-form input:focus { box-shadow: none!important; border-bottom: 1pt solid gray!important; }

.search-form input::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: grey;
  font-size: 1.3em;
  text-transform: capitalize;
}
.search-form input::-moz-placeholder { /* Firefox 19+ */
  color: grey;
  font-size: 1.3em;
  text-transform: capitalize;
}
.search-form input:-ms-input-placeholder { /* IE 10+ */
  color: grey;
  font-size: 1.3em;
  text-transform: capitalize;
}
.search-form input:-moz-placeholder { /* Firefox 18- */
  color: grey;
  font-size: 1.3em;
  text-transform: capitalize;
}
.search-form button.transparent { border: none; background: transparent; color: black; }


</style>
