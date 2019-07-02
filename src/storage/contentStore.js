import xhrService from "@/services/xhrService";
import tradingService from "brightblock-lib/src/services/tradingService";

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
    getCategory: state => categoryName => {
      let matches = state.taxonomy.filter(category => category.name === categoryName);
      if (matches && matches.length > 0) {
        return matches;
      }
    },
    getLevel1: state => {
      let matches = state.taxonomy.filter(category => category.level === 1);
      if (matches && matches.length > 0) {
        return matches;
      }
    },
    getContent: state => pageId => {
      let matches = state.content.filter(content => content.pages.id === pageId);
      return matches;
    },
    getMainContent: state => {
      return state.content["main-content"];
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
    addCategory(state, category) {
      state.taxonomy.push(category);
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
        const url = "https://medium.com/@radiclesociety/latest?format=json";
        xhrService.makeDirectCall(url).then(function(articles) {
          resolve(articles);
        })
          .catch(error => {
            console.log(error);
            resolve();
          });
      });
    },
    sendCheckEmailCode: function({ commit }, email) {
      return new Promise(resolve => {
        tradingService.sendCheckEmailCode(email).then(response => {
          resolve(response);
        })
          .catch(error => {
            console.log(error);
            resolve();
          });
      });
    },
    sendVerifyEmail: function({ commit }, email) {
      return new Promise(resolve => {
        tradingService.sendVerifyEmail(email).then(response => {
          resolve(response);
        })
          .catch(error => {
            console.log(error);
            resolve();
          });
      });
    },
    sendContactEmail: function({ commit }, email) {
      return new Promise(resolve => {
        tradingService.sendContactEmail(email).then(response => {
          resolve(response);
        })
          .catch(error => {
            console.log(error);
            resolve();
          });
      });
    },
    fetchTaxonomy: function({ state, commit }) {
      return new Promise(resolve => {
        let taxonomy = state.taxonomy;
        if (taxonomy && taxonomy.length > 0) {
          resolve(taxonomy);
        } else {
          tradingService.getTaxonomy().then(taxonomy => {
            commit("addTaxonomy", taxonomy);
            resolve(taxonomy);
          })
            .catch(error => {
              console.log(error);
              resolve();
            });
        }
      });
    },
    addCategory: function({ state, commit, getters }, category) {
      return new Promise(resolve => {
        let cat = getters.getCategory(category.name);
        if (cat) {
          resolve(cat);
        } else {
          tradingService.addCategory(category).then(category => {
            commit("addCategory", category);
            resolve(category);
          })
            .catch(error => {
              console.log(error);
              resolve();
            });
        }
      });
    }
  }
};
export default contentStore;
