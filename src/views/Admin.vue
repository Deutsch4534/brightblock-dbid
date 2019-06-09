<template>
<div class="container mt-5">
  <div class="row">
    <div class="col-md-2">
      <h5><small>Admin Actions</small></h5>
      <ul class="list-unstyled">
        <li><router-link to="/admin/settings">Settings</router-link to></li>
        <li><router-link to="/admin/bitcoin">Bitcoin</router-link to></li>
        <li><router-link to="/admin/lightning">Lightning</router-link to></li>
        <li><router-link to="/admin/registrations">Ethereum</router-link to></li>
        <li><router-link to="/admin/build-index">Build Index</router-link to></li>
        <li><router-link to="/admin/query-index">Query Index</router-link to></li>
      </ul>
    </div>
    <div class="col-md-10">
      <router-view></router-view>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "home",
  bodyClass: "index-page",
  props: {
    image: {
      type: String,
      default: require("@/assets/img/faces/avatar.jpg")
    },
    signup: {
      type: String,
      default: require("@/assets/img/missing/artwork-missing.jpg")
    }
  },
  data() {
    return {
      firstname: null,
      email: null,
      password: null
    };
  },
  methods: {},
  computed: {
    artworks() {
      return this.$store.getters["artworkSearchStore/homePageArtworks"];
    },
    signupImage() {
      return {
        backgroundImage: `url(${this.signup})`
      };
    }
  },
  mounted() {}
};
</script>
<style>
.section-download {
  .btn + .btn {
    margin-left: 5px;
  }
}

@media all and (min-width: 991px) {
  .btn-container {
    display: flex;
  }
}
</style>
