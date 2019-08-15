<template>
<mdb-navbar-nav class="" v-if="loggedIn">
  <router-link class="nav-link navbar-link text-nowrap btn btn-sm bg-light px-4" style="max-width: 100px; font-weight: 600;" to="/user/settings">Settings</router-link>
  <router-link class="nav-link navbar-link text-nowrap btn btn-sm bg-light px-4" style="max-width: 100px; font-weight: 600;" to="/admin/settings">Admin</router-link>
  <a href="#" class="nav-link navbar-link text-nowrap btn btn-sm bg-light px-4 " style="max-width: 100px; font-weight: 600;" @click.prevent="logout">Logout</a>
</mdb-navbar-nav>
<!--
<mdb-navbar-nav class="" v-else>
  <a v-on:click.prevent="loginMultiPlayer" class="nav-link navbar-link">Login <i class="fas fa-sign-in-alt"></i></a>
</mdb-navbar-nav>
-->
</template>

<script>
import { mdbBadge, mdbNavbar, mdbNavItem, mdbNavbarNav, mdbNavbarToggler, mdbBtn, mdbContainer, mdbCollapse, mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbNavbarBrand, mdbIcon, mdbRow } from 'mdbvue';
import myAccountService from "brightblock-lib/src/services/myAccountService";

export default {
  name: 'AccountLinksXs',
  components: {
    mdbNavbar,
    mdbNavItem,
    mdbNavbarNav,
    mdbNavbarToggler,
    mdbBtn,
    mdbContainer,
    mdbDropdown,
    mdbCollapse,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbInput,
    mdbNavbarBrand,
    mdbBadge,
    mdbIcon,
    mdbRow
  },
  data() {
    return {
      showSearch: false,
      query: null
    };
  },
  mounted() {
  },
  computed: {
    showAdmin() {
      return this.$store.getters["myAccountStore/getMyProfile"].showAdmin;
    },
    hasGalleries() {
      let galleries = this.$store.getters["galleryStore/getMyGalleries"];
      if (!galleries || !galleries.records) {
        return 0;
      }
      return galleries.records.length;
    },
    username() {
      return this.$store.state.myAccountStore.myProfile.name;
    },
    avatarUrl() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      if (myProfile.loggedIn) {
        if (myProfile.avatarUrl) {
          return myProfile.avatarUrl;
        } else {
          return '<i class="far fa-user"></i>'
        }
      } else {
        return '<span class="icon-user"></span>';
      }
    },
    avatar() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return myProfile.avatarUrl;
    },
    loggedIn() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return myProfile.loggedIn;
    }
  },
  methods: {
    logout() {
      localStorage.clear();
      sessionStorage.clear();
      myAccountService.logout();
      this.$store.dispatch("myAccountStore/fetchMyAccount");
      this.$router.push("/");
      this.$emit("closeMenu");
    },
    closeMenu() {
      this.$emit("closeMenu");
    }
  }
};

</script>
<style scoped>
</style>
