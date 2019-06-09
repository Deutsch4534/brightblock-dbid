<template>
  <section id="AudienceSection" class="py-5">
    <mdb-row class="d-flex py-3 py-md-5">
      <mdb-col col="12">
        <h2 class="large-title mb-5">{{title}}</h2>
      </mdb-col>
      <mdb-col md="12" lg="10" class="border-list">
        <div class="list-item">
          <mdb-col col="12" class="pl-0">
            <h3 class="h2-responsive mb-3">
              <mdb-icon far icon="address-book" class="mr-4"/>
              {{cardTitle1}}
            </h3>
          </mdb-col>
          <mdb-col col="12" lg="10" xl="9" class="pl-0">
            <p class="card-text" v-html="cardDescription1"></p>
          </mdb-col>
        </div>
        <div class="list-item">
          <mdb-col col="12" class="pl-0">
            <h3 class="h2-responsive mb-3">
              <mdb-icon far icon="bookmark" class="mr-4"/>
              {{cardTitle2}}
            </h3>
          </mdb-col>
          <mdb-col col="12" lg="10" xl="9" class="pl-0">
            <p class="card-text" v-html="cardDescription2"></p>
          </mdb-col>
        </div>
        <div class="list-item">
          <mdb-col col="12" class="pl-0">
            <h3 class="h2-responsive mb-3">
              <mdb-icon icon="university" class="mr-4"/>
              {{cardTitle3}}
            </h3>
          </mdb-col>
          <mdb-col col="12" lg="10" xl="9" class="pl-0">
            <p class="card-text" v-html="cardDescription3"></p>
          </mdb-col>
        </div>
      </mdb-col>
    </mdb-row>
  </section>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbBtn, mdbIcon, mdbInput, mdbTextarea, mdbCard, mdbCardBody } from 'mdbvue';

export default {
  name: 'AudienceSection',
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbBtn,
    mdbIcon,
    mdbInput,
    mdbTextarea,
    mdbCard,
    mdbCardBody
  },
  data() {
    return {
      title: "WHO IS IT FOR?",
      cardTitle1: "ARTISTS",
      cardDescription1: "",
      cardTitle2: "COLLECTORS",
      cardDescription2: "",
      cardTitle3: "GALLERIES",
      cardDescription3: "",
    };
  },
  created() {
    let content = this.$store.state.contentStore.content["index-page"];
    this.title = content["section-whofor-title"][0].text;
    this.cardDescription1 = content["section-whofor1"][0].text;
    this.cardDescription2 = content["section-whofor2"][0].text;
    this.cardDescription3 = content["section-whofor3"][0].text;
  }
};
</script>

<style scoped>



</style>
