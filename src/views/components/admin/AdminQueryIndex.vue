<template>
<div>
  <div class="row">
    <div class="col-md-12 ">
      <p>Base Search Url: : {{searchUrl}}</p>
      <p>Records: {{sizeOfIndex}}</p>
      <p><span class="text-danger" v-if="errorMessage">{{errorMessage}}</span></p>
    </div>
  </div>
  <p><a href="https://search.brightblock.org/index/dapps/dbid.io/artwork/title?q=*" rel="noreferrer">e.g. {{searchUrl}}/index/dapps/dbid.io/artwork/title?q=*</a></p>
  <div class="row">
    <div class="col-md-12">
      <h2>Search Names</h2>
      <p><a href="#" @click.prevent="fetchAllNamesIndex">fetch all user records</a></p>
    </div>
    <form class="form-inline">
      <div class="form-group mb-2 pr-2">
        <select class="browser-default custom-select" v-model="queryNamesTerm">
          <option value="name">name</option>
          <option value="description">description</option>
          <option value="zonefile">zonefile</option>
          <option value="apps">apps</option>
        </select>
      </div>
      <div class="form-group mb-2 pr-2">
        <input class="form-control" placeholder="enter query" v-model="queryStringNames"></input>
      </div>
      <button class="btn teal lighten-1" @click="searchNamesIndex">Search</button>
    </form>
    <div class="col-md-12">
      <p><a href="#">{{searchUrl}}/index/names/query/{{queryNamesTerm}}?q={{queryStringNames}}</a></p>
    </div>
  </div>
  <h2>Search Dapps</h2>
  <form class="form-inline">
    <div class="col-md-12">
      <p><a href="#" @click.prevent="fetchAllDappsIndex">Fetch all app records</a></p>
      <p><a href="#">{{searchUrl}}/index/dapps/{{queryDomain}}/{{objType}}/{{queryDappsTerm}}?q={{queryStringDapps}}</a></p>
    </div>
    <div class="form-group mb-2 pr-2">
      <input class="form-control" placeholder="domain" v-model="queryDomain"></input>
    </div>
    <div class="form-group mb-2 pr-2">
      <select class="browser-default custom-select" v-model="objType">
        <option value="item">item</option>
        <option value="artwork">artwork</option>
        <option value="gallery">gallery</option>
        <option value="auction">auction</option>
      </select>
    </div>
    <div class="form-group mb-2 pr-2">
      <select class="browser-default custom-select" v-model="queryDappsTerm">
        <option value="title">title</option>
        <option value="description">description</option>
        <option value="keywords">keywords</option>
        <option value="owner">owner</option>
        <option value="id">id</option>
      </select>
    </div>
    <div class="form-group mb-2 pr-2">
      <input class="form-control" placeholder="enter query" v-model="queryStringDapps"></input>
    </div>
    <button class="btn teal lighten-1" @click.prevent="searchDappsIndex"><mdb-icon far icon="thumbs-up" /></button>
  </form>

  <div class="row" v-if="namesResults.length > 0">
    <div class="col-md-12 ">
      <p><small>Found: {{ namesResults.length }}  </small></p>
      <div v-for="(result, index) in namesResults" :key="index" style="padding: 10px; margin-bottom: 30px; border-radius: 10px; border: 1pt solid #ccc">
        <div class="row">
          <div class="col-md-2">{{ result.name }}</div>
          <div class="col-md-2">{{ result.description }}</div>
          <div class="col-md-8">{{ result.apps }}</div>
        </div>
        <!--
        <div class="row"><div class="col-md-4">zonefile_hash:</div> <div class="col-md-8">{{ result.zonefile_hash }}</div></div>
        <div class="row"><div class="col-md-4">last_txid:</div> <div class="col-md-8">{{ result.last_txid }}</div></div>
        <div class="row"><div class="col-md-4">status:</div> <div class="col-md-8">{{ result.status }}</div></div>
        <div class="row"><div class="col-md-4">zonefile:</div> <div class="col-md-8">{{ result.zonefile }}</div></div>
        -->
      </div>
    </div>
  </div>
  <div class="row" v-if="dappsResults.length > 0">
    <div class="col-md-12 ">
      <p><small>Found: {{ dappsResults.length }}  </small></p>
      <div v-for="(result, index) in dappsResults" :key="index" style="padding: 10px; margin-bottom: 30px; border-radius: 10px; border: 1pt solid #ccc">
        <div class="row">
          <div class="col-md-2"><img :src="result.image" alt="dsvdsvsv" width="50px"/></div>
          <div class="col-md-2">{{ result.id }}</div>
          <div class="col-md-2">{{ result.domain }}</div>
          <div class="col-md-2">{{ result.title }}</div>
          <div class="col-md-2">{{ result.owner }}</div>
          <div class="col-md-1">{{ result.buyer }}</div>
          <div class="col-md-1">{{ result.status }}</div>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import searchIndexService from "@/services/searchIndexService";
