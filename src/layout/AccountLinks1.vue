<template>
<mdb-dropdown tag="li" class="nav-item">
  <mdb-dropdown-toggle tag="div"  navLink color="" slot="toggle" waves-fixed>
    <img class="avatar" :src="avatarUrl" v-if="avatar"/>
    <mdb-icon icon="user-circle" v-else/>
  </mdb-dropdown-toggle>
  <mdb-dropdown-menu dropleft>
    <mdb-dropdown-item tag="div">
     <strong>{{ username }}</strong>
    </mdb-dropdown-item>
    <div class="dropdown-divider"></div>
    <mdb-dropdown-item>
      <router-link class="dropdown-item" to="/user/settings">Settings</router-link>
    </mdb-dropdown-item>
    <mdb-dropdown-item v-if="showAdmin">
      <router-link class="dropdown-item" to="/admin/settings">Admin</router-link>
    </mdb-dropdown-item>
    <div class="dropdown-divider"></div>
    <mdb-dropdown-item>
      <a href="#" class="dropdown-item" @click.prevent="logout">Logout</a>
    </mdb-dropdown-item>
  </mdb-dropdown-menu>
</mdb-dropdown>
</template>

<script>
import { mdbBadge, mdbNavbar, mdbNavItem, mdbNavbarNav, mdbNavbarToggler, mdbBtn, mdbContainer, mdbCollapse, mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbNavbarBrand, mdbIcon, mdbRow } from 'mdbvue';
import myAccountService from "@/services/myAccountService";

export default {
  name: 'AccountLinks',
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
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 25px;
}

.fa-user-circle { font-size: 1.7rem; padding-bottom: 4px;}

</style>
