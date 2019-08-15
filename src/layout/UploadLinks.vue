<template>
  <mdb-dropdown>
    <mdb-dropdown-toggle tag="a" navLink color="" slot="toggle"  waves-fixed>
      <span class="hi-link">Upload</span>
    </mdb-dropdown-toggle>

    <mdb-dropdown-menu class="dropdown-menu-right" id="userMainMenu" >

      <mdb-dropdown-item>
        <router-link to="/my-artwork/upload" class="dropdown-item"><a @click="closeMenu">Upload Artwork</a></router-link>
      </mdb-dropdown-item>

    </mdb-dropdown-menu>
  </mdb-dropdown>

</template>

<script>
import { mdbBadge, mdbNavbar, mdbNavItem, mdbNavbarNav, mdbNavbarToggler, mdbBtn, mdbContainer, mdbCollapse, mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbNavbarBrand, mdbIcon, mdbRow } from 'mdbvue';
import myAccountService from "brightblock-lib/src/services/myAccountService";

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
  },
  methods: {
    closeMenu() {
      this.$emit("closeMenu");
    }
  }
};

</script>
<style scoped>
.nav-link {
  text-transform: uppercase;
  font-size: 1.3em;
  font-weight: 900;
  text-transform: capitalize;
}
.dropdown-menu {
  min-width: 200px;
  border: none;
  top: 11px;
  border-radius: 0;
  margin-top: -5px;
}

.hi-link {
  color: teal; padding-left: 5px;
}
.show .hi-link {
  color: white;
}
.btn.dropdown-toggle { color: black; }
.dropdown .dropdown-menu .dropdown-item,
.dropdown .dropdown-menu .dropdown-item:hover {
  background: initial;
  box-shadow: none;
  color: initial!important;
}

.dropdown-submenu {
  position:relative;
}

.dropdown-submenu .dropdown-menu {
  top:0;
  left:100%;
}
.navbar .dropdown-menu a {
  font-weight: 900;
}

.dropdown-item {
  font-size: 1.9375rem;
  font-weight: 900;
}

.dropdown-item > a {
  padding: 0;
}

.fa-user-circle { font-size: 1.7rem; padding-bottom: 4px;}

</style>
