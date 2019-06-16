import xhrService from "@/services/xhrService";
import taxonomyService from "@/services/taxonomyService";

const contentStore = {
  namespaced: true,
  state: {
    content: {},
    taxonomy: []
  },
  getters: {
    getTaxonomy: state => {
      return state.taxonomy;
    },
    getContent: state => pageId => {
      let matches = state.content.filter(content => content.pages.id === pageId);
      return matches;
    },
    getAnswers: state => questionId => {
      let matches = state.content["answers"];
      return matches;
    },
    getIndex: state => {
      return state.content.index;
    },
  },
  mutations: {
    addTaxonomy(state, taxonomy) {
      state.taxonomy = taxonomy;
    },
    mainContent(state, o) {
      state.content["main-content"] = o;
    },
    helpList(state, o) {
      state.content["help-list"] = o;
    },
    answers(state, o) {
      state.content["answers"] = o;
    },
  },
  actions: {
    fetchMediumArticles: function({ commit }, pair) {
      return new Promise(resolve => {
        const url = "https://medium.com/@radicleart/latest?format=json";
        xhrService.makeDirectCall(url).then(function(articles) {
          resolve(articles);
        });
      });
    },
    fetchTaxonomy: function({ state, commit }) {
      return new Promise(resolve => {
        let taxonomy = state.taxonomy;
        if (taxonomy && taxonomy.length > 0) {
          resolve(taxonomy);
        } else {
          taxonomyService.getTaxonomy().then(taxonomy => {
            commit("addTaxonomy", taxonomy);
            resolve(taxonomy);
          });
        }
      });
    }
  }
};
export default contentStore;