import { mdbContainer, mdbRow, mdbCol, mdbInput, mdbTextarea, mdbBtn, mdbIcon, mdbModal, mdbModalHeader, mdbModalBody, mdbModalFooter } from 'mdbvue';
import artworkSearchService from "@/services/artworkSearchService";

export default {
  name: "SearchDappsTab",
  data() {
    return {
      showFetch: false,
      showSearch: 0,
      dappsResults: [],
      namesResults: [],
      sizeOfIndex: null,
      errorMessage: null,
      queryStringNames: null,
      queryNamesTerm: "name",
      queryDappsTerm: "title",
      queryStringDapps: null,
      endPoint: "/index/dapps/dbid.io/item/title?q=*",
      objType: "item",
      queryDomain: location.hostname
    };
  },
  computed: {
    searchUrl() {
      return this.$store.state.constants.searchUrl;
    },
    domain() {
      return location.hostname;
    }
  },
  mounted() {
    searchIndexService
      .sizeOfIndex("dapps")
      .then(result => {
        this.sizeOfIndex = result;
      })
      .catch(e => {
        console.log("Unable to contact search index.", e);
      });
  },
  methods: {
    searchDappsIndex: function() {
      if (!this.queryStringDapps) {
        this.queryStringDapps = "*";
      }
      this.dappsResults = [];
      this.namesResults = [];
      let $self = this;
      searchIndexService
        .searchDappsIndex(
          this.queryDomain,
          this.objType,
          this.queryDappsTerm,
          this.queryStringDapps
        )
        .then(dappsResults => {
          this.dappsResults = dappsResults;
          dappsResults.forEach(function(result) {
            $self.fetchArtworkFile(result);
          });
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    fetchArtworkFile: function(searchResult) {
      artworkSearchService.userArtwork(Number(searchResult.id), searchResult.owner,
        function(artwork) {
          searchResult.image = artwork.artwork[0].dataUrl;
        },
        function(error) {
          console.log("Error querying in admin for recent artworks: ", error);
          searchResult.artwork = error;
        }
      );
    },

    fetchAllDappsIndex: function() {
      this.dappsResults = [];
      this.namesResults = [];
      searchIndexService
        .fetchAllDappsIndex(this.queryDappsTerm, this.queryString)
        .then(dappsResults => {
          this.dappsResults = dappsResults;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    searchNamesIndex: function() {
      if (!this.queryStringNames) {
        this.queryStringNames = "*";
      }
      this.dappsResults = [];
      this.namesResults = [];
      searchIndexService
        .searchNamesIndex(this.queryNamesTerm, this.queryStringNames)
        .then(namesResults => {
          this.namesResults = namesResults;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    fetchAllNamesIndex: function() {
      this.dappsResults = [];
      this.namesResults = [];
      searchIndexService
        .fetchAllNamesIndex(this.queryNamesTerm, this.queryString)
        .then(namesResults => {
          this.namesResults = namesResults;
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
