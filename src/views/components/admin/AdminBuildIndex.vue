<template>
<mdb-container>
  <div class="row">
    <div class="col-md-12">
      <p>Base Search Url: : {{searchUrl}}</p>
      <p>Records: {{sizeOfIndex}}</p>
      <p><span class="text-danger" v-if="errorMessage">{{errorMessage}}</span></p>
    </div>
  </div>
  <div class="row">
    <div class="col-md-12">
      <ul>
        <li><a href="#" @click.prevent="clearNamesIndex">Clear names index</a></li>
        <li><a href="#" @click.prevent="clearDappsIndex">Clear dapps index</a></li>
      </ul>
    </div>
  </div>

  <div class="row">
    <div class="col-md-12">
      <form class="form-inline">
        <div class="form-group mb-2">
          <input class="form-control" type="number" v-model="fromPage" placeholder="from page"></input>
        </div>
        <div class="form-group mb-2">
          <input class="form-control" type="number" v-model="toPage" placeholder="to page"></input>
        </div>
        <button class="btn-block teal lighten-1" @click.prevent="indexPages">go</button>
        <p class="text-warning" v-html="indexPagesResult"></p>
      </form>
    </div>
  </div>

  <div class="row">
    <div class="col-md-12">
      <form class="form">
        <div class="form-group mb-2">
          <input class="form-control" v-model="users" placeholder="comma separated user names"></input>
        </div>
        <button class="btn teal lighten-1" @click="indexUsers">go</button>
        <p class="text-warning" v-html="indexUsersResult"></p>
      </form>
    </div>
  </div>

  <div class="row">
    <div class="col-md-12">
      {{namesResults}}
    </div>
  </div>
</mdb-container>
</template>

<script>
import searchIndexService from "@/services/searchIndexService";
import { mdbContainer, mdbRow, mdbCol, mdbInput, mdbTextarea, mdbBtn, mdbIcon, mdbModal, mdbModalHeader, mdbModalBody, mdbModalFooter } from 'mdbvue';

export default {
  name: "SearchBuilderTab",
  data() {
    return {
      showClear: false,
      showBuild1: false,
      showSearch: false,
      showBuild2: false,
      namesResults: null,
      endPoint: "/index/dapps/fetch",
      users: "brightblock.id,mike.personal.id,rosemarry.id.blockstack,antoniomeic.id.blockstack",
      fromPage: null,
      toPage: null,
      sizeOfIndex: null,
      errorMessage: null,
      indexUsersResult: null,
      indexPagesResult: null
    };
  },
  mounted() {
    searchIndexService
      .sizeOfIndex()
      .then(result => {
        this.sizeOfIndex = result;
      })
      .catch(e => {
        console.log("Unable to contact search index.", e);
      });
  },
  computed: {
    searchUrl() {
      return this.$store.state.constants.searchUrl;
    }
  },
  methods: {
    indexUsers: function() {
      this.indexUsersResult = "this take a few minutes and runs in the background - check results on the query page";
      searchIndexService
        .indexUsers(this.users)
        .then(result => {
          this.indexUsersResult = result;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    indexPages: function() {
      if (!this.fromPage || !this.toPage) {
        this.errorMessage =
          "Please enter the page numbers to build the index from and to.";
        return;
      }
      this.indexPagesResult = "this take a few minutes and runs in the background - check results on the query page";
      searchIndexService
        .indexPages(this.fromPage, this.toPage)
        .then(result => {
          this.result = result;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    clearDappsIndex: function() {
      searchIndexService
        .clearDappsIndex()
        .then(result => {
          this.sizeOfIndex = result;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    clearNamesIndex: function() {
      searchIndexService
        .clearNamesIndex()
        .then(result => {
          this.sizeOfIndex = result;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    }
  },
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbInput,
    mdbTextarea,
    mdbBtn,
    mdbIcon,
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
    mdbModalFooter
  }
};
</script>
