<template>
<div class="py-0 py-md-2 d-flex">
  <div class="d-flex flex-column justify-content-center">
    <div class="d-flex justify-content-center" v-if="myProfile.avatarUrl"><img class="avatar" :src="myProfile.avatarUrl"/></div>
    <div class="d-flex justify-content-center" v-else><i class="fas fa-user fa-5x"></i></div>
    <div class="mt-5"><p>Some of your profile data such as the avatar comes from your blockstack profile.</p></div>
    <div><p><a href="http://localhost:8888/profiles" target="_blank" rel="noreferrer">Edit blockstack profile <i class="fas fa-external-link-alt"></i></a></p></div>
  </div>
</div>
</template>

<script>
  export default {
    name: 'AuctionSection',
    components: {
    },
    props: {
      myProfile: null,
    },
    computed: {
    },
  };
</script>
<style scoped>
.avatar {
  height: 150px;
}
</style>
