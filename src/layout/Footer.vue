<template>
<footer class="container-fluid text-black page-footer bg-dark text-white">
    <mdb-row class="d-flex flex-row text-right align-items-center py-2">
      <mdb-col col="12">
        <span class="mr-3"><a href="https://medium.com/@radicleart" target="_blank" rel="noreferrer"><mdb-icon fab icon="medium" /></a></span>
        <span class="mx-3"><a href="https://twitter.com/radicleart" target="_blank" rel="noreferrer"><mdb-icon fab icon="twitter" /></a></span>
        <span class="mr-3"><a href="https://github.com/radicleart/brightblock-oam" target="_blank" rel="noreferrer"><mdb-icon fab icon="github" /></a></span>
      </mdb-col>
    </mdb-row>
</footer>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbIcon } from 'mdbvue';

export default {
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbIcon
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
