<template>
<p>Listed: <!--by; <a class="font-weight-bold dark-grey-text">{{ownerProfile.name}}</a> --> {{getDate}}</p>
</template>

<script>
import moment from "moment";

export default {
  name: "ItemImageListView",
  components: {
  },
  props: {
    owner: null, created: null
  },
  data() {
    return {};
  },
  mounted() {
  },
  methods: {
  },
  computed: {
    ownerProfile() {
      let myProfile = this.$store.getters["userProfilesStore/getProfile"](this.owner);
      return myProfile ? myProfile : {};
    },
    getDate() {
      if (this.created) {
        return moment(this.created).format("MM-DD-YY");
      }
      return;
    },
  }
};
</script>
<style scoped>
</style>
