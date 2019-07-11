import xhrService from "@/services/xhrService";
import utils from "@/services/utils";
import tradingService from "brightblock-lib/src/services/tradingService";
import _ from "lodash";

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
    getParents: state => categories => {
      _.forEach(categories, function(category) {
        if (!category.id) {
          let thisCat = state.taxonomy.find(cat => cat.name === category.name && cat.parent === category.parent);
          if (thisCat) {
            category.id = thisCat.id;
            category.level = thisCat.level;
            category.parent = thisCat.parent;
          }
        }
        let parentName = category.parent;
        let parents = state.taxonomy.filter(category => category.level === 2);
        let parent = parents.find(category => category.parent === parentName);
        if (!parent) return;
        let existsIndex = _.findIndex(categories, function(existCat) {
          return existCat.id === parent.id;
        });
        if (existsIndex === -1) {
          categories.push(parent);
        }
        let gparent = state.taxonomy.find(cat => cat.level === 1 && cat.name === parent.parent);
        if (!gparent) return;
        existsIndex = _.findIndex(categories, function(existCat) {
          return existCat.id === gparent.id;
        });
        if (existsIndex === -1) {
          categories.push(gparent);
        }
      });
      return categories;
    },
    getCategory: state => categoryId => {
      let match = state.taxonomy.find(category => category.id === categoryId);
      return match;
    },
    getLevel2Tree: state => {
      let results = [];
      let l2matches;
      let l1matches = state.taxonomy.filter(category => category.level === 1);
      l1matches = utils.sortCollection(l1matches, "name");
      _.forEach(l1matches, function(l1match) {
        l2matches = state.taxonomy.filter(category => category.level === 2 && category.parent === l1match.name);
        l2matches = utils.sortCollection(l2matches, "name");
        _.forEach(l2matches, function(l2match) {
          results.push({
            value: l2match.id,
            text: l1match.name + " ---> " + l2match.name,
          });
        });
      });
      return results;
    },
    getLevel1Tree: state => {
      let results = [];
      let matches = state.taxonomy.filter(category => category.level === 1);
      matches = utils.sortCollection(matches, "name");
      _.forEach(matches, function(match) {
        results.push({
          value: match.id,
          text: match.name,
        });
      });
      return results;
    },
    getLevel2SubTree: state => l1match => {
      let results = [];
      let matches = state.taxonomy.filter(category => category.level === 2 && category.parent === l1match.name);
      matches = utils.sortCollection(matches, "name");
      _.forEach(matches, function(match) {
        results.push({
          value: match.id,
          text: match.name,
        });
      });
      return results;
    },
    getLevel3SubTree: state => l2match => {
      let results = [];
      let matches = state.taxonomy.filter(category => category.level === 3 && category.parent === l2match.name);
      matches = utils.sortCollection(matches, "name");
      _.forEach(matches, function(match) {
        results.push({
          value: match.id,
          text: match.name,
        });
      });
      return results;
    },
    getLevel1: state => {
      let matches = state.taxonomy.filter(category => category.level === 1);
      matches = utils.sortCollection(matches, "name");
      if (matches && matches.length > 0) {
        return matches;
      }
    },
    getLevel2: state => category => {
      let matches = state.taxonomy.filter(cat => cat.level === 2 && cat.parent === category.name);
      matches = utils.sortCollection(matches, "name");
      if (matches && matches.length > 0) {
        return matches;
      }
    },
    getLevel3: state => category => {
      let matches = state.taxonomy.filter(cat => cat.level === 3 && cat.parent === category.name);
      matches = state.taxonomy.filter(cat => cat.parent === category.name);
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
    addCategories(state, categories) {
      state.taxonomy.push(categories);
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
    sendPurchaseEmail: function({ commit }, email) {
      return new Promise(resolve => {
        tradingService.sendPurchaseEmail(email).then(response => {
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
    },
    checkNewCategories: function({ state, commit, getters }, categories) {
      return new Promise(resolve => {
        if (!categories || categories.length === 0) {
          return;
        }
        let newCats = [];
        _.forEach(categories, function(category) {
          if (!category.id) {
            newCats.push(category);
          }
        });
        tradingService.addNewCategories(newCats).then(categories => {
          commit("addCategories", categories);
          resolve(categories);
        })
          .catch(error => {
            console.log(error);
            resolve();
          });
      });
    }
  }
};
export default contentStore;
