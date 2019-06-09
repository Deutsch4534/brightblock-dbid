<template>
<div>
  <mdb-dropdown>
    <mdb-dropdown-toggle class="black-text" size="lg" style="border-radius: 40px" slot="toggle"><mdb-icon icon="share-alt" /></mdb-dropdown-toggle>
    <mdb-dropdown-menu dropleft>
      <mdb-dropdown-item><a :href="myTweetUrl" class="twitter-share-button" data-show-count="true"><mdb-icon fab icon="twitter" /> share on twitter</a></mdb-dropdown-item>
      <mdb-dropdown-item>
        <div class="fb-share-button" :data-href="myFBPostDataHref" data-layout="button_count">
          <a target="_blank" :href="myFBPostUrl" ><mdb-icon fab icon="facebook" /> share on facebook</a>
        </div>
      </mdb-dropdown-item>
      <!--
      <mdb-dropdown-item>
        These are external links - copy link
        <br/>
        <input class="form-control" type="text" :value="myPageUrl"/>
      </mdb-dropdown-item>
      -->
    </mdb-dropdown-menu>
  </mdb-dropdown>
</div>
</template>

<script>
import { mdbIcon, mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "BeSocial",
  components: {
    mdbIcon,
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle
  },
  props: ["myPageUrl", "artist"],
  data() {
    return {
    };
  },
  mounted() {
  },
  computed: {
    myTweetUrl() {
      let tweetBody = "Check out this artwork by " + this.artist;
      return "https://twitter.com/intent/tweet?text=" + tweetBody + "&amp;url=" + this.myPageUrl;
    },
    myFBPostDataHref() {
      return this.myPageUrl;
    },
    myFBPostUrl() {
      let pathname = encodeURI("https://radicle.art" + location.pathname);
      let options = "u=" + pathname;
      options += "&picture=https://radicle.art/static/logo-black-256x256.png";
      //options += "&name=Facebook%20Dialogs&caption=Reference%20Documentation";
      //options += "&description=Dialogs%20provide%20a%20simple,%20consistent%20interface%20for%20applications%20to%20interact%20with%20users.";
      //options += "&message=Facebook%20Dialogs%20are%20so%20easy!&redirect_uri=https://radicle.art/fbback&amp;src=sdkpreparse";
      return encodeURI("https://www.facebook.com/sharer/sharer.php?" + encodeURI(options));
    },
  },
  methods: {
  }
};
</script>
<style scoped>
.btn.dropdown-toggle { color: black; border-radius: 20px; }
.dropdown .dropdown-menu .dropdown-item,
.dropdown .dropdown-menu .dropdown-item:hover {
  background: initial;
  box-shadow: none;
  color: black!important;
}
.dropdown-toggle::after {
  display: none;
}

</style>
