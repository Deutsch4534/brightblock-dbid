<template>
<footer class="container-fluid text-black py-2 px-3 page-footer bg-dark text-white" style="margin-top: 0px;">
  <div class="d-flex justify-content-between py-2">
    <div>
      <span class="mr-3"><router-link to="/contact"><i class="fas fa-envelope-square fa-2x"></i></router-link></span>
      <span class="mr-3"><router-link to="/help/topics">ABOUT</router-link></span>
    </div>
    <div class="d-none d-sm-block">
      <span class="copyright">© 2019 DBID.IO</span>
    </div>
    <div>
      <span class="mr-3"><a href="https://medium.com/@radiclesociety" target="_blank" rel="noreferrer"><i class="fab fa-medium fa-2x"></i></a></span>
      <span class="mr-3"><a href="https://twitter.com/radiclesociety" target="_blank" rel="noreferrer"><i class="fab fa-twitter fa-2x"></i></a></span>
      <span class="mr-3"><a href="https://github.com/radicleart/brightblock-dbid" target="_blank" rel="noreferrer"><i class="fab fa-github fa-2x"></i></a></span>
    </div>
  </div>
</footer>
</template>

<script>
import { mdbFooter, mdbContainer, mdbRow, mdbCol } from 'mdbvue';

export default {
  components: {
    mdbFooter, mdbContainer, mdbRow, mdbCol
  },
  props: {
    backgroundColor: String,
    type: String
  },
  data() {
    return {
      year: new Date().getFullYear(),
    };
  },
  methods: {
    scrollToElement(element, event) {
      let element_id = document.getElementById(element);
      if (element_id) {
        if (element_id.id === 'introSection'){
          element_id.scrollIntoView({ block: "end", behavior: "smooth" });
        } else {
          element_id.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      }
    }
  }
};
</script>
<style scoped>
</style>
