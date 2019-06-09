<template>
<div class="row py-0 py-md-2 d-flex">
  <div class="col-md-4">
    <img :src="myProfile.avatarUrl" class="img-fluid"/>
  </div>
  <div class="col-md-8">
    <p>Some of your profile data such as the avatar comes from your blockstack profile.</p>
    <p><a href="http://localhost:8888/profiles" target="_blank" rel="noreferrer">Edit blockstack profile <mdb-icon icon="external-link-square-alt" /></a></p>
  </div>
</div>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol, mdbBtn, mdbIcon, mdbInput, mdbTextarea, mdbCard, mdbCardBody } from 'mdbvue';

  export default {
    name: 'AuctionSection',
    components: {
      mdbContainer,
      mdbRow,
      mdbCol,
      mdbBtn,
      mdbIcon,
      mdbInput,
      mdbTextarea,
      mdbCard,
      mdbCardBody,
    },
    props: {
      myProfile: null,
    }
  };
</script>
