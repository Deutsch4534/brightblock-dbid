<template>
  <section id="AuctionSection" class="py-5">
    <mdb-row class="py-3 py-md-5 d-flex" border-top border-dark>
      <mdb-col col="12" lg="8">
        <h2 class="large-title mb-5">{{title}}</h2>
        <div class="w-100"></div>
      </mdb-col>
      <div class="col-12 border-list">
        <div class="row list-item mx-15">
          <mdb-col md="2">
            <img src="../../../assets/img/bitcoin_swan.jpg" class="img-square"
                 alt="...">
          </mdb-col>
          <mdb-col md="6">
            <h3 class="h4-responsive text-uppercase my-2"><a>Title</a></h3>
            <p>{{description}}</p>
            <p class="font-weight-bold mb-0">Time: 2D 4H 30M 10S</p>
          </mdb-col>
          <mdb-col md="4" lg="2" offsetLg="2" class="d-flex align-items-center justify-content-end">
            <!-- TODO: add router link to auction page -->
            <a class="btn btn-rounded btn-lg btn-dark mx-0">Register</a>
          </mdb-col>
        </div>
      </div>
    </mdb-row>
  </section>
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
      mdbCardBody
    },
    data() {
      return {
        title: "First Auction on Radicle",
        description: "Brightblock and Radicle are starting things off with an auction for 50 digital copies of Black Swan, from author",
      };
    }
  };
</script>
